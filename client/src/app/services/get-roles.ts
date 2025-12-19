import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GetRoles {
  private http = inject(HttpClient);
  private BASE_URL = environment.API_BASE_URL;

  async getRoles() {
    return await lastValueFrom(
      this.http.get(`${this.BASE_URL}/get-roles`, {
        withCredentials: true,
      })
    );
  }
}
