import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { environment } from '../../../environments/environment';

@Injectable()
export class SetOrganisationIdInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const organisationId = environment.organisationID;
    const token = localStorage[environment.storageName];

    if (token) {
      const accesToken = JSON.parse(token);
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accesToken}`,
          'X-OrganisationId': organisationId
        },
      });

      return next.handle(modifiedRequest);
    }
    return next.handle(request);
    }
}
