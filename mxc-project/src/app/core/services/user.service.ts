import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  baseUrl = 'https://dev-isf-ticketing-app.azurewebsites.net/api/v1/admin/';

  constructor() { }

  public getUserList() {
    return this.http.get(`${this.baseUrl}user`)
  }
}
