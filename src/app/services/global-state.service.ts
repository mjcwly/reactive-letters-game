import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FoundWord } from '../models/found-word.model';
import { ITimerSettings } from '../models/timer-settings';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private chosenLettersSubject$ = new BehaviorSubject<string>('');
  chosenLetters$ = this.chosenLettersSubject$.asObservable();

  private typedLettersSubject$ = new BehaviorSubject<string>('');
  typedLetters$ = this.typedLettersSubject$.asObservable();

  private foundWordArraySubject$ = new BehaviorSubject<FoundWord[]>([]);
  foundWordArray$ = this.foundWordArraySubject$.asObservable();

  private timerSettingsSubject$ = new BehaviorSubject<ITimerSettings>(null);
  timerSettings$ = this.timerSettingsSubject$.asObservable();

  private gameActiveSubject$ = new BehaviorSubject<boolean>(false);
  gameActive$ = this.gameActiveSubject$.asObservable();

  setChosenLetters(chosenLetters: string) {
    this.chosenLettersSubject$.next(chosenLetters);
  }

  setTypedLetters(typedLetters: string) {
    this.typedLettersSubject$.next(typedLetters);
  }

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
