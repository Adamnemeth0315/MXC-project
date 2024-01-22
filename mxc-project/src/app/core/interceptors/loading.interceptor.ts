import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { finalize } from 'rxjs/operators';
import { LoadingService } from "../services/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService)

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    this.loadingService.showLoader();

    // This is responsible for setting loading to false in loadingService when the data is received.
    return next.handle(request).pipe(
      finalize(() => this.loadingService.hideLoader())
    );
    }
}
