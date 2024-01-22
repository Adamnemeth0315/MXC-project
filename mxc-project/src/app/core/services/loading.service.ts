import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading = false;

  public showLoader(): void {
    this.loading = true;
  }

  public hideLoader(): void {
    this.loading = false;
  }

}
