import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, merge, Observable, of, Subject, switchMap } from 'rxjs';
import { catchError, filter, tap, withLatestFrom } from 'rxjs/operators';
import { FoundWord } from '../models/found-word.model';
import { WordDefinitionNotFoundResponse } from '../models/word-definition.model';
import { DictionaryApiService } from './dictionary-api.service';
import { GlobalStateService } from './global-state.service';
import { KeyPressService } from './key-press.service';
import { TypedLettersService } from './typed-letters.service';

@Injectable({
  providedIn: 'root',
})
export class FoundWordService {
  private initialFoundWordArray$: Observable<FoundWord[]> = of([]);

  private resetFoundWordArraySubject$ = new Subject<void>();
  private resetFoundWordArray$: Observable<FoundWord[]> =
    this.resetFoundWordArraySubject$.pipe(map(() => []));

  private newFoundWord$: Observable<FoundWord> =
    this.keyPressService.enterKeyPress$.pipe(
      withLatestFrom(this.typedLettersService.typedLetters$),
      filter(([_, typedLetters]) => !!typedLetters),
      switchMap(([_, typedLetters]) =>
        this.dictionaryApiService.getWordDefinition(typedLetters).pipe(
          map(() => {
            this.toastr.success(
              typedLetters,
              `${typedLetters.length} Letter Word Found!`
            );

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

            this.toastr.error(typedLetters, 'Word Not Found!');

            const newFoundWord: FoundWord = {
              word: typedLetters,
              isValidWord: false,
            };
            return of(newFoundWord);
          })
        )
      )
    );

  private accumulatedFoundWordArray$: Observable<FoundWord[]> =
    this.newFoundWord$.pipe(
      withLatestFrom(this.globalStateService.foundWordArray$),
      map(([newWord, enteredWords]) => {
        const accumulatedWords = [...enteredWords, newWord];
        return accumulatedWords;
      })
    );

  displayFoundWordArray$: Observable<FoundWord[]> = merge(
    this.initialFoundWordArray$,
    this.accumulatedFoundWordArray$,
    this.resetFoundWordArray$
  ).pipe(
    tap((foundWordArray: FoundWord[]) => {
      this.globalStateService.setFoundWordArray(foundWordArray);
    })
  );

  constructor(
    private readonly keyPressService: KeyPressService,
    private readonly globalStateService: GlobalStateService,
    private readonly dictionaryApiService: DictionaryApiService,
    private readonly typedLettersService: TypedLettersService,
    private readonly toastr: ToastrService
  ) {}

  reset() {
    this.resetFoundWordArraySubject$.next();
  }
}
