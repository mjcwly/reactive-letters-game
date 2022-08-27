import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FoundWord } from '../models/found-word.model';
import { ITimerSettings } from '../models/timer-settings';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private foundWordArraySubject$ = new BehaviorSubject<FoundWord[]>([]);
  foundWordArray$ = this.foundWordArraySubject$.asObservable();

  private timerSettingsSubject$ = new BehaviorSubject<ITimerSettings>(null);
  timerSettings$ = this.timerSettingsSubject$.asObservable();

  private gameActiveSubject$ = new BehaviorSubject<boolean>(false);
  gameActive$ = this.gameActiveSubject$.asObservable();

  setFoundWordArray(foundWordArray: FoundWord[]) {
    this.foundWordArraySubject$.next(foundWordArray);
  }

  setTimerSettings(timerSettings: ITimerSettings) {
    this.timerSettingsSubject$.next(timerSettings);
  }

  startGame() {
    this.gameActiveSubject$.next(true);
  }

  endGame() {
    this.gameActiveSubject$.next(false);
  }
}
