import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { IUser } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { TranslateModule } from '@ngx-translate/core';

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

  constructor( @Inject(MAT_DIALOG_DATA) public user: IUser) {}

  public closeDialog(): void {
    this._matDialogRef.close();
  }

  public deleteUser(id: string): void {
    this._userService.removeUserById(id).subscribe({
      next: () => {
        this._userService.getUserList();
        this._snackBar.open('A munkatárs sikeresen törölve lett!', 'OK', { duration: 5000 });
      },
      error: () => {
        this._snackBar.open('A munkatárs törlése nem sikerült!', 'OK', { duration: 5000 })
      }
    })
    this._matDialogRef.close();
  }

}
