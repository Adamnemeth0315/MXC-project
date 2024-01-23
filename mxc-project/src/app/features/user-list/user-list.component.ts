import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AddUserDialogComponent } from '../../dialogs/add-user/add-user.component';
import { DeleteUserDialogComponent } from '../../dialogs/delete-user-dialog/delete-user-dialog.component';
import { IUser, IUserListResponse } from '../../core/models/user';
import { DialogService } from '../../core/services/dialog.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';
import { Subject, Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faUser, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';


import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  itemsPerPageLabel = 'Elem per oldal';
  nextPageLabel = 'Következő';
  previousPageLabel = 'Előző';
  firstPageLabel = 'Első';
  lastPageLabel = 'Utolsó';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 / ${length}`;
    }

    length = Math.ceil(length / pageSize);

    return `${page + 1} / ${length}`;
  };
}


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
export class UserListComponent implements OnInit, OnDestroy {
  private _userService = inject(UserService);
  private _dialogService = inject(DialogService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  public loadingService = inject(LoadingService);

  public usersLength = 0;
  public pageIndex = 0;
  public pageSize = 5;
  public isLoading$ = this.loadingService.isLoading$;
  private _subscriptons: Subscription[] = [];

  //Font awesome icons
  public faPlus = faPlus;
  public faUser = faUser;
  public faAngleDown = faAngleDown;
  public faAngleUp = faAngleUp;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = [
    'userName',
    'createdAt',
    'edit',
    'delete',
  ];
  public dataSource: IUser[] = [];

  ngOnInit(): void {
    this._subscriptons.push(
      // Subscribe to getUserList
      this._userService.getUserList().subscribe((users: IUserListResponse) => {
          this.dataSource = users.results
          this.usersLength = users.resultsLength
        }),

      // Subscribe to queryParams
      this._route.queryParams.subscribe(() => this._userService.getUserList())
    );
  };

  public onPaginateChange(event: PageEvent): void {
    // Here we check if there are enough elements for the new pageSize, if so we leave the pageIndex, if not we set it to 0.
    if (this.usersLength > event.pageSize) {
      this._userService.queryParams.pageIndex = event.pageIndex;
    } else {
      this._userService.queryParams.pageIndex = 0;
      this.pageIndex = 0;
    }

    // Here I set the pageIndex on the page of the userService queryparam object
    this.pageIndex = this._userService.queryParams.pageIndex;
    this._userService.queryParams.limit = event.pageSize;
    this.pageSize = this._userService.queryParams.limit;
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        pageIndex: this.pageIndex,
        limit: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });

  };

  openAddUserDialog(): void {
    this._dialogService.openDialog(AddUserDialogComponent);
  };

  public openEditUserDialog(id: string): void {
    this._subscriptons.push(
      this._userService.getUserById(id).subscribe((user) => {
          this._dialogService.openDialog(AddUserDialogComponent, user);
        })
    )
  };

  public deleteUser(user: IUser): void {
    this._dialogService.openDialog(DeleteUserDialogComponent, user);
  };

  public sortUsers(orderby: string, order: string): void {

    // Here I set up the queryParams, but first I check whether there are any changes to the stored queryParam values or not
    if (orderby !== this._userService.queryParams.orderby || order !== this._userService.queryParams.order) {
      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: {
          orderby: orderby,
          order: order,
        },
        queryParamsHandling: 'merge',
      });

      this._userService.queryParams.order = order;
      this._userService.queryParams.orderby = orderby;
    }
  }

  public ngOnDestroy(): void {
    this._subscriptons.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

}
