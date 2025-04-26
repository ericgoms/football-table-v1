import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

export interface Team {
  id: string;
  name: string;
  emblem_url: string;
  total_score: number;
  min_score: number;
  max_score: number;
}

export interface TeamScoreInput {
  team_id: string;
  round_num: number;
  score: number;
}

export interface TeamScore {
  team_id: string;
  round_num: number;
  score: number;
  teams: {
    name: string;
    emblem_url: string;
    total_score: number;
    min_score: number;
    max_score: number;
  };
}

interface SupabaseTeamScore {
  team_id: string;
  round_num: number;
  score: number;
  teams: {
    name: string;
    emblem_url: string;
    total_score: number;
    min_score: number;
    max_score: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;

  constructor(private toast: ToastService) {
    if (!environment.supabaseUrl || !environment.supabaseKey) {
      console.error('Supabase credentials not found');
      this.toast.showToast('Erro de configuração do Supabase', 'error');
    } else {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
  }

  async getTeams(): Promise<Team[]> {
    try {
      const { data, error } = await this.supabase
        .from('teams')
        .select('*')
        .order('total_score', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  async getRoundScores(round: number): Promise<TeamScore[]> {
    try {
      // Primeiro busca todos os times
      const { data: teams, error: teamsError } = await this.supabase
        .from('teams')
        .select('*');

      if (teamsError) throw teamsError;

      // Depois busca as pontuações da rodada
      const { data: scores, error: scoresError } = await this.supabase
        .from('team_scores')
        .select(`
          team_id,
          round_num,
          score,
          teams:team_id (
            name,
            emblem_url,
            total_score,
            min_score,
            max_score
          )
        `)
        .eq('round_num', round);

      if (scoresError) throw scoresError;

      // Cria um mapa das pontuações por time
      const scoresMap = new Map(
        (scores as unknown as SupabaseTeamScore[]).map(score => [score.team_id, score])
      );

      // Combina todos os times com suas pontuações
      return teams.map(team => {
        const score = scoresMap.get(team.id);
        if (score) {
          return {
            team_id: team.id,
            round_num: round,
            score: score.score,
            teams: {
              name: team.name,
              emblem_url: team.emblem_url,
              total_score: team.total_score,
              min_score: team.min_score,
              max_score: team.max_score
            }
          };
        } else {
          return {
            team_id: team.id,
            round_num: round,
            score: 0,
            teams: {
              name: team.name,
              emblem_url: team.emblem_url,
              total_score: team.total_score,
              min_score: team.min_score,
              max_score: team.max_score
            }
          };
        }
      }).sort((a, b) => b.score - a.score); // Ordena por pontuação decrescente
    } catch (error) {
      console.error('Error fetching round scores:', error);
      throw error;
    }
  }

  async addTeam(team: Omit<Team, 'id'>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('teams')
        .insert([team]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  }

  async addScore(score: TeamScoreInput): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('team_scores')
        .insert([score]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding score:', error);
      throw error;
    }
  }

  async addMultipleScores(scores: TeamScoreInput[]): Promise<void> {
    try {
      for (const score of scores) {
        const { data, error: fetchError } = await this.supabase
          .from('team_scores')
          .select('id')
          .eq('team_id', score.team_id)
          .eq('round_num', score.round_num)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "no rows found" error
          throw fetchError;
        }

        if (data) {
          // Update existing score
          const { error: updateError } = await this.supabase
            .from('team_scores')
            .update({ score: score.score })
            .eq('id', data.id);

          if (updateError) throw updateError;
        } else {
          // Insert new score
          const { error: insertError } = await this.supabase
            .from('team_scores')
            .insert([score]);

          if (insertError) throw insertError;
        }
      }
    } catch (error) {
      console.error('Error adding or updating scores:', error);
      throw error;
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    try {
      // Primeiro deleta os scores associados ao time
      const { error: scoresError } = await this.supabase
        .from('team_scores')
        .delete()
        .eq('team_id', teamId);

      if (scoresError) {
        throw scoresError;
      }

      // Depois deleta o time
      const { error: teamError } = await this.supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (teamError) {
        throw teamError;
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  // Observar atualizações em tempo real (opcional)
  subscribeScores(callback: (payload: any) => void) {
    console.log('Iniciando subscription de pontuações...');
    return this.supabase
      .channel('team_scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, callback)
      .subscribe();
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signUp({ email, password });
      if (error) throw error;
      this.toast.showToast('Conta criada com sucesso!', 'success');
    } catch (error) {
      console.error('Error during sign-up:', error);
      this.toast.showToast('Falha ao criar conta.', 'error');
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.toast.showToast('Logado com sucesso!', 'success');
    } catch (error) {
      console.error('Error during sign-in:', error);
      this.toast.showToast('Falha ao fazer login.', 'error');
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        return false;
      }
      return !!data.session;
    } catch (error) {
      console.error('Erro inesperado ao verificar sessão:', error);
      return false;
    }
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session ? data.session.access_token : null;
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      this.toast.showToast('Deslogado com sucesso!', 'success');
    } catch (error) {
      console.error('Error during logout:', error);
      this.toast.showToast('Falha ao deslogar.', 'error');
    }
  }
}