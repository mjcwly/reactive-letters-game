import { Injectable } from '@angular/core';
import { BehaviorSubject, map, merge, of, Subject } from 'rxjs';
import { filter, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import { ChosenLettersService } from './chosen-letters.service';
import { GlobalStateService } from './global-state.service';
import { KeyPressService } from './key-press.service';

@Injectable({
  providedIn: 'root',
})
export class TypedLettersService {
  private typedLettersCacheSubject$ = new BehaviorSubject<string>('');
  private typedLettersCache$ = this.typedLettersCacheSubject$.asObservable();

  private initialTypedLetters = of('');

  private typedLetter$ = this.keyPressService.anyLetterPress$.pipe(
    map((e: KeyboardEvent) => String.fromCharCode(e.keyCode))
  );

  private pushedTypedLetters$ = this.typedLetter$.pipe(
    withLatestFrom(
      this.typedLettersCache$,
      this.chosenLettersService.chosenLetters$
    ),
    filter(([typedLetter, typedLetters, chosenLetters]) => {
      const typedLettersArr = [...typedLetters];
      const chosenLettersArr = [...chosenLetters];
      const remainingLetters = typedLettersArr.reduce(
        (accRemainingLettersArr, curTypedLetter) => {
          const indexOfCur = accRemainingLettersArr.indexOf(curTypedLetter);
          if (indexOfCur >= 0) {
            accRemainingLettersArr.splice(indexOfCur, 1);
          }
          return accRemainingLettersArr;
        },
        chosenLettersArr
      );

      return remainingLetters.indexOf(typedLetter) >= 0;
    }),
    map(([typedLetter, typedLetters, chosenLetters]) => {
      const accumulatedLetters = typedLetters + typedLetter;
      return accumulatedLetters;
    })
  );

  private poppedTypedLetters$ = this.keyPressService.backspaceKeyPress$.pipe(
    withLatestFrom(this.typedLettersCache$),
    map(([, typedLetters]) => {
      const accumulatedLetters = typedLetters.substring(
        0,
        typedLetters.length - 1
      );
      return accumulatedLetters;
    })
  );

  private resetTypedLettersSubject$ = new Subject<void>();

  private resetTypedLetters$ = merge(
    this.resetTypedLettersSubject$,
    this.keyPressService.escKeyPress$,
    this.globalStateService.foundWordArray$
  ).pipe(map(() => ''));

  typedLetters$ = merge(
    this.initialTypedLetters,
    this.pushedTypedLetters$,
    this.poppedTypedLetters$,
    this.resetTypedLetters$
  ).pipe(
    shareReplay(),
    tap((typedLetters) => {
      this.typedLettersCacheSubject$.next(typedLetters);
    })
  );

  constructor(
    private readonly keyPressService: KeyPressService,
    private readonly globalStateService: GlobalStateService,
    private readonly chosenLettersService: ChosenLettersService
  ) {}

  reset() {
    this.resetTypedLettersSubject$.next();
  }
}
