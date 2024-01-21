import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  configService = inject(ConfigService);

  baseUrl = `${this.configService.baseUrl}admin/`;
  private userList$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);

  public getUserList(): Observable<IUser[]> {
    this.http.get<IUser[]>(`${this.baseUrl}user`).subscribe({
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
