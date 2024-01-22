import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ILoginUser } from '../models/login';
import { ConfigService } from './config.service';

export class LoginResponse {
  access_token: string = '';
  token_type: string = '';
  expires_in: number = 0;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private configService = inject(ConfigService);

  private baseUrl = `${this.configService.baseUrl}identity/`;
  currentUserSubject$: BehaviorSubject<ILoginUser | null> = new BehaviorSubject<ILoginUser | null>(null);
  public loginResponse: LoginResponse = new LoginResponse();


  get currentUserValue(): any {
    return this.currentUserSubject$.value;
  }

  getLocalStorageData(): Observable<boolean> {
    return of(localStorage[this.configService.storageName]).pipe(
      switchMap((localStorageData) => {
        if (localStorageData) {
          this.loginResponse = JSON.parse(localStorageData);
          return this.getUserMe(this.loginResponse.access_token);
        } else {
          return of(null); // If there is no localStorage data, an empty observable is returned
        }
      }),
      catchError(() => of(null)),
      tap((user) => {
        if (user) {
          this.currentUserSubject$.next(user);
        }
      }),
      map((user) => !!user)
  )};

  public login(user: ILoginUser): Observable<ILoginUser> {
    return this.http.post<LoginResponse>(`${this.baseUrl}token`, user).pipe(
      switchMap((response) => {
        return this.getUserMe(response.access_token).pipe(
          tap((user) => {
            if (response.access_token) {
              localStorage.setItem(this.configService.storageName, JSON.stringify(response));
            }
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
      next: () => {
        localStorage.removeItem(this.configService.storageName);
        this.router.navigate(['/']);
      }
    })
  }

  getUserMe(accessToken: string): Observable<ILoginUser> {
    return this.http.get<ILoginUser>(`${this.configService.baseUrl}user/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  }
}
