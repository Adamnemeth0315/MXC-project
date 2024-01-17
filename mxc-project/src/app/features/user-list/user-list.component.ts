import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';


import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);
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
  }

  public onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;

  }

  public deleteUser(userName: string) {
    console.log(userName);
  }

}
