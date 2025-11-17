import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  roles = signal<any[]>([]);

  async addNewProject(name: string, description: string, owner_id: string, category: string) {
    const body = { name, description, owner_id, category };

    const data = await lastValueFrom(
      this.http.post('http://127.0.0.1:8080/add-project', body, {
        withCredentials: true,
      })
    );

    return data;
  }

  async getAllProjects(owner_id: string) {
    const body = { owner_id };
    const data = await lastValueFrom(
      this.http.post('http://127.0.0.1:8080/get-projects', body, {
        withCredentials: true,
      })
    );

    return data;
  }

  deleteProject(project_id: number, owner_id: number) {
    return lastValueFrom(
      this.http.post(
        'http://127.0.0.1:8080/delete-project',
        {
          project_id,
          owner_id,
        },
        { withCredentials: true }
      )
    );
  }

  async updateProject(
    owner_id: number,
    project_id: number,
    name: string,
    description: string,
    category: string,
    start_date: string
  ) {
    const body = { owner_id, project_id, name, description, category, start_date };

    return await lastValueFrom(
      this.http.put('http://127.0.0.1:8080/update-project', body, { withCredentials: true })
    );
  }
}
