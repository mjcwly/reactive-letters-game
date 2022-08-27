import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
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
import { RandomLetterService } from './random-letter.service';

@Injectable({
  providedIn: 'root',
})
export class ChosenLettersService {
  private chosenLettersCacheSubject$ = new BehaviorSubject<string>('');
  private chosenLettersCache$ = this.chosenLettersCacheSubject$.asObservable();

  private initialChosenLetters: Observable<string> = of('');

  private resetChosenLettersSubject$ = new Subject<void>();
  private resetChosenLetters$: Observable<string> =
    this.resetChosenLettersSubject$.pipe(map(() => ''));

  private accumulatedChosenLetters$ =
    this.randomLetterService.randomLetter$.pipe(
      withLatestFrom(this.chosenLettersCache$),
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
      this.chosenLettersCacheSubject$.next(displayLetters);
    }),
    shareReplay()
  );

  constructor(private readonly randomLetterService: RandomLetterService) {}

  reset() {
    this.resetChosenLettersSubject$.next();
  }
}
