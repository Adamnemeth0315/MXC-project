import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { IUser } from '../../core/models/user';
import { DialogService } from '../../core/services/dialog.service';
import { UserService } from '../../core/services/user.service';
import { DeleteUserDialogComponent } from '../../dialogs/delete-user-dialog/delete-user-dialog.component';
import { UserManagmentDialogComponent } from '../../dialogs/user-managment-dialog/user-managment-dialog.component';

import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

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

@Component({
  selector: 'app-users-table',
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
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
  private _userService = inject(UserService);
  private _dialogService = inject(DialogService);

  @Input() data!: IUser[];
  @Input() usersLength!: number;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;
  @Input() pageSizeOptions!: number[];

  @Output('page') page: EventEmitter<PageEvent> = new EventEmitter();
  @Output('sort') sort: EventEmitter<{orderby: string, order: string}> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = [
    'userName',
    'createdAt',
    'edit',
    'delete',
  ];

  // Font awesome icons
  public faAngleDown = faAngleDown;
  public faAngleUp = faAngleUp;

  public onPaginateChange(event: PageEvent): void {
    this.page.emit(event)
  }

  public openEditUserDialog(user: IUser): void {
    this._userService.getUserById(user.id).subscribe((user) => {
        this._dialogService.openDialog(UserManagmentDialogComponent, user);
      })
  }

  public deleteUser(user: IUser): void {
    this._dialogService.openDialog(DeleteUserDialogComponent, user)
  }

  public sortUsers(orderby: string, order: string): void {
    this.sort.emit({orderby, order})
  }

}
