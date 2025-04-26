import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent {
  teamName = '';
  emblemUrl = '';
  isLoading = false;

  constructor(
    private supabase: SupabaseService,
    private toast: ToastService,
    private router: Router
  ) {}

  async addTeam() {
    if (!this.teamName || !this.emblemUrl) {
      this.toast.showToast('Preencha todos os campos', 'error');
      return;
    }

    this.isLoading = true;
    try {
      await this.supabase.addTeam({
        name: this.teamName,
        emblem_url: this.emblemUrl,
        total_score: 0,
        min_score: 0,
        max_score: 0
      });
      
      this.toast.showToast('Time adicionado com sucesso', 'success');
      this.teamName = '';
      this.emblemUrl = '';
    } catch (error) {
      console.error('Erro ao adicionar time:', error);
      this.toast.showToast('Erro ao adicionar time', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
