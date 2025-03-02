import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { catchError, throwError } from 'rxjs';

export const errorSnackbarInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(SnackBarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      snackBar.error(error.error.message);
      return throwError(() => error);
    })
  );
};
