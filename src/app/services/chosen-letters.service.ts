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
  switchMap,
} from 'rxjs';
import { Constants } from '../helpers/constants';
import { LetterType } from '../models/letter-type';
import { RandomLetterService } from './random-letter.service';

@Injectable({
  providedIn: 'root',
})
export class ChosenLettersService {
  private shuffleSubject$ = new Subject<void>();
  private autoSelectSubject$ = new Subject<void>();

  private chosenLettersCacheSubject$ = new BehaviorSubject<string>('');
  private chosenLettersCache$ = this.chosenLettersCacheSubject$.asObservable();

  private initialChosenLetters$: Observable<string> = of('');

  private resetChosenLettersSubject$ = new Subject<void>();
  private resetChosenLetters$: Observable<string> =
    this.resetChosenLettersSubject$.pipe(
      switchMap(() => this.initialChosenLetters$)
    );

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
      }),
      shareReplay()
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

  private autoChosenLetters$: Observable<string> = this.autoSelectSubject$.pipe(
    withLatestFrom(this.chosenLettersCache$),
    tap(([_, chosenLettersCache]: [void, string]) => {
      for (let i = chosenLettersCache.length; i < Constants.MAX_LETTERS; i++) {
        const letterType =
          i % 2 === 0 ? LetterType.Consonant : LetterType.Vowel;
        this.randomLetterService.setRandomLetterType(letterType);
      }
    }),
    switchMap(() => this.accumulatedChosenLetters$)
  );

  chosenLetters$: Observable<string> = merge(
    this.initialChosenLetters$,
    this.accumulatedChosenLetters$,
    this.resetChosenLetters$,
    this.shuffledChosenLetters$,
    this.autoChosenLetters$
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

  autoSelect() {
    this.autoSelectSubject$.next();
  }
}
