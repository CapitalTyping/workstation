import { MatSnackBarRef } from '@angular/material';

export interface ISnackbar {
  type: 'error' | 'success' | 'info' | 'warning',
  message: string,
  title?: string
  _snackRef?: MatSnackBarRef<any>
}
