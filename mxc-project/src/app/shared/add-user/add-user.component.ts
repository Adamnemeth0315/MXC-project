import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IUser } from '../../core/models/user';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserDialogComponent implements OnInit {

  public firstNameCtrl = new FormControl('', Validators.required);
  public lastNameCtrl = new FormControl('', Validators.required);
  public userNameCtrl = new FormControl('');


  public userForm = new FormGroup({
    firstName: this.firstNameCtrl,
    lastName: this.lastNameCtrl,
    userName: this.userNameCtrl,
  })

  constructor( @Inject(MAT_DIALOG_DATA) public user: IUser, private _matDialogRef: MatDialogRef<any>) {}


  ngOnInit(): void {
    if (this.user) {
      this.firstNameCtrl.setValue(this.user.firstName);
      this.lastNameCtrl.setValue(this.user.lastName);
      this.userNameCtrl.setValue(this.user.userName);
    }
  }

}
