import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ILoginUser } from '../models/login';
import { environment } from '../../../environments/environment';
import { ILoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _router = inject(Router);

  private baseUrl = `${environment.baseUrl}identity/`;
  currentUserSubject$: BehaviorSubject<ILoginUser | null> =
    new BehaviorSubject<ILoginUser | null>(null);

  get currentUserValue(): ILoginUser | null {
    return this.currentUserSubject$.value;
  }

  getLocalStorageData(): Observable<boolean> {
    const localStorageData: string = localStorage[environment.storageName];
    if (localStorageData) {
      return this.getUserMe().pipe(
        catchError(() => of(null)), // If there is some error, an empty observable is returned
        tap((user) => {
          if (user) {
            this.currentUserSubject$.next(user); // If there is a user set it to currentUserSubject$
          }
        }),
        map((user) => !!user) // Returns a true or false depending on whether there is a user
        )
    } else {
      return of(false); //If no localstorageData return false.
    }
  }

  public login(user: ILoginUser): Observable<ILoginUser> {
    return this._http.post<ILoginResponse>(`${this.baseUrl}token`, user).pipe(
      switchMap((response) => {
        if (response.access_token) {
          localStorage.setItem(
            environment.storageName,
            JSON.stringify(response.access_token)
          );
        }
        return this.getUserMe().pipe(
          tap((user) => {
            this.currentUserSubject$.next(user);
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
      },
    });
  }

  getUserMe(): Observable<ILoginUser> {
    return this._http.get<ILoginUser>(`${environment.baseUrl}user/me`);
  }
}
