import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router)

  public showLogout = false;
  public userName: string = '';

  ngOnInit(): void {
    this.authService.currentUserSubject$.subscribe((user) => {
      if (user) {
        this.showLogout = true;
        this.userName = user.userName;
      } else {
        this.showLogout = false;
      }
    });
  }

  public logout() {
    // Since it didn't run oninit at logout, I reset it manually here
    this.showLogout = false;
    this.authService.logout()
  }

}
