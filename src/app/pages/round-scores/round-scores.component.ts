import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SupabaseService, TeamScoreInput } from '../../services/supabase.service';
import { ToastService } from '../../services/toast.service';

interface TeamDisplay {
  id: string;
  team: string;
  emblem: string;
  score: number;
}

@Component({
  selector: 'app-round-scores',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './round-scores.component.html',
  styleUrls: ['./round-scores.component.scss']
})
export class RoundScoresComponent implements OnInit {
  displayedColumns: string[] = ['position', 'team', 'score'];
  teams: TeamDisplay[] = [];
  round: number = 1;
  isLoading: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  async loadTeams(): Promise<void> {
    this.isLoading = true;
    try {
      const teams = await this.supabaseService.getTeams();
      const scores = await this.supabaseService.getRoundScores(this.round);
      
      this.teams = teams.map(team => {
        const teamScore = scores.find(s => s.team_id === team.id);
        return {
          id: team.id,
          team: team.name,
          emblem: team.emblem_url,
          score: teamScore ? teamScore.score : 0
        };
      });
    } catch (error) {
      console.error('Error loading teams:', error);
      this.toast.showToast('Erro ao carregar times', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async previousRound(): Promise<void> {
    if (this.round > 1) {
      this.round--;
      await this.loadTeams();
    }
  }

  async nextRound(): Promise<void> {
    if (this.round < 38) {
      this.round++;
      await this.loadTeams();
    }
  }

  async saveScores(): Promise<void> {
    if (this.isLoading) return;
    
    const hasEmptyScores = this.teams.some(team => team.score === 0);
    if (hasEmptyScores) {
      this.toast.showToast('Preencha a pontuação de todos os times', 'error');
      return;
    }
    
    this.isLoading = true;
    try {
      const scores: TeamScoreInput[] = this.teams.map(team => ({
        team_id: team.id,
        round_num: this.round,
        score: team.score
      }));

      await this.supabaseService.addMultipleScores(scores);
      await this.loadTeams();
      this.toast.showToast('Pontuações salvas com sucesso!', 'success');
    } catch (error) {
      console.error('Error saving scores:', error);
      this.toast.showToast('Erro ao salvar pontuações', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
