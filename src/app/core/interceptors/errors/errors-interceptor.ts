import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {

  const toastrService = inject(ToastrService);
  //logic Req

  return next(req).pipe(catchError( (err) => {
    //logic Err

    console.error('intercepted:', err.message);
    toastrService.error(err.message, 'Error');

    

    return throwError (() => err);
  }))
};
