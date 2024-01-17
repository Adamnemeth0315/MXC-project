import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { SetOrganisationIdInterceptor } from './core/interceptors/set-organisation-id.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: SetOrganisationIdInterceptor, multi: true }
  ]
};
