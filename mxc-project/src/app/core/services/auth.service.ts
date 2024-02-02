import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ILoginUser } from '../models/login';
import { environment } from '../../../environments/environment';

export class LoginResponse {
  access_token = '';
  token_type = '';
  expires_in = 0;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private _router = inject(Router);

  private baseUrl = `${environment.baseUrl}identity/`;
  currentUserSubject$: BehaviorSubject<ILoginUser | null> = new BehaviorSubject<ILoginUser | null>(null);
  public loginResponse: LoginResponse = new LoginResponse();


  get currentUserValue(): ILoginUser | null {
    return this.currentUserSubject$.value;
  }

  getLocalStorageData(): Observable<boolean> {
    return of(localStorage[environment.storageName]).pipe(
      switchMap((localStorageData: string) => {
        if (localStorageData) {
          this.loginResponse = JSON.parse(localStorageData);
          return this.getUserMe(this.loginResponse.access_token);
        } else {
          return of(null); // If there is no localStorage data, an empty observable is returned
        }
      }),
      catchError(() => of(null)), // If there is some error, an empty observable is returned
      tap((user) => {
        if (user) {
          this.currentUserSubject$.next(user); // If there is a user set it to currentUserSubject$
        }
      }),
      map((user) => !!user) // Returns a true or false depending on whether there is a user
  )}

  public login(user: ILoginUser): Observable<ILoginUser> {
    return this._http.post<LoginResponse>(`${this.baseUrl}token`, user).pipe(
      switchMap((response) => {
        return this.getUserMe(response.access_token).pipe(
          tap((user) => {
            if (response.access_token) {
              localStorage.setItem(environment.storageName, JSON.stringify(response));
            }
            this.currentUserSubject$.next(user);
            this.loginResponse = response;
          }),
          catchError((error) => {
            return throwError(() => new Error(error.message));
          })
        );
      })
    );
  }

  public logout(): void {

    this._http.post(`${this.baseUrl}logout`, null).subscribe({
      next: () => {
        localStorage.removeItem(environment.storageName);
        this.currentUserSubject$.next(null);
        this._router.navigate(['/']);
      }
    })
  }

  getUserMe(accessToken: string): Observable<ILoginUser> {
    return this._http.get<ILoginUser>(`${environment.baseUrl}user/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  }
}
