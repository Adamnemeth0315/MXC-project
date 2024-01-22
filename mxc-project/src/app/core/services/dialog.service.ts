import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  matDialog = inject(MatDialog);
  userService = inject(UserService)
  private _dialogOpened = false;

  public openDialog(dialog: any, data?: any) {
    if (!this._dialogOpened) {
      this._dialogOpened = true;

      const dialogRef = this.matDialog.open(dialog, {
        width: '600px',
        data: data
      });

      dialogRef.afterClosed().subscribe(() => {
        this._dialogOpened = false;
      });
    }
  }

}
