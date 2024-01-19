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

  constructor() { }

  public getUserList(): Observable<IUser[]> {
    this.http.get(`${this.baseUrl}user`).subscribe({
      next: (userList) => {
        this.userList$.next(userList as IUser[])
      },
      error: (error) => console.error(error)
    });

    return this.userList$.asObservable();;
  }

  public getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}user/${id}`);
  }

  public addUser(user: IUser) {
    return this.http.post(`${this.baseUrl}user`, user);
  }

  public editUserById(user: IUser) {
    return this.http.put(`${this.baseUrl}user/${user.id}`, user);
  }

  public removeUserById(id: string) {
    return this.http.delete(`${this.baseUrl}user/${id}`);
  }
}
