import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { PageOptions, UserService } from '../../core/services/user.service';
import { UserManagmentDialogComponent } from '../../dialogs/user-managment-dialog/user-managment-dialog.component';
import { IUser, IUserListResponse } from '../../core/models/user';
import { DialogService } from '../../core/services/dialog.service';
import { LoadingService } from '../../core/services/loading.service';

import { TranslateModule } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { UsersTableComponent } from '../users-table/users-table.component';

@UntilDestroy()
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    TranslateModule,
    UsersTableComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  private _userService = inject(UserService);
  private _dialogService = inject(DialogService);
  private _loadingService = inject(LoadingService);
  private _cdr = inject(ChangeDetectorRef);

  public isLoading!: boolean;
  public data!: IUser[];

  // Paginator's variables
  public usersLength = 0;
  public pageIndex = 0;
  public pageSize = 5;
  public pageSizeOptions = [5, 10];

  // Font awesome icons
  public faPlus = faPlus;
  public faUser = faUser;

  ngOnInit(): void {
    this._fetchUsers();
    this._loadingService.isLoading$.subscribe(data => {
      this.isLoading = data;
      this._cdr.detectChanges();
    })
  }

  public onPaginateChange(event: PageEvent): void {
    this._userService.queryParams.limit = event.pageSize;
    this._userService.queryParams.pageIndex = event.pageIndex;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this._fetchUsers();
  }

  private _fetchUsers(): void {
    const pageOptions: PageOptions = this._userService.queryParams;
    this._userService.getUserList(pageOptions).pipe(untilDestroyed(this)).subscribe((users: IUserListResponse) => {
      this.data = users.results;
      this.usersLength = users.resultsLength;
    });
    this._cdr.detectChanges();
  }

  public openAddUserDialog(): void {
    this._dialogService.openDialog(UserManagmentDialogComponent);
  }

  public sortUsers(event: {orderby: string, order: string}): void {
    // Here I set up the queryParams, but first I check whether there are any changes to the stored queryParam values or not
    if (event.orderby !== this._userService.queryParams.orderby || event.order !== this._userService.queryParams.order) {
      this._userService.queryParams.order = event.order;
      this._userService.queryParams.orderby = event.orderby;
      this._fetchUsers();
    }
  }

}
