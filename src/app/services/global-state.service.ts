import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ITimerSettings } from '../models/timer-settings';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private newWordFoundSubject$ = new Subject<void>();
  newWordFound$ = this.newWordFoundSubject$.asObservable();

  private timerSettingsSubject$ = new BehaviorSubject<ITimerSettings>(null);
  timerSettings$ = this.timerSettingsSubject$.asObservable();

  private gameActiveSubject$ = new BehaviorSubject<boolean>(false);
  gameActive$ = this.gameActiveSubject$.asObservable();

  setTimerSettings(timerSettings: ITimerSettings) {
    this.timerSettingsSubject$.next(timerSettings);
  }

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
