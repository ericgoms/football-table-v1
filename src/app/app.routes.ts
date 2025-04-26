import { Routes } from '@angular/router';
import { ScoreTableComponent } from './pages/score-table/score-table.component';
import { TeamFormComponent } from './pages/team-form/team-form.component';
import { RoundScoresComponent } from './pages/round-scores/round-scores.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.supabaseService.isLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, data: { hideNavbarFooter: true } },
  { path: 'tabela', component: ScoreTableComponent, canActivate: [AuthGuard] },
  { path: 'adicionar-time', component: TeamFormComponent, canActivate: [AuthGuard] },
  { path: 'rodada', component: RoundScoresComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home' }
];
