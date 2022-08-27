import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private newWordAttemptedSubject$ = new Subject<void>();
  newWordAttempted$ = this.newWordAttemptedSubject$.asObservable();

  private gameActiveSubject$ = new BehaviorSubject<boolean>(false);
  gameActive$ = this.gameActiveSubject$.asObservable();

  startGame() {
    this.gameActiveSubject$.next(true);
  }

  endGame() {
    this.gameActiveSubject$.next(false);
  }

  newWordAttempted() {
    this.newWordAttemptedSubject$.next();
  }
}
