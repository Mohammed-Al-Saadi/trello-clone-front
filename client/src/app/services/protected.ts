import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const Protected: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const user = await auth.checkAuth();

  if (user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
