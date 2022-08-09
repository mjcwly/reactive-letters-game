import { Injectable } from '@angular/core';
import { map, merge, of, Subject } from 'rxjs';
import { filter, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import { GlobalStateService } from './global-state.service';
import { KeyPressService } from './key-press.service';

@Injectable({
  providedIn: 'root',
})
export class TypedLettersService {
  private initialTypedLetters = of('');

  private typedLetter$ = this.keyPressService.anyLetterPress$.pipe(
    map((e: KeyboardEvent) => String.fromCharCode(e.keyCode))
  );

  private backspaceKeyPress$ = this.keyPressService.backspaceKeyPress$.pipe(
    withLatestFrom(this.globalStateService.typedLetters$),
    map(([, typedLetters]) => {
      const accumulatedLetters = typedLetters.substring(
        0,
        typedLetters.length - 1
      );
      return accumulatedLetters;
    })
  );

  private accumulatedTypedLetters$ = this.typedLetter$.pipe(
    withLatestFrom(
      this.globalStateService.typedLetters$,
      this.globalStateService.chosenLetters$
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

  private resetTypedLettersSubject$ = new Subject<void>();

  private resetTypedLetters$ = merge(
    this.resetTypedLettersSubject$,
    this.keyPressService.escKeyPress$,
    this.globalStateService.foundWords$
  ).pipe(map(() => ''));

  displayTypedLetters$ = merge(
    this.initialTypedLetters,
    this.accumulatedTypedLetters$,
    this.resetTypedLetters$,
    this.backspaceKeyPress$
  ).pipe(
    shareReplay(),
    tap((typedLetters) => {
      this.globalStateService.setTypedLetters(typedLetters);
    })
  );

  constructor(
    private readonly keyPressService: KeyPressService,
    private readonly globalStateService: GlobalStateService
  ) {}

  reset() {
    this.resetTypedLettersSubject$.next();
  }
}
