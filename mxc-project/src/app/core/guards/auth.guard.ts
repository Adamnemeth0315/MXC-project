import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _authService = inject(AuthService);
  private _router = inject(Router);


  // Check login status of the user
  canActivate(): Observable<boolean> {
    return this._authService.getLocalStorageData().pipe(
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return true;
        } else {
          // If user is not logged in, will be redirected to the login page
          this._router.navigate(['/']);
          return false;
        }
      })
    );
  }
  }
