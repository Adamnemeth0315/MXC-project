import { Routes } from '@angular/router';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthRedirectGuard],
  },
  {
    path: 'users',
    loadChildren: () => import('./features/user-list/users.routes').then((routes) => routes.USERS_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
