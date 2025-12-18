import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const Protected: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  console.log('[Guard] Protected guard running...');

  try {
    const user = await auth.checkAuth();
    console.log('[Guard] checkAuth user:', user);

    if (user) return true;

    console.warn('[Guard] No user -> redirecting to /login');
    router.navigate(['/login']);
    return false;
  } catch (err) {
    console.error('[Guard] checkAuth threw error:', err);
    router.navigate(['/login']);
    return false;
  }
};
