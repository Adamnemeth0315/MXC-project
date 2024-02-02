import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoading$ = this._loadingSubject.asObservable();
  // Azért kell, hogy figyeljük a requestek számát, ha minden request lefutott csak akkor fusson le a hideLoader! 
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
