import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private gameActiveSubject$ = new BehaviorSubject<boolean>(false);
  gameActive$ = this.gameActiveSubject$.asObservable();

  private newWordAttemptedSubject$ = new Subject<void>();
  newWordAttempted$ = this.newWordAttemptedSubject$.asObservable();

  setGameActive(isActive: boolean) {
    this.gameActiveSubject$.next(isActive);
  }

  newWordAttempted() {
    this.newWordAttemptedSubject$.next();
  }
}
