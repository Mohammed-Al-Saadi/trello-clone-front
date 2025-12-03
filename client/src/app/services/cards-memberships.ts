import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../components/reusable-toast/toast-service';

@Injectable({
  providedIn: 'root',
})
export class CardMembershipService {
  private http = inject(HttpClient);
  toast = inject(ToastService);

  async addCardMembers(card_id: number, user_ids: number[]) {
    const body = { card_id, user_ids };

    try {
      const res: any = await lastValueFrom(
        this.http.post('http://127.0.0.1:8080/cards-assign-member', body, {
          withCredentials: true,
        })
      );

      if (res?.message) {
        this.toast.showMessage({
          id: Date.now(),
          type: 'success',
          text: res.message,
        });
      }

      return res;
    } catch (error: any) {
      const backendMessage =
        error?.error?.error || error?.error?.details || error?.message || 'Something went wrong';

      this.toast.showMessage({
        id: Date.now(),
        type: 'error',
        text: backendMessage,
      });

      throw error;
    }
  }
  async deleteCardMember(card_id: number, user_id: number) {
    const body = { card_id, user_id };

    try {
      const res: any = await lastValueFrom(
        this.http.delete('http://127.0.0.1:8080/cards-remove-member', {
          body,
          withCredentials: true,
        })
      );

      if (res?.message) {
        this.toast.showMessage({
          id: Date.now(),
          type: 'success',
          text: res.message,
        });
      }

      return res;
    } catch (error: any) {
      const backendMessage =
        error?.error?.error || error?.error?.details || error?.message || 'Something went wrong';

      this.toast.showMessage({
        id: Date.now(),
        type: 'error',
        text: backendMessage,
      });

      throw error;
    }
  }
}
