// src/app/services/auth.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { clearUser, setUser } from '../store/actions';
import { selectUser } from '../store/selectors';
import { GetRoles } from './get-roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store);
  private BASE_URL = 'https://trello-clone-zg0j.onrender.com';
  private getRoles = inject(GetRoles);

  user = this.store.selectSignal(selectUser);
  roles = signal<any[]>([]);

  async checkAuth(): Promise<any | null> {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.BASE_URL}/protected`, { withCredentials: true })
      );

      console.log('[Auth] /protected response:', res);

      if (res?.authenticated && res.user) {
        this.store.dispatch(setUser({ user: res.user }));
        if (res['app-roles']) this.roles.set(res['app-roles']);
        return res.user;
      }

      console.warn('[Auth] Not authenticated:', res);
      this.store.dispatch(clearUser());
      return null;
    } catch (err: any) {
      console.error('[Auth] /protected FAILED:', err);

      // Angular HttpErrorResponse details (super useful)
      console.error('[Auth] status:', err?.status);
      console.error('[Auth] statusText:', err?.statusText);
      console.error('[Auth] message:', err?.message);
      console.error('[Auth] url:', err?.url);
      console.error('[Auth] error body:', err?.error);

      this.store.dispatch(clearUser());
      return null;
    }
  }
}
