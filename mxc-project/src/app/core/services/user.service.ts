import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private baseUrl = `${this.configService.baseUrl}admin/`;
  private userList$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
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

    this.http.get<IUser[]>(`${this.baseUrl}user`, {params}).subscribe({
      next: (userList) => {
        this.userList$.next(userList)
      },
      error: (error) => console.error(error)
    });

    return this.userList$.asObservable();
  }

  public getUserById(id: string): Observable<Object> {
    return this.http.get<IUser>(`${this.baseUrl}user/${id}`);
  }

  public addUser(user: IUser): Observable<Object> {
    return this.http.post<IUser>(`${this.baseUrl}user`, user);
  }

  public editUserById(user: IUser): Observable<Object>  {
    return this.http.put<IUser>(`${this.baseUrl}user/${user.id}`, user);
  }

  public removeUserById(id: string): Observable<Object>  {
    return this.http.delete(`${this.baseUrl}user/${id}`);
  }
}
