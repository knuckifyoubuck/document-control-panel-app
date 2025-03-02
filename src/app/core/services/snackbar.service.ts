import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  default(message: string) {
    this.snackBar.open(message);
  }

  success(message: string) {
    this.snackBar.open(message, '', {
      panelClass: 'snackbar-success',
    });
  }

  error(message: string) {
    this.snackBar.open(message, '', {
      panelClass: 'snackbar-error',
    });
  }
}
