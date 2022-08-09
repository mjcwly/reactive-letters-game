import { Injectable } from '@angular/core';
import { map, merge, Observable, of, Subject } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { GlobalStateService } from './global-state.service';
import { KeyPressService } from './key-press.service';
import { TypedLettersService } from './typed-letters.service';

@Injectable({
  providedIn: 'root',
})
export class FoundWordService {
  private initialFoundWords$: Observable<string[]> = of([]);

  private resetFoundWordsSubject$ = new Subject<void>();
  private resetFoundWords$ = this.resetFoundWordsSubject$.pipe(map(() => []));

  private newFoundWord$ = this.keyPressService.enterKeyPress$.pipe(
    withLatestFrom(this.globalStateService.typedLetters$),
    map(([_, typedLetters]) => typedLetters)
  );

  private accumulatedFoundWords$ = this.newFoundWord$.pipe(
    withLatestFrom(this.globalStateService.foundWords$),
    map(([newWord, enteredWords]) => {
      const accumulatedWords = [...enteredWords, newWord];
      return accumulatedWords;
    })
  );

  displayFoundWords$ = merge(
    this.initialFoundWords$,
    this.accumulatedFoundWords$,
    this.resetFoundWords$
  ).pipe(
    tap((words) => {
      this.globalStateService.setFoundWords(words);
    })
  );

  constructor(
    private readonly keyPressService: KeyPressService,
    private readonly globalStateService: GlobalStateService
  ) {}

  reset() {
    this.resetFoundWordsSubject$.next();
  }
}
