import { Injectable } from "@angular/core";
import { BehaviorSubject, delay } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoading$ = this._loadingSubject.asObservable();

  showLoader(): void {
    this._loadingSubject.next(true);
  }

  hideLoader(): void {
    this._loadingSubject.next(false);
  }
}
