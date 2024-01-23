import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserDialogComponent implements OnInit {

  private _userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);
  private _matDialogRef = inject(MatDialogRef);

  public firstNameCtrl = new FormControl('', Validators.required);
  public lastNameCtrl = new FormControl('', Validators.required);
  public userNameCtrl = new FormControl('', Validators.required);
  public passwordCtrl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z]).+$')]);
  public emailCtrl = new FormControl('', Validators.required);
  public phoneNumberCtrl = new FormControl('');


  public userForm = new FormGroup({
    firstName: this.firstNameCtrl,
    lastName: this.lastNameCtrl,
    userName: this.userNameCtrl,
    password: this.passwordCtrl,
    email: this.emailCtrl,
    phoneNumber: this.phoneNumberCtrl,
  })

  constructor( @Inject(MAT_DIALOG_DATA) public user: IUser) {}


  ngOnInit(): void {
    if (this.user) {
      this.firstNameCtrl.setValue(this.user.firstName);
      this.lastNameCtrl.setValue(this.user.lastName);
      this.userNameCtrl.setValue(this.user.userName);
      this.emailCtrl.setValue(this.user.email);
      this.phoneNumberCtrl.setValue(this.user.phoneNumber);
    }
  }

  public closeDialog(): void {
    this._matDialogRef.close();
  }

  public submitForm(): void {
    const data = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      userName: this.userForm.get('userName')?.value,
      password: this.userForm.get('password')?.value,
      email: this.userForm.get('email')?.value,
      phoneNumber: this.userForm.get('phoneNumber')?.value,
      roles: ["2e435039-91b0-4752-8f2e-517f2f186def"]
    }

    this.user
    ?
    this._userService.editUserById({id: this.user.id, ...data} as unknown as IUser).subscribe({
      next: () => {
        this._userService.getUserList();
        this._snackBar.open('A munkatárs sikeresen módosítva lett!', 'OK', { duration: 5000 })
      },
      error: () => {
        this._snackBar.open('A munkatárs házzadása nem sikerült!', 'OK', { duration: 5000 })
      }
    })
    : this._userService.addUser(data as unknown as IUser).subscribe({
      next: () =>  {
        this._userService.getUserList();
        this._snackBar.open('Az új munkatárs sikeresen hozzá lett adva listához!', 'OK', { duration: 5000 })
      },
      error: () => {
        this._snackBar.open('A munkatárs módosítása nem sikerült!', 'OK', { duration: 5000 })
      }
    });
    this.userForm.reset();
    this._matDialogRef.close();
}

}
