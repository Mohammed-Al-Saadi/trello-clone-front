import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsVar = signal<ToastMessage[]>([]);
  toasts = this.toastsVar.asReadonly();

  showMessage(toastData: ToastMessage) {
    const id = Math.random();
    const newToast = { ...toastData, id };
    this.toastsVar.update((tost) => [...tost, newToast]);
    setTimeout(() => this.removeToast(id), 3000);
  }

  removeToast(id: number) {
    this.toastsVar.update((toast) => toast.filter((t) => t.id !== id));
  }
}
