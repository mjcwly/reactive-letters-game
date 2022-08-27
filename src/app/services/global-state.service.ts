import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private newWordFoundSubject$ = new Subject<void>();
  newWordFound$ = this.newWordFoundSubject$.asObservable();

  private gameActiveSubject$ = new BehaviorSubject<boolean>(false);
  gameActive$ = this.gameActiveSubject$.asObservable();

  startGame() {
    this.gameActiveSubject$.next(true);
  }

  endGame() {
    this.gameActiveSubject$.next(false);
  }

  newWordFound() {
    this.newWordFoundSubject$.next();
  }
}
