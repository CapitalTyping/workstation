import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { SnackbarService } from '@services/snackbar/snackbar.service';
// import { AuthService } from '@services/auth/auth.service';
import { ISnackbar } from '@tran/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackbarSvc: SnackbarService,
    // private authSvc: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error('interceptor ERROR', error);

        const snackData = this.snackbarSvc.resetSnackData('error');
        snackData.message = 'Something went wrong';

        if (!window.navigator.onLine) {
          // Network error occurred.
          snackData.message = `Can't fetch data. Please, check your internet connection.`;

        } else if (error.error) {
          snackData.message = error.error.error ? error.error.error.message : error.error.message;

          // // expired or invalid token
          // if (error.error.code === 401) {
          //   snackData.message = /(Token)/.test(error.error.message)
          //       ? 'Session is over. Please, re-login.'
          //       : error.error.message;
          //   this.authSvc.logout();
          // }

          // not found route or bed request
          if (error.status !== 401 && error.error.code === 404 || error.error.code === 500) {
            snackData.message = 'Something went wrong';
          }
        }

        !snackData.message && (snackData.message = 'Something went wrong');

        this.snackbarSvc.openSnackBar(snackData, 6000);
        return throwError(error);
      })
      );
  }

  /**
   * Custom ErrorHandler to increase UX
   * will fire only in case of Chunk error(core error on No Internet)
   *
   * @param error
   */
  handleError(error) {
    !error.error && console.error('custom core ERROR', error);

    // if (error+'').includes('Error: Loading chunk')
    if (!window.navigator.onLine && !error.error) {
      const snackData: ISnackbar = {
        type: 'error',
        message: `Can't fetch data. Please, check your internet connection.`
      };
      this.snackbarSvc.openSnackBar(snackData, 6000);
    }

    return throwError(error);
  }
}
