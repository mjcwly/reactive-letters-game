import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  merge,
  shareReplay,
  Subject,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Constants } from '../helpers/constants';
import { GlobalStateService } from './global-state.service';
import { RandomLetterService } from './random-letter.service';

@Injectable({
  providedIn: 'root',
})
export class ChosenLettersService {
  private initialChosenLetters = new BehaviorSubject<string>('');

  private resetChosenLettersSubject$ = new Subject<string>();

  private accumulatedChosenLetters$ =
    this.randomLetterService.randomLetter$.pipe(
      withLatestFrom(this.globalStateService.chosenLetters$),
      filter(
        ([, chosenLettersCache]) =>
          chosenLettersCache.length < Constants.MAX_LETTERS
      ),
      map(([randomLetter, chosenLettersCache]) => {
        const accumulatedLetters = chosenLettersCache + randomLetter;
        return accumulatedLetters;
      })
    );

  displayChosenLetters$ = merge(
    this.initialChosenLetters,
    this.accumulatedChosenLetters$,
    this.resetChosenLettersSubject$
  ).pipe(
    shareReplay(),
    tap((displayLetters) => {
      this.globalStateService.setChosenLetters(displayLetters);
    })
  );

  constructor(
    private readonly globalStateService: GlobalStateService,
    private readonly randomLetterService: RandomLetterService
  ) {}

  reset() {
    this.resetChosenLettersSubject$.next('');
  }
}
