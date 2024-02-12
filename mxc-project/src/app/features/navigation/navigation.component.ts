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
  public selectedLang = '';

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

    // Here I set the selected language
    this.selectedLang = localStorage.getItem('selectedLang') ?? this.translate.getDefaultLang();
    this.translate.use(this.selectedLang);
  }

  public switchLang(language: string) {
    this.translate.use(language);
    this.selectedLang = language;
    localStorage.setItem('selectedLang', language);
  }

  public logout() {
    // Since it didn't run oninit at logout, I reset it manually here
    this.showLogout = false;
    this._authService.logout();
  }
}
