import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Injectable()
export class SetOrganisationIdInterceptor implements HttpInterceptor {
  authService = inject(AuthService);

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const organisationId = '7065e94e-ace2-4846-9056-1638a97118e5';
    const user = this.authService.currentUserValue;

    if (user) {
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.loginResponse.access_token}`,
          'X-OrganisationId': organisationId
        },
      });

      return next.handle(modifiedRequest);
    }
    return next.handle(request);
    }
}
