import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  private _authService = inject(AuthService);

  public showLogout = false;
  public userName = '';
  public defaultLang = '';

  constructor(public translate: TranslateService) {
    translate.addLangs(['hu', 'en']);
    translate.setDefaultLang('hu');
  }

  ngOnInit(): void {
    this._authService.currentUserSubject$.subscribe((user) => {
      if (user) {
        this.showLogout = true;
        this.userName = user.userName;
      } else {
        this.showLogout = false;
      }
    });
    // Itt állítom be a default languaget TODO: Még meg kell oldani, hogy oldalfrissítésre ne állítódjon vissza magyarra ha átváltok.
    this.defaultLang = this.translate.store.defaultLang;
  }

  public switchLang(language: string) {
    //Itt váltok a nyelverk között.
    this.translate.use(language);
  }

  public logout() {
    // Since it didn't run oninit at logout, I reset it manually here
    this.showLogout = false;
    this._authService.logout();
  }
}
