import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private http = inject(HttpClient);

  async addNewBoard(project_id: number, name: string, position: number) {
    const body = { project_id, name, position };
    const res = await lastValueFrom(
      this.http.post('http://127.0.0.1:8080/add-board', body, {
        withCredentials: true,
      })
    );
    return res;
  }
  async getBoards(project_id: number, user_id: number) {
    const body = { project_id, user_id };
    const res = await lastValueFrom(
      this.http.post('http://127.0.0.1:8080/get-boards', body, {
        withCredentials: true,
      })
    );
    return res;
  }
}
