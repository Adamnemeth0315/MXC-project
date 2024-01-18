import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IUser } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss'
})
export class DeleteUserDialogComponent {
  usersService = inject(UserService);
  snackBar = inject(MatSnackBar);

  constructor( @Inject(MAT_DIALOG_DATA) public user: IUser, private _matDialogRef: MatDialogRef<any>) {}

  public closeDialog() {
    this._matDialogRef.close();
  }

  public deleteTodo(id: string) {
    this.usersService.removeUserById(id).subscribe({
      next: () => console.log('deleted done! ')
    })
    this._matDialogRef.close();
  }

}