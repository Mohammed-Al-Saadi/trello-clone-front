import { Component, inject } from '@angular/core';
import { ToastService } from './toast-service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-reusable-toast',
  imports: [NgFor, CommonModule],
  templateUrl: './reusable-toast.html',
  styleUrl: './reusable-toast.css',
})
export class ReusableToast {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  remove(id: number) {
    this.toastService.removeToast(id);
  }
}
