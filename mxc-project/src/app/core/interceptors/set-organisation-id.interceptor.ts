import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ConfigService } from "../services/config.service";

@Injectable()
export class SetOrganisationIdInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
  configService = inject(ConfigService);

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const organisationId = this.configService.organisationID;
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
