import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationItem } from './app-notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private BASE_URL = environment.API_BASE_URL;

  async getNotificationsByProjects(
    projectIds: number[],
    types: string[] = ['register', 'project', 'projectMembership']
  ): Promise<NotificationItem[] | null> {
    try {
      const res = await firstValueFrom(
        this.http.post<NotificationItem[]>(
          `${this.BASE_URL}/get-notifications-by-type`,
          { project_ids: projectIds, type: types },
          { withCredentials: true }
        )
      );

      return res ?? [];
    } catch (err) {
      console.error('getNotificationsByProjects failed:', err);
      return null;
    }
  }
}
