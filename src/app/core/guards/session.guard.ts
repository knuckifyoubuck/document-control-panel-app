import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

export const sessionGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isSignedIn = inject(LocalStorageService).getAuthToken();

  if (!isSignedIn) {
    router.navigate(['login']).then();
  }

  return !!isSignedIn;
};
