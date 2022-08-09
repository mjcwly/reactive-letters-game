import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  merge,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { LetterType } from '../models/letter-type';
import { GlobalStateService } from './global-state.service';

@Injectable({
  providedIn: 'root',
})
export class ChosenLettersService {
  private consonants =
    'BBCCDDDDFFGGGHHJKLLLLMMNNNNNNPPQRRRRRRSSSSTTTTTTVVWWXYYZ';
  private consonants$ = of(this.consonants);

  private vowels = 'AAAAAAAAAEEEEEEEEEEEEIIIIIIIIIOOOOOOOOUUUU';
  private vowels$ = of(this.vowels);

  private letterTypeSubject$ = new Subject<LetterType>();

  private randomLetter$ = this.letterTypeSubject$.pipe(
    switchMap((letterType) =>
      (letterType === LetterType.Consonant
        ? this.consonants$
        : this.vowels$
      ).pipe(
        map((letterSet) => {
          const randomIndex = Math.floor(Math.random() * letterSet.length);
          const randomLetter = letterSet.charAt(randomIndex);
          return randomLetter;
        })
      )
    )
  );

  private initialChosenLetters = new BehaviorSubject<string>('');

  private resetChosenLettersSubject$ = new Subject<string>();

  private accumulatedChosenLetters$ = this.randomLetter$.pipe(
    withLatestFrom(this.globalStateService.chosenLetters$),
    filter(([, chosenLettersCache]) => chosenLettersCache.length < 9),
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

  constructor(private readonly globalStateService: GlobalStateService) {}

  setLetterType(letterType: LetterType) {
    this.letterTypeSubject$.next(letterType);
  }

  reset() {
    this.resetChosenLettersSubject$.next('');
  }
}
