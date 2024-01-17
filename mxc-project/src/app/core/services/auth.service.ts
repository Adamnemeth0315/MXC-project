import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ILoginUser } from '../models/login';
import { IUser } from '../models/user';
import { ConfigService } from './config.service';

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  configService = inject(ConfigService);

  baseUrl = `${this.configService.baseUrl}identity/`;
  currentUserSubject$: BehaviorSubject<ILoginUser | null> = new BehaviorSubject<ILoginUser | null>(null);
  public loginResponse: ILoginResponse = {access_token: '', token_type: '', expires_in: 0}

  constructor() { }

  get currentUserValue(): any {
    return this.currentUserSubject$.value;
  }

  async getLocalStorageData(): Promise<boolean> {
    if (localStorage['currentUser']) {
      this.loginResponse = JSON.parse(localStorage['currentUser']);
      const user = await this.getUserMe(this.loginResponse.access_token);
      this.currentUserSubject$.next(user as unknown as ILoginUser);
      return true;
    }
    return false;
  }

  /* getLocalStorageData(): Observable<boolean> {
    return of(localStorage['currentUser']).pipe(
      switchMap((localStorageData) => {
        if (localStorageData) {
          console.log(localStorageData);
          this.loginResponse = JSON.parse(localStorageData);
          console.log(this.loginResponse.access_token);
          return this.getUserMe(this.loginResponse.access_token);
        } else {
          return of(null); // If there is no localStorage data, an empty observable is returned
        }
      }),
      catchError(() => of(null)),
      tap((user) => {
        if (user) {
          console.log(user);
          this.currentUserSubject$.next(user);
        }
      }),
      map((user) => !!user)
  )}; */

  public login(user: any): Observable<any> {
    return this.http.post<ILoginResponse>(`${this.baseUrl}token`, user).pipe(
      switchMap((response) => {
        return this.getUserMe(response.access_token).pipe(
          tap((user) => {

            this.currentUserSubject$.next(user);
            this.loginResponse = response;
          }),
          catchError((error) => {
            return throwError(error);
          })
        );
      })
    );
  }

  public logout(): void {

    this.http.post(`${this.baseUrl}logout`, null).subscribe({
      next: () => this.router.navigate(['/'])
    })
  }

  getUserMe(accessToken: string): Observable<any> {
    return this.http.get<any>(`${this.configService.baseUrl}user/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  }
}
