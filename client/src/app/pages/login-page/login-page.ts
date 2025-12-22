import { Component, inject, signal, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { SrpAuthService } from './srp-auth';
import { FormItems, ReactiveForm } from '../../components/reactive-form/reactive-form';
import { ToastService } from '../../components/reusable-toast/toast-service';
import { RainLoader } from '../../components/rain-loader/rain-loader';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveForm, RainLoader],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPage {
  private router = inject(Router);
  private srpAuthService = inject(SrpAuthService);
  private toast = inject(ToastService);
  @ViewChild(ReactiveForm) FormItems!: ReactiveForm;

  loading = signal(false);
  message = signal('');

  formData = signal<FormItems[]>([
    {
      label: 'Email',
      type: 'email',
      formControlName: 'email',
      placeholder: 'Your email...',
      validators: [Validators.required, Validators.email],
    },
    {
      label: 'Password',
      type: 'password',
      formControlName: 'password',
      placeholder: 'Password',
      validators: [Validators.required, Validators.minLength(6)],
    },
  ]);

  async onSubmitted(value: any) {
    this.message.set('');
    this.loading.set(true);

    try {
      const responseData = await this.srpAuthService.login(value.email, value.password);

      if (responseData === true) {
        this.toast.showMessage({
          id: 1,
          type: 'success',
          text: 'Login successful — redirecting to dashboard…',
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }
    } catch (err: any) {
      const message = err?.error?.error || err?.error?.message || err?.message;

      this.toast.showMessage({ id: 1, type: 'error', text: message });
    } finally {
      this.loading.set(false);
      this.FormItems.form.reset();
    }
  }
}
