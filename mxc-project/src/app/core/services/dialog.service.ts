import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private _matDialog = inject(MatDialog);
  private _dialogOpened = false;

  public openDialog(dialog: any, data?: IUser) {
    if (!this._dialogOpened) {
      this._dialogOpened = true;

      const dialogRef = this._matDialog.open(dialog, {
        width: '600px',
        disableClose: true,
        data: data
      });

      dialogRef.afterClosed().subscribe(() => {
        this._dialogOpened = false;
      });
    }
  }

}
