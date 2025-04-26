import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  isLoginMode = true;
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router

  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  async onSubmit() {
    if (!this.isLoginMode && this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      if (this.isLoginMode) {
        await this.supabaseService.signIn(this.email, this.password);
        this.router.navigate(['/tabela']);
      } else {
        await this.supabaseService.signUp(this.email, this.password);
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.isLoginMode = true;
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  }
}