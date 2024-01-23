import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router,
  ) { }

  // Check login status of the user
  canActivate(): Observable<boolean> {
    return this.authService.getLocalStorageData().pipe(
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/users']);
          return false;
        }
      })
    );
  }
  }
