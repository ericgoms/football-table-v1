import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Team {
  id: number;
  name: string;
  totalScore: number;
  roundScores: { round: number; score: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Team[] = [];
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  teams$ = this.teamsSubject.asObservable();
  private currentRound = 1;

  constructor() {
    // Carregar dados do localStorage se existirem
    // const savedTeams = localStorage.getItem('teams');
    // if (savedTeams) {
    //   this.teams = JSON.parse(savedTeams);
    //   this.teamsSubject.next(this.teams);
    // }
  }

  addTeam(name: string): void {
    const newTeam: Team = {
      id: Date.now(),
      name,
      totalScore: 0,
      roundScores: []
    };
    this.teams.push(newTeam);
    this.saveTeams();
  }

  addRoundScore(teamId: number, score: number): void {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      team.roundScores.push({ round: this.currentRound, score });
      team.totalScore += score;
      this.saveTeams();
    }
  }

  nextRound(): void {
    this.currentRound++;
  }

  getCurrentRound(): number {
    return this.currentRound;
  }

  private saveTeams(): void {
    this.teamsSubject.next(this.teams);
    localStorage.setItem('teams', JSON.stringify(this.teams));
  }
}
