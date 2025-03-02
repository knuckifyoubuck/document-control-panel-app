import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { tap } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService).isLoading;

  return next(req).pipe(
    tap({
      subscribe: () => loader.set(true),
      finalize: () => loader.set(false),
    })
  );
};
