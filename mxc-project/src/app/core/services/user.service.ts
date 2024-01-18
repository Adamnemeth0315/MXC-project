import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  configService = inject(ConfigService);

  baseUrl = `${this.configService.baseUrl}admin/`;

  constructor() { }

  public getUserList(): Observable<any> {
    return this.http.get(`${this.baseUrl}user`);
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
