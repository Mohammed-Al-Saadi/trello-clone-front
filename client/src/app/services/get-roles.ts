import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetRoles {
  private http = inject(HttpClient);

  async getRoles() {
    const res: any = await lastValueFrom(
      this.http.get('https://api.tavolopro.live/get-roles', {
        withCredentials: true,
      })
    );

    return res;
  }
}
