import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@document-control-app/core/services/local-storage.service';
import { catchError, throwError } from 'rxjs';

export const jwtAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  if (localStorageService.getAuthToken()) {
    req = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${localStorageService.getAuthToken()}`),
    });
  }

  return next(req).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          localStorageService.deleteAuthToken();
          localStorageService.deleteUserData();
          router.navigate(['login']);
        }
      }

      return throwError(() => err);
    })
  );
};
