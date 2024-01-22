import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AddUserDialogComponent } from '../../dialogs/add-user/add-user.component';
import { DeleteUserDialogComponent } from '../../dialogs/delete-user-dialog/delete-user-dialog.component';
import { IUser } from '../../core/models/user';
import { DialogService } from '../../core/services/dialog.service';
import { Observable } from 'rxjs';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public usersLength = 0;
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
        this.usersLength = users.resultsLength
      }
    });

    this.route.queryParams.subscribe({
      next: () => this.userService.getUserList()
    });

    if (this.paginator) {
      // Sign up for paginator changes here
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPaginateChange(event);
      });
    }
  };

  public onPaginateChange(event: PageEvent): void {
    // Here we check if there are enough elements for the new pageSize, if so we leave the pageIndex, if not we set it to 0.
    if (this.usersLength > event.pageSize) {
      this.userService.queryParams.pageIndex = event.pageIndex;
    } else {
      this.userService.queryParams.pageIndex = 0;
      this.pageIndex = 0;
    }

    // Here I set the pageIndex on the page of the userService queryparam object
    this.pageIndex = this.userService.queryParams.pageIndex;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pageIndex: this.pageIndex,
        limit: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    this.userService.queryParams.limit = event.pageSize;
  };

  openAddUserDialog(): void {
    this.dialogService.openDialog(AddUserDialogComponent);
  };

  public openEditUserDialog(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.dialogService.openDialog(AddUserDialogComponent, user);
      }
    })
  };

  public deleteUser(user: IUser): void {
    this.dialogService.openDialog(DeleteUserDialogComponent, user);
  };

  public sortUsers(orderby: string, order: string): void {

    // Here I set up the queryParams, but first I check whether there are any changes to the stored queryParam values or not
    if (orderby !== this.userService.queryParams.orderby || order !== this.userService.queryParams.order) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          orderby: orderby,
          order: order,
        },
        queryParamsHandling: 'merge',
      });

      this.userService.queryParams.order = order;
      this.userService.queryParams.orderby = orderby;
    }
  }

}
