import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';


import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../../shared/add-user/add-user.component';


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
  snackBar = inject(MatSnackBar);
  matDialog = inject(MatDialog);


  users$: any = [];
  public pageIndex = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'userName',
    'createdAt',
    'Action',
  ];
  dataSource = [];

  ngOnInit(): void {
    this.userService.getUserList().subscribe({
      next: (users: any) => {
        this.dataSource = users.results
      }
    })

    console.log(this.authService.currentUserValue);
  };

  public onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
  };

  openAddUserDialog(): void {
    this.matDialog.open(AddUserDialogComponent, { width: '600px' })
  };

  public editUserById(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (user) => this.matDialog.open(AddUserDialogComponent, { data: user, width: '600px' })
    })
  };

  public deleteUser(id: string) {
   this.userService.removeUserById(id).subscribe({
    next: () => console.log('Deleted done!')
   })
  };

}
