import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { AddUserDialogComponent } from '../../dialogs/add-user/add-user.component';
import { DeleteUserDialogComponent } from '../../dialogs/delete-user-dialog/delete-user-dialog.component';
import { IUser } from '../../core/models/user';
import { DialogService } from '../../core/services/dialog.service';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  snackBar = inject(MatSnackBar);
  matDialog = inject(MatDialog);


  users$: any = [];
  public usersLength = 0;
  usersList$!: Observable<IUser[]>;
  public pageIndex = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'userName',
    'createdAt',
    'edit',
    'delete',
  ];
  dataSource = [];

  ngOnInit(): void {
    this.userService.getUserList().subscribe({
      next: (users: any) => {
        this.dataSource = users.results
      }
    })
  };

  public onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
  };

  openAddUserDialog(): void {
    this.dialogService.openDialog(AddUserDialogComponent);
  };

  public editUserById(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.dialogService.openDialog(AddUserDialogComponent, '600px', user);
      }
    })
  };

  public deleteUser(user: IUser) {
    this.dialogService.openDialog(DeleteUserDialogComponent, '900px', user);
  };

}
