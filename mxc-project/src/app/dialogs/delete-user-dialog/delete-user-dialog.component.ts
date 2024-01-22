import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { IUser } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatIconModule, TranslateModule],
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss'
})
export class DeleteUserDialogComponent {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  constructor( @Inject(MAT_DIALOG_DATA) public user: IUser, private _matDialogRef: MatDialogRef<any>) {}

  public closeDialog(): void {
    this._matDialogRef.close();
  }

  public deleteUser(id: string): void {
    this.userService.removeUserById(id).subscribe({
      next: () => {
        this.userService.getUserList();
        this.snackBar.open('A munkatárs sikeresen törölve lett!', 'OK', { duration: 10000 })
      }
    })
    this._matDialogRef.close();
  }

}
