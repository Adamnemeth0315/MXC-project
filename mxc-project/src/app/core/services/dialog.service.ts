import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  matDialog = inject(MatDialog);
  private _dialogOpened = false;

  public openDialog(dialog: any, width='600px', data?: any) {
    if (!this._dialogOpened) {
      this._dialogOpened = true;

      const dialogRef = this.matDialog.open(dialog, {
        width,
        data: data
      });

      dialogRef.afterClosed().subscribe(() => {
        this._dialogOpened = false;
      });
    }
  }

}
