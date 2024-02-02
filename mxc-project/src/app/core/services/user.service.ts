import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser, IUserListResponse } from '../models/user';
import { environment } from '../../../environments/environment';

export class PageOptions {
  pageIndex = 0;
  limit = 5;
  order = 'asc';
  orderby = '';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _http = inject(HttpClient);

  private _baseUrl = `${environment.baseUrl}admin/`;
  private _userList$: BehaviorSubject<IUserListResponse> = new BehaviorSubject<IUserListResponse>({results: [], resultsLength: 0});

  public queryParams: PageOptions = {
    order: 'asc',
    pageIndex: 0,
    limit: 5,
    orderby: '',
  };

  public getUserList(pageOptions: PageOptions): Observable<IUserListResponse> {
    const params = new HttpParams()
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

  public getUserById(id: string): Observable<IUser> {
    return this._http.get<IUser>(`${this._baseUrl}user/${id}`);
  }

  public addUser(user: IUser): Observable<object> {
    return this._http.post<IUser>(`${this._baseUrl}user`, user);
  }

  public editUserById(user: IUser): Observable<object>  {
    return this._http.put<IUser>(`${this._baseUrl}user/${user.id}`, user);
  }

  public removeUserById(id: string): Observable<object>  {
    return this._http.delete(`${this._baseUrl}user/${id}`);
  }
}
