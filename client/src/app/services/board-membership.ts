import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../components/reusable-toast/toast-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardMembership {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private BASE_URL = environment.API_BASE_URL;

  async addBoardMembership(
    board_id: number,
    role_id: number,
    email: string,
    added_by: number,
    role_name: string
  ) {
    const body = { board_id, role_id, email, added_by, role_name };

    try {
      const response: any = await lastValueFrom(
        this.http.post(`${this.BASE_URL}/add-board-membership`, body, {
          withCredentials: true,
          headers: {
            'X-Role-Name': role_name || '',
          },
        })
      );

      if (response?.message) {
        this.toast.showMessage({
          id: 1,
          type: 'success',
          text: response.message || 'New board member added successfully',
        });
      }

      return response;
    } catch (error: any) {
      const backendMessage =
        error?.error?.error || error?.error?.details || error?.message || 'Something went wrong';

      this.toast.showMessage({
        id: 1,
        type: 'error',
        text: backendMessage,
      });

      throw error;
    }
  }

  async deleteBoardMembership(board_id: number, user_id: number, role_name: string) {
    const body = { board_id, user_id, role_name };

    try {
      const response: any = await lastValueFrom(
        this.http.post(`${this.BASE_URL}/delete-board-membership`, body, {
          withCredentials: true,
          headers: {
            'X-Role-Name': role_name || '',
          },
        })
      );

      if (response?.message) {
        this.toast.showMessage({
          id: 1,
          type: 'success',
          text: response.message,
        });
      }

      return response;
    } catch (error: any) {
      const backendMessage =
        error?.error?.error || error?.error?.details || error?.message || 'Something went wrong';

      this.toast.showMessage({
        id: 1,
        type: 'error',
        text: backendMessage,
      });

      throw error;
    }
  }
  async updateBoardMembership(
    board_id: number,
    user_id: number,
    role_id: number,
    role_name: string
  ) {
    const body = { board_id, role_id, user_id, role_name };

    try {
      const response: any = await lastValueFrom(
        this.http.put(`${this.BASE_URL}/update-board-membership`, body, {
          withCredentials: true,
          headers: {
            'X-Role-Name': role_name || '',
          },
        })
      );

      if (response?.message) {
        this.toast.showMessage({
          id: 1,
          type: 'success',
          text: response.message,
        });
      }

      return response;
    } catch (error: any) {
      const backendMessage =
        error?.error?.error || error?.error?.details || error?.message || 'Something went wrong';

      this.toast.showMessage({
        id: 1,
        type: 'error',
        text: backendMessage,
      });

      throw error;
    }
  }
}
