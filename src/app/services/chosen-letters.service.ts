import { Injectable } from '@angular/core';
import {
  filter,
  map,
  merge,
  Observable,
  of,
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
  private initialChosenLetters: Observable<string> = of('');

  private resetChosenLettersSubject$ = new Subject<void>();
  private resetChosenLetters$: Observable<string> =
    this.resetChosenLettersSubject$.pipe(map(() => ''));

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

  chosenLetters$ = merge(
    this.initialChosenLetters,
    this.accumulatedChosenLetters$,
    this.resetChosenLetters$
  ).pipe(
    tap((displayLetters) => {
      this.globalStateService.setChosenLetters(displayLetters);
    }),
    shareReplay()
  );

  constructor(
    private readonly globalStateService: GlobalStateService,
    private readonly randomLetterService: RandomLetterService
  ) {}

  reset() {
    this.resetChosenLettersSubject$.next();
  }
}
