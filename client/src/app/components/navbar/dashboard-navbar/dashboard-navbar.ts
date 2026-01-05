import { Component, inject, input, output, signal, OnInit, OnDestroy } from '@angular/core';
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
import { AppNotification } from '../../app-notification/app-notification';
import { SocketService } from '../../../services/socket.service';
import { selectUser } from '../../../store/selectors';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    ConfirmDelete,
    AppNotification,
  ],
  templateUrl: './dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css'],
})
export class DashboardNavbar implements OnInit, OnDestroy {
  // --- Inputs ---
  navLinks = input<NavLink[]>([]);
  logoUrl = input<string>('');
  showProfileName = input<boolean>(false);
  showProfileImage = input<boolean>(false);
  profileImage = input<string>('');
  profileName = input<string>('');
  isDarkMode = input<boolean>(true);

  themeToggled = output<boolean>();

  collapsed = signal(true);
  showNotificationModal = signal(false);
  showLogoutModal = signal(false);
  unread = signal(false); 
  notifications = signal<any[]>([]);

  private auth = inject(SrpAuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private store = inject(Store);
  private socket = inject(SocketService);

  private userState = this.store.selectSignal(selectUser);
  private offMessage?: () => void;

  ngOnInit(): void {
    this.socket.connect();

    const userId = String(this.userState()?.id);
    if (userId && userId !== 'undefined') {
      this.socket.registerUser(userId);
    }

    const storedMessages = this.socket.getMessages();
    if (storedMessages.length > 0) {
      this.notifications.set(storedMessages);
      this.unread.set(true);
    }

    this.offMessage = this.socket.onMessage((data) => {
      this.notifications.update((arr) => [data, ...arr]);
      this.unread.set(true);
    });
  }

  ngOnDestroy(): void {
    this.offMessage?.();
  }
  toggle() {
    this.collapsed.update((v) => !v);
  }
  toggleTheme() {
    const nextIsDark = !this.isDarkMode();
    document.body.classList.toggle('light', !nextIsDark);
    document.body.classList.toggle('dark', nextIsDark);
    this.themeToggled.emit(nextIsDark);
  }

  toggleNotificationModal() {
    const next = !this.showNotificationModal();
    this.showNotificationModal.set(next);
    if (next) this.unread.set(false);
  }

  toggleProfile() {
    this.router.navigate(['/dashboard/settings']);
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

      this.offMessage?.();
      this.socket.disconnect();

      this.store.dispatch(clearUser());
      this.toast.showMessage({
        id: 1,
        type: 'success',
        text: 'Logged out successfully.',
      });
      this.router.navigate(['/']);
    } catch (error: any) {
      const msg = error?.error?.error || error?.message || 'Logout failed. Please try again.';
      this.toast.showMessage({ id: 1, type: 'error', text: msg });
    }
  }

  getShortName(name: string) {
    return getShortNameUtil(name);
  }
}
