import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import * as srp from 'secure-remote-password/client';
import { SrpRegisterService } from './srp-register-service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormItems, ReactiveForm } from '../../components/reactive-form/reactive-form';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../components/reusable-toast/toast-service';
@Component({
  selector: 'app-register',
  imports: [ReactiveForm, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  private auth = inject(SrpRegisterService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  message = signal('');

  formData = signal<FormItems[]>([
    {
      label: 'Name',
      type: 'text',
      formControlName: 'full_name',
      placeholder: 'Your email...',
      validators: [Validators.required],
    },
    {
      label: 'Email',
      type: 'email',
      formControlName: 'emailRaw',
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
    {
      label: 'Confirm Password',
      type: 'password',
      formControlName: 'confirmPassword',
      placeholder: 'Password',
      validators: [Validators.required, Validators.minLength(6)],
    },
  ]);

  async onSubmitted(value: any) {
    try {
      const data = await this.auth.register(value.full_name, value.emailRaw, value.password);
      this.toast.showMessage({ id: 1, type: 'success', text: data.message });
    } catch (err: any) {
      this.toast.showMessage({ id: 2, type: 'error', text: err.error });
    }
  }
}
