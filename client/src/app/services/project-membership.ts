import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectMembership {
  private http = inject(HttpClient);

  async addProjectMembership(
    project_id: number,
    board_id: number,
    role_id: number,
    email: string,
    added_by: number
  ) {
    const body = { project_id, board_id, role_id, email, added_by };
    const data = await lastValueFrom(
      this.http.post('http://127.0.0.1:8080/add-membership', body, { withCredentials: true })
    );
    return data;
  }
}
