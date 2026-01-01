import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { NavLink } from '../navbar.model';
import { getShortNameUtil } from '../../../utils/main.projects.utils';
import { SrpAuthService } from '../../../pages/login-page/srp-auth';
import { ToastService } from '../../reusable-toast/toast-service';

import { ConfirmDelete } from '../../confirm-delete/confirm-delete';
import { clearUser } from '../../../store/actions';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, ConfirmDelete],
  templateUrl: './dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css'],
})
export class DashboardNavbar {
  navLinks = input<NavLink[]>([]);
  logoUrl = input<string>('');
  showProfileName = input<boolean>(false);
  showProfileImage = input<boolean>(false);
  profileImage = input<string>('');
  profileName = input<string>('');
  collapsed = signal(true);
  isDarkMode = input<boolean>(true);
  themeToggled = output<boolean>();

  private auth = inject(SrpAuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private store = inject(Store);
  private setDarkMode() {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    this.themeToggled.emit(true);
  }

  showLogoutModal = signal(false);

  toggle() {
    this.collapsed.update((v) => !v);
  }

  logout() {
    this.showLogoutModal.set(true);
  }
  async handleLogout(result: any) {
    this.showLogoutModal.set(false);
    const confirmed = result === true || result?.confirmed === true;
    if (!confirmed) return;

    try {
      await this.auth.logout();

      this.store.dispatch(clearUser());
      this.setDarkMode();

      this.toast.showMessage({ id: 1, type: 'success', text: 'Logged out successfully.' });
      this.router.navigate(['/']);
    } catch (error: any) {
      const msg = error?.error?.error || error?.message || 'Logout failed. Please try again.';
      this.toast.showMessage({ id: 1, type: 'error', text: msg });
    }
  }

  getShortName(name: string) {
    return getShortNameUtil(name);
  }

  toggleTheme() {
    const nextIsDark = !this.isDarkMode();
    document.body.classList.toggle('light', !nextIsDark);
    document.body.classList.toggle('dark', nextIsDark);
    this.themeToggled.emit(nextIsDark);
  }
}
