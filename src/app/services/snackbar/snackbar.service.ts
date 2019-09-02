import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, } from '@angular/material';

import { SnackBarComponent } from '@components/snack-bar-component/snack-bar.component';
import { ISnackbar } from '@tran/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private _defaultErrorMessage = 'Something went wrong.';
  private _defaultWarningMessage = 'Please, fill all required fields.';

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(data?: ISnackbar, duration?: number) {
    data = data || this.resetSnackData('info');

    const config = new MatSnackBarConfig();
    config.panelClass = ['i-snackbar', 'i-snackbar-' + data.type];
    config.duration = duration || 10000;
    config.data = data;
    // Note: Position loses on chunk error (Fixed via CSS)
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';

    config.data._snackRef = this.snackBar.openFromComponent(SnackBarComponent, config);
  }

  openSuccessSnackBar(message: string, duration = 3500) {
    this.openSnackBar({
      type: 'success',
      message: message,
    }, duration);
  }

  openWarningSnackBar(message?: string, duration = 3500) {
    this.openSnackBar({
      type: 'warning',
      message: message || this._defaultWarningMessage,
    }, duration);
  }

  openErrorSnackBar(err, duration = 6000) {
    if (typeof err === 'string') {
      this.openSnackBar({
        type: 'error',
        message: err || this._defaultErrorMessage,
      }, duration);
      return;
    }
    if (window.navigator.onLine && err.error && err.error.code !== 401) {
      this.openSnackBar({
        type: 'error',
        message: err.error.message && err.error.code !== 404 ? err.error.message : this._defaultErrorMessage,
      }, duration);
    }
  }

  showExpiredSessionSnackBar() {
    this.openSnackBar({
      type: 'error',
      message: 'Session is over. Please, re-login.'
    }, 5000);
  }

  resetSnackData(type: ISnackbar['type']): ISnackbar {
    return {
      title: '',
      message: '',
      type: type,
      _snackRef: null
    };
  }
}
