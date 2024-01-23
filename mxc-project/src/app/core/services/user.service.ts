import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser, IUserListResponse } from '../models/user';
import { ConfigService } from './config.service';

export class PageOptions {
  pageIndex = 0;
  limit = 5;
  order = 'asc';
  orderby = 'UserName';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _http = inject(HttpClient);
  private _configService = inject(ConfigService);

  private _baseUrl = `${this._configService.baseUrl}admin/`;
  private _userList$: BehaviorSubject<IUserListResponse> = new BehaviorSubject<IUserListResponse>({results: [], resultsLength: 0});
  public queryParams: PageOptions = {
    order: 'asc',
    pageIndex: 0,
    limit: 5,
    orderby: 'UserName',
  };

  public getUserList(pageOptions: PageOptions): Observable<IUserListResponse> {
    let params = new HttpParams()
    .set('order', pageOptions.order)
    .set('pageIndex', pageOptions.pageIndex)
    .set('limit', pageOptions.limit)
    .set('orderby', pageOptions.orderby);

    this._http.get<IUserListResponse>(`${this._baseUrl}user`, {params}).subscribe({
      next: (userList) => {
        this._userList$.next(userList)
      },
      error: (error) => console.error(error)
    });

    return this._userList$.asObservable();
  }

  public getUserById(id: string): Observable<Object> {
    return this._http.get<IUser>(`${this._baseUrl}user/${id}`);
  }

  public addUser(user: IUser): Observable<Object> {
    return this._http.post<IUser>(`${this._baseUrl}user`, user);
  }

  public editUserById(user: IUser): Observable<Object>  {
    return this._http.put<IUser>(`${this._baseUrl}user/${user.id}`, user);
  }

  public removeUserById(id: string): Observable<Object>  {
    return this._http.delete(`${this._baseUrl}user/${id}`);
  }
}
