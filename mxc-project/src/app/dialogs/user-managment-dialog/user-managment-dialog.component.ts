import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-managment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    FontAwesomeModule,
    TranslateModule
  ],
  templateUrl: './user-managment-dialog.component.html',
  styleUrl: './user-managment-dialog.component.scss'
})
export class UserManagmentDialogComponent implements OnInit {

  private _userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);
  private _matDialogRef = inject(MatDialogRef);
  private _translateService = inject(TranslateService);

  private _pageOptions = this._userService.queryParams;

  public firstNameCtrl = new FormControl('', Validators.required);
  public lastNameCtrl = new FormControl('', Validators.required);
  public userNameCtrl = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$")]);
  public passwordCtrl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z]).+$')]);
  public emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  public phoneNumberCtrl = new FormControl('');

  public faUserEdit = faUserEdit;

  public userForm = new FormGroup({
    firstName: this.firstNameCtrl,
    lastName: this.lastNameCtrl,
    userName: this.userNameCtrl,
    password: this.passwordCtrl,
    email: this.emailCtrl,
    phoneNumber: this.phoneNumberCtrl,
  })

  constructor(@Inject(MAT_DIALOG_DATA) public user: IUser) { }

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
      roles: ["bfaa9e3b-01d5-428d-997a-5c2822781ca1"]
    }

    this.user
      ?
      this._userService.editUserById({ id: this.user.id, ...data } as unknown as IUser)
        .subscribe({
          next: () => {
            this._userService.getUserList(this._pageOptions);
            this._snackBar.open(this._translateService.instant('snack-bar.edit-user-message'), 'OK', { duration: 5000 })
          },
          error: () => {
            this._snackBar.open(this._translateService.instant('snack-bar.edit-user-error-message'), 'OK', { duration: 5000 })
          }
        })
      : this._userService.addUser(data as unknown as IUser).subscribe({
        next: () => {
          this._userService.getUserList(this._pageOptions);
          this._snackBar.open(this._translateService.instant('snack-bar.add-user-message'), 'OK', { duration: 5000 })
        },
        error: () => {
          this._snackBar.open(this._translateService.instant('snack-bar.add-user-error-message'), 'OK', { duration: 5000 })
        }
      });
    this.userForm.reset();
    this._matDialogRef.close();
  }

}
