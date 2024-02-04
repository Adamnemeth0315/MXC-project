import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoading$ = this._loadingSubject.asObservable();
  // The reason why we need to keep track of the number of requests is that if all requests have been executed, only then should hideLoader run!
  private _activeRequests: number = 0;

  showLoader(): void {
    this._activeRequests++;
    this._loadingSubject.next(true);
  }

  hideLoader(): void {
    this._activeRequests--;
    if (this._activeRequests === 0) {
      this._loadingSubject.next(false);
    }
  }
}
