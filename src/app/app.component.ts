import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router, Event } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SupabaseService } from './services/supabase.service';
import { ToastService, Toast } from './services/toast.service';
import { Observable } from 'rxjs';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isMobileMenuOpen = false;
  isDarkTheme = true; // Default to dark theme
  isLoading = false;
  showNavbarFooter = true;
  isLoggedIn: boolean = false;
  isSidebarHidden = true;
  toasts$: Observable<Toast[]>;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {
    // Subscribe to theme changes
    this.themeService.isDarkTheme$.subscribe((isDark: boolean) => {
      this.isDarkTheme = isDark;
    });

    // Subscribe to router events to check for hideNavbarFooter
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.routerState.root.snapshot.firstChild;
        this.showNavbarFooter = !(currentRoute?.data?.['hideNavbarFooter'] ?? false);
      }
    });

    // Check login status on route changes
    this.router.events.subscribe(async (event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = await this.supabaseService.isLoggedIn();
        this.cdr.detectChanges();
      }
    });

    this.checkLoginStatus();

    // Subscribe to toasts
    this.toasts$ = this.toastService.toasts$;
  }

  ngOnInit() {
    this.adjustSidebarBehavior();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (this.isMobile()) {
          this.isSidebarHidden = true;
        }
      }
    });
  }

  adjustSidebarBehavior() {
    if (this.isMobile()) {
      this.isSidebarHidden = true;
    } else {
      this.isSidebarHidden = false;
    }
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  async checkLoginStatus() {
    this.isLoggedIn = await this.supabaseService.isLoggedIn();
    this.cdr.detectChanges();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  testSpinner() {
    this.isLoading = true;
    // Simula um carregamento de 3 segundos
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  async logout() {
    await this.supabaseService.logout();
    this.isLoggedIn = false;
    this.cdr.detectChanges();
    this.router.navigate(['/login']);
    this.isMobileMenuOpen = false;
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  toggleSidebarVisibility() {
    if (!this.isMobile()) return
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
