import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private isGameActiveSubject$ = new BehaviorSubject<boolean>(false);
  isGameActive$ = this.isGameActiveSubject$.asObservable();

  private newWordAttemptedSubject$ = new Subject<void>();
  newWordAttempted$ = this.newWordAttemptedSubject$.asObservable();

  setGameActive(isActive: boolean) {
    this.isGameActiveSubject$.next(isActive);
  }

  newWordAttempted() {
    this.newWordAttemptedSubject$.next();
  }
}
