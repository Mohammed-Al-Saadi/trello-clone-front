import { Component } from '@angular/core';
import { DashboardInfoPanel } from '../../../components/dashboard-info-panel/dashboard-info-panel';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  imports: [DashboardInfoPanel, FormsModule, NgIf, MatIconModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  // Static user info (hardcoded)
  user = {
    fullName: 'Mohammed Al-Saadi',
    email: 'mohammed@example.com',
    phone: '+358 40 123 4567',
    address: 'Helsinki, Finland',
  };

  // Password form model (static demo)
  passwords = {
    current: '',
    new: '',
    confirm: '',
  };

  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  updatePassword() {
    this.message = '';
    this.messageType = '';

    const { current, new: newPass, confirm } = this.passwords;

    if (!current || !newPass || !confirm) {
      this.setMessage('Please fill in all password fields.', 'error');
      return;
    }

    if (newPass.length < 8) {
      this.setMessage('New password must be at least 8 characters.', 'error');
      return;
    }

    if (newPass !== confirm) {
      this.setMessage('New password and confirm password do not match.', 'error');
      return;
    }

    // Fake success (no API)
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.setMessage('✅ Password updated (static demo).', 'success');
      this.passwords = { current: '', new: '', confirm: '' };
    }, 600);
  }

  private setMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
  }
}
