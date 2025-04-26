import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService, TeamScore, Team } from '../../services/supabase.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

interface RoundScore {
  team_id: string;
  team_name: string;
  emblem_url: string;
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

@Component({
  selector: 'app-score-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ConfirmationModalComponent
  ],
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {
  teams: Team[] = [];
  roundScores: RoundScore[] = [];
  showRoundScores = false;
  round = 1;
  isLoading = false;
  isLoadingRound = false;
  isDeleteModalOpen = false;
  teamToDelete: Team | null = null;

  constructor(
    private supabase: SupabaseService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    await this.loadTeams();
  }

  async loadTeams() {
    this.isLoading = true;
    try {
      this.teams = await this.supabase.getTeams();
    } catch (error) {
      this.toast.showToast('Erro ao carregar times', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async loadRoundScores() {
    this.isLoadingRound = true;
    try {
      const scores = await this.supabase.getRoundScores(this.round);
      this.roundScores = scores.map(score => ({
        team_id: score.team_id,
        team_name: score.teams.name,
        emblem_url: score.teams.emblem_url,
        round_num: score.round_num,
        score: score.score,
        teams: score.teams
      }));
    } catch (error) {
      console.error('Error loading scores:', error);
      this.toast.showToast('Erro ao carregar pontuações', 'error');
    } finally {
      this.isLoadingRound = false;
    }
  }

  async toggleView() {
    this.showRoundScores = !this.showRoundScores;
    if (this.showRoundScores) {
      await this.loadRoundScores();
    } else {
      await this.loadTeams();
    }
  }

  onRoundChange(selectedRound?: number) {
    if (selectedRound) {
      this.round = selectedRound;
    }
    this.loadRoundScores();
  }

  openDeleteModal(team: Team) {
    this.teamToDelete = team;
    this.isDeleteModalOpen = true;
  }

  findTeamByScore(score: RoundScore): Team | undefined {
    return this.teams.find(t => t.id === score.team_id);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.teamToDelete = null;
  }

  async confirmDelete() {
    if (this.teamToDelete) {
      try {
        await this.supabase.deleteTeam(this.teamToDelete.id);
        this.toast.showToast('Time excluído com sucesso!', 'success');
        this.closeDeleteModal();
        await this.loadTeams();
        if (this.showRoundScores) {
          await this.loadRoundScores();
        }
      } catch (error) {
        console.error('Error deleting team:', error);
        this.toast.showToast('Erro ao excluir time', 'error');
      }
    }
  }
}
