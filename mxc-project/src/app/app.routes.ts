import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'users',
    loadChildren: () => import('./features/user-list/users.routes').then((routes) => routes.USERS_ROUTES),
  },
];
