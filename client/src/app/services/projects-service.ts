import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../components/reusable-toast/toast-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  roles = signal<any[]>([]);
  toast = inject(ToastService);
  private BASE_URL = environment.API_BASE_URL;

  async addNewProject(name: string, description: string, owner_id: string, category: string) {
    const body = { name, description, owner_id, category };

    try {
      const response: any = await lastValueFrom(
        this.http.post(`${this.BASE_URL}/add-project`, body, {
          withCredentials: true,
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

  async getAllProjects(owner_id: string) {
    const body = { owner_id };
    const data = await lastValueFrom(
      this.http.post(`${this.BASE_URL}/get-projects`, body, {
        withCredentials: true,
      })
    );

    return data;
  }

  async deleteProject(project_id: number, owner_id: number) {
    try {
      const response: any = await lastValueFrom(
        this.http.post(
          `${this.BASE_URL}/delete-project`,
          { project_id, owner_id },
          {
            withCredentials: true,
          }
        )
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

      // ERROR toast
      this.toast.showMessage({
        id: 1,
        type: 'error',
        text: backendMessage,
      });

      throw error;
    }
  }

  async updateProject(
    owner_id: number,
    project_id: number,
    name: string,
    description: string,
    category: string,
    start_date: string
  ) {
    const body = {
      owner_id,
      project_id,
      name,
      description,
      category,
      start_date,
    };

    try {
      const response: any = await lastValueFrom(
        this.http.put(`${this.BASE_URL}/update-project`, body, {
          withCredentials: true,
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
