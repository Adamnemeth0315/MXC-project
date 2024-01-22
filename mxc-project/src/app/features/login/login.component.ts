import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILoginUser } from '../../core/models/login';
import { AuthService } from '../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private route = inject(Router)

  public hidePassword = true;
  public hasError = false;


  public loginForm = new FormGroup({
    userName: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z]).+$')])
  });

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  };

  public login(): void {
    const user = this.loginForm.value as ILoginUser;
    this.authService.login(user).subscribe({
      next: () => {
        this.route.navigate(['/users'], {queryParams: this.userService.queryParams});
        this.hasError = false;
      },
      error: () => this.hasError = true
    })
  };

}
