import { Injectable } from '@angular/core';
import { map, merge, Observable, of, Subject, switchMap } from 'rxjs';
import { catchError, tap, withLatestFrom } from 'rxjs/operators';
import { FoundWord } from '../models/found-word.model';
import { WordDefinitionNotFoundResponse } from '../models/word-definition.model';
import { DictionaryApiService } from './dictionary-api.service';
import { GlobalStateService } from './global-state.service';
import { KeyPressService } from './key-press.service';

@Injectable({
  providedIn: 'root',
})
export class FoundWordService {
  private initialFoundWords$: Observable<FoundWord[]> = of([]);

  private resetFoundWordsSubject$ = new Subject<void>();
  private resetFoundWords$: Observable<FoundWord[]> =
    this.resetFoundWordsSubject$.pipe(map(() => []));

  private newFoundWord$: Observable<FoundWord> =
    this.keyPressService.enterKeyPress$.pipe(
      withLatestFrom(this.globalStateService.typedLetters$),
      switchMap(([_, typedLetters]) =>
        this.dictionaryApiService.getWordDefinition(typedLetters).pipe(
          map(() => {
            const newFoundWord: FoundWord = {
              word: typedLetters,
              isValidWord: true,
            };
            return newFoundWord;
          }),
          catchError((err: WordDefinitionNotFoundResponse) => {
            // Handle expected 404 error response from the api call
            // by returning a FoundWord object with isValidWord flag
            // set to false.
            const newFoundWord: FoundWord = {
              word: typedLetters,
              isValidWord: false,
            };
            return of(newFoundWord);
          })
        )
      )
    );

  private accumulatedFoundWords$: Observable<FoundWord[]> =
    this.newFoundWord$.pipe(
      withLatestFrom(this.globalStateService.foundWordArray$),
      map(([newWord, enteredWords]) => {
        const accumulatedWords = [...enteredWords, newWord];
        return accumulatedWords;
      })
    );

  displayFoundWordArray$: Observable<FoundWord[]> = merge(
    this.initialFoundWords$,
    this.accumulatedFoundWords$,
    this.resetFoundWords$
  ).pipe(
    tap((foundWordArray: FoundWord[]) => {
      this.globalStateService.setFoundWordArray(foundWordArray);
    })
  );

  constructor(
    private readonly keyPressService: KeyPressService,
    private readonly globalStateService: GlobalStateService,
    private readonly dictionaryApiService: DictionaryApiService
  ) {}

  reset() {
    this.resetFoundWordsSubject$.next();
  }
}
