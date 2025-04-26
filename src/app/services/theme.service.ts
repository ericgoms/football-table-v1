import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'dark-theme';
  private isDarkThemeSubject = new BehaviorSubject<boolean>(this.getStoredTheme());
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor() {
    this.applyTheme(this.isDarkThemeSubject.value);
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(newTheme);
    this.applyTheme(newTheme);
    this.storeTheme(newTheme);
  }

  private getStoredTheme(): boolean {
    const storedTheme = localStorage.getItem(this.THEME_KEY);
    return storedTheme ? JSON.parse(storedTheme) : false;
  }

  private storeTheme(isDark: boolean): void {
    localStorage.setItem(this.THEME_KEY, JSON.stringify(isDark));
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
} 