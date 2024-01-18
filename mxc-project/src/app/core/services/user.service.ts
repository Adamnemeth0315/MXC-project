import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  configService = inject(ConfigService);

  baseUrl = `${this.configService.baseUrl}admin/`;

  constructor() { }

  public getUserList() {
    return this.http.get(`${this.baseUrl}user`);
  }

  public getUserById(id: string) {
    return this.http.get(`${this.baseUrl}user/${id}`);
  }

  public removeUserById(id: string) {
    return this.http.delete(`${this.baseUrl}user/${id}`);
  }
}
