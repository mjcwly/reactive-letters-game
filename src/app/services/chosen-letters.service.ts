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
  private shuffleSubject$ = new Subject<void>();

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

  private shuffledChosenLetters$ = this.shuffleSubject$.pipe(
    withLatestFrom(this.chosenLettersCache$),
    map(([_, chosenLetters]) => {
      return chosenLetters
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');
    })
  );

  chosenLetters$: Observable<string> = merge(
    this.initialChosenLetters,
    this.accumulatedChosenLetters$,
    this.resetChosenLetters$,
    this.shuffledChosenLetters$
  ).pipe(
    tap((displayLetters) => {
      this.chosenLettersCacheSubject$.next(displayLetters);
    }),
    shareReplay()
  );

  isChosenLettersFull$: Observable<boolean> = this.chosenLetters$.pipe(
    map((chosenLetters) => chosenLetters.length === Constants.MAX_LETTERS)
  );

  constructor(private readonly randomLetterService: RandomLetterService) {}

  reset() {
    this.resetChosenLettersSubject$.next();
  }

  shuffle() {
    this.shuffleSubject$.next();
  }
}
