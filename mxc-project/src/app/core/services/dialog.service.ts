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

  public openDialog(dialog: any, width='600px', data?: any) {
    if (!this._dialogOpened) {
      this._dialogOpened = true;

      const dialogRef = this.matDialog.open(dialog, {
        width,
        data: data
      });

      dialogRef.afterClosed().pipe(
        mergeMap(() => this.userService.getUserList())
      ).subscribe(() => {
        this._dialogOpened = false;
      });
    }
  }

}
