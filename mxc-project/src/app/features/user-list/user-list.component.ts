import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PageOptions, UserService } from '../../core/services/user.service';
import { UserManagmentDialogComponent } from '../../dialogs/user-managment-dialog/user-managment-dialog.component';
import { DeleteUserDialogComponent } from '../../dialogs/delete-user-dialog/delete-user-dialog.component';
import { IUser, IUserListResponse } from '../../core/models/user';
import { DialogService } from '../../core/services/dialog.service';
import { LoadingService } from '../../core/services/loading.service';
import { Subject } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faUser, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  itemsPerPageLabel = 'Elem per oldal';
  nextPageLabel = 'Következő';
  previousPageLabel = 'Előző';
  firstPageLabel = 'Első';
  lastPageLabel = 'Utolsó';

  // Here I set the paginate text and layout
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 / ${length}`;
    }

    length = Math.ceil(length / pageSize);

    return `${page + 1} / ${length}`;
  };
}

@UntilDestroy()
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    TranslateModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private _userService = inject(UserService);
  private _dialogService = inject(DialogService);
  private _loadingService = inject(LoadingService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = [
    'userName',
    'createdAt',
    'edit',
    'delete',
  ];
  public dataSource: IUser[] = [];
  public isLoading$ = this._loadingService.isLoading$;

  // Paginator's variables
  public usersLength = 0;
  public pageIndex = 0;
  public pageSize = 5;
  public pageSizeOptions = [5, 10];

  // Font awesome icons
  public faPlus = faPlus;
  public faUser = faUser;
  public faAngleDown = faAngleDown;
  public faAngleUp = faAngleUp;

  ngOnInit(): void {
    this.fetchUsers();
  }

  public onPaginateChange(event: PageEvent): void {
    this._userService.queryParams.limit = event.pageSize;
    this._userService.queryParams.pageIndex = event.pageIndex;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchUsers();
  }

  fetchUsers(): void {
    const pageOptions: PageOptions = {
      pageIndex: this._userService.queryParams.pageIndex,
      limit: this._userService.queryParams.limit,
      orderby: this._userService.queryParams.orderby,
      order: this._userService.queryParams.order,
    };
    this._userService.getUserList(pageOptions).pipe(untilDestroyed(this)).subscribe((users: IUserListResponse) => {
      this.dataSource = users.results;
      this.usersLength = users.resultsLength;
    });
  }

  openAddUserDialog(): void {
    this._dialogService.openDialog(UserManagmentDialogComponent);
  }

  public openEditUserDialog(id: string): void {
      this._userService.getUserById(id).pipe(untilDestroyed(this)).subscribe((user) => {
          this._dialogService.openDialog(UserManagmentDialogComponent, user);
        })
  }

  public deleteUser(user: IUser): void {
    this._dialogService.openDialog(DeleteUserDialogComponent, user)
  }

  public sortUsers(orderby: string, order: string): void {
    // Here I set up the queryParams, but first I check whether there are any changes to the stored queryParam values or not
    if (orderby !== this._userService.queryParams.orderby || order !== this._userService.queryParams.order) {
      this._userService.queryParams.order = order;
      this._userService.queryParams.orderby = orderby;
      this.fetchUsers();
    }
  }

}
