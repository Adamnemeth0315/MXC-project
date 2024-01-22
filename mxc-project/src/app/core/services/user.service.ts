import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _http = inject(HttpClient);
  private _configService = inject(ConfigService);

  private _baseUrl = `${this._configService.baseUrl}admin/`;
  private _userList$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  public userListLength!: Observable<number>;
  public queryParams = {
    order: 'asc',
    pageIndex: 0,
    limit: 5,
    orderby: 'UserName',
  };

  public getUserList(): Observable<IUser[]> {
    let params = new HttpParams()
    .set('order', this.queryParams.order)
    .set('pageIndex', this.queryParams.pageIndex.toString())
    .set('limit', this.queryParams.limit.toString())
    .set('orderby', this.queryParams.orderby);

    this._http.get<IUser[]>(`${this._baseUrl}user`, {params}).subscribe({
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
