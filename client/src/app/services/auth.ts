// src/app/services/auth.service.ts
import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { clearUser, setUser } from '../store/actions';
import { selectUser } from '../store/selectors';
import { GetRoles } from './get-roles';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store);
  private BASE_URL = environment.API_BASE_URL;
  private getRoles = inject(GetRoles);
  user = this.store.selectSignal(selectUser);
  roles = signal<any[]>([]);
  async checkAuth(): Promise<any | null> {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.BASE_URL}/protected`, { withCredentials: true })
      );
      console.log(res);

      if (res?.authenticated && res.user) {
        this.store.dispatch(setUser({ user: res.user }));
        if (res['app-roles']) {
          this.roles.set(res['app-roles']);
        }
        return res.user;
      } else {
        this.store.dispatch(clearUser());
        return null;
      }
    } catch {
      this.store.dispatch(clearUser());
      return null;
    }
  }
}
