import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { DashboardInfoPanel } from '../../../components/dashboard-info-panel/dashboard-info-panel';
import { FormsModule } from '@angular/forms';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ToastService } from '../../../components/reusable-toast/toast-service';
import { selectUser } from '../../../store/selectors';
import { FloatingField } from '../../../components/floating-field/floating-field';
import { ChangePassword } from '../../../services/change-password';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DashboardInfoPanel, FormsModule, NgIf, AsyncPipe, MatIconModule, FloatingField],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private store = inject(Store);
  private toast = inject(ToastService);
  private changePassword = inject(ChangePassword);
  private router = inject(Router);

  user$: Observable<any> = this.store.select(selectUser);

  passwords = {
    current: '',
    new: '',
    confirm: '',
  };

  loading = false;

  async updatePassword(user: any) {
    const email = (user?.email || '').trim().toLowerCase();
    if (!email) {
      this.toast.showMessage({
        id: 1,
        type: 'error',
        text: 'User email missing. Please re-login.',
      });
      return;
    }

    const { current, new: newPass, confirm } = this.passwords;

    if (!current || !newPass || !confirm) {
      this.toast.showMessage({ id: 1, type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (newPass.length < 8) {
      this.toast.showMessage({
        id: 1,
        type: 'error',
        text: 'New password must be at least 8 characters.',
      });
      return;
    }
    if (newPass !== confirm) {
      this.toast.showMessage({
        id: 1,
        type: 'error',
        text: 'New password and confirm password do not match.',
      });
      return;
    }

    this.loading = true;

    try {
      await this.changePassword.changePassword(email, current, newPass);

      this.toast.showMessage({
        id: 1,
        type: 'success',
        text: 'Password updated. Redirecting to login...',
      });

      this.passwords = { current: '', new: '', confirm: '' };
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (error: any) {
      const backendMessage =
        error?.error?.error || error?.error?.details || error?.message || 'Password update failed.';
      this.toast.showMessage({ id: 1, type: 'error', text: backendMessage });
    } finally {
      this.loading = false;
    }
  }
}
