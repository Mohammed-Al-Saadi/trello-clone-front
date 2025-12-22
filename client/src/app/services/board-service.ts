import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../components/reusable-toast/toast-service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private http = inject(HttpClient);
  toast = inject(ToastService);
  private BASE_URL = environment.API_BASE_URL;
  route = inject(ActivatedRoute);
  projectId = this.route.snapshot.params['project_id'];

  async addNewBoard(project_id: number, name: string, position: number, category: string) {
    const body = { project_id, name, position, category };
    try {
      const res: any = await lastValueFrom(
        this.http.post(`${this.BASE_URL}/add-board`, body, {
          withCredentials: true,
        })
      );

      if (res?.message) {
        this.toast.showMessage({
          id: 1,
          type: 'success',
          text: res.message,
        });
      }
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
  async deleteBoard(project_id: number, board_id: number) {
    const body = { project_id, board_id };
    try {
      const res: any = await lastValueFrom(
        this.http.post(`${this.BASE_URL}/delete-board`, body, {
          withCredentials: true,
        })
      );

      if (res?.message) {
        this.toast.showMessage({
          id: 1,
          type: 'success',
          text: res.message,
        });
      }
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

  async getBoards(project_id: number, user_id: number) {
    const body = { project_id, user_id };
    const res = await lastValueFrom(
      this.http.post(`${this.BASE_URL}/get-boards`, body, {
        withCredentials: true,
      })
    );
    return res;
  }

  async editBoard(board_id: number, name: string, category: string, project_id: number) {
    const body = { board_id, name, category, project_id };

    try {
      const res: any = await lastValueFrom(
        this.http.put(`${this.BASE_URL}/edit-board`, body, {
          withCredentials: true,
        })
      );

      if (res?.message) {
        this.toast.showMessage({
          id: 1,
          type: 'success',
          text: res.message,
        });
      }

      return res;
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
