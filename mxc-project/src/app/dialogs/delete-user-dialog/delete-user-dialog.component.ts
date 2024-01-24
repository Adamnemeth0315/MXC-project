import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { IUser } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatIconModule, TranslateModule],
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss'
})
export class DeleteUserDialogComponent {
  private _userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);
  private _matDialogRef = inject(MatDialogRef);
  private _translateService = inject(TranslateService);

  private _pageOptions = this._userService.queryParams;

  constructor( @Inject(MAT_DIALOG_DATA) public user: IUser) {}

  public closeDialog(): void {
    this._matDialogRef.close();
  }

  public deleteUser(id: string): void {
    this._userService.removeUserById(id).subscribe({
      next: () => {
        this._userService.getUserList(this._pageOptions);
        this._snackBar.open(this._translateService.instant('snack-bar.delete-user-message'), 'OK', { duration: 5000 });
      },
      error: () => {
        this._snackBar.open(this._translateService.instant('snack-bar.delete-user-error-message'), 'OK', { duration: 5000 })
      }
    })
    this._matDialogRef.close();
  }

}
