import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  shareReplay,
} from 'rxjs';
import { catchError, filter, tap, withLatestFrom } from 'rxjs/operators';
import { FoundWord } from '../models/found-word.model';
import { WordDefinitionNotFoundResponse } from '../models/word-definition.model';
import { DictionaryApiService } from './dictionary-api.service';
import { GameStateService } from './game-state.service';
import { GlobalStateService } from './global-state.service';
import { KeyPressService } from './key-press.service';
import { TypedLettersService } from './typed-letters.service';

@Injectable({
  providedIn: 'root',
})
export class FoundWordService {
  private foundWordArrayCacheSubject$ = new BehaviorSubject<FoundWord[]>(null);
  private foundWordArrayCache$ =
    this.foundWordArrayCacheSubject$.asObservable();

  private initialFoundWordArray$: Observable<FoundWord[]> = of([]);

  private resetFoundWordArraySubject$ = new Subject<void>();
  private resetFoundWordArray$: Observable<FoundWord[]> =
    this.resetFoundWordArraySubject$.pipe(map(() => []));

  private newFoundWord$: Observable<FoundWord> =
    this.keyPressService.enterKeyPress$.pipe(
      withLatestFrom(
        this.typedLettersService.typedLetters$,
        this.gameStateService.gameStateModel$,
        this.foundWordArrayCache$
      ),
      filter(([_, typedLetters, gameStateModel]) => {
        return !!typedLetters && gameStateModel.isPlayingGame;
      }),
      filter(([_, typedLetters, __, foundWordArray]) => {
        const exists =
          foundWordArray.filter(
            (existingFoundWord: FoundWord) =>
              existingFoundWord.word === typedLetters
          ).length > 0;
        return !exists;
      }),
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
      withLatestFrom(this.foundWordArrayCache$),
      map(([newWord, enteredWords]) => {
        this.globalStateService.newWordAttempted();
        const accumulatedWords = [...enteredWords, newWord];
        return accumulatedWords;
      })
    );

  foundWordArray$: Observable<FoundWord[]> = merge(
    this.initialFoundWordArray$,
    this.accumulatedFoundWordArray$,
    this.resetFoundWordArray$
  ).pipe(
    tap((foundWordArray: FoundWord[]) => {
      this.foundWordArrayCacheSubject$.next(foundWordArray);
    }),
    shareReplay()
  );

  constructor(
    private readonly keyPressService: KeyPressService,
    private readonly dictionaryApiService: DictionaryApiService,
    private readonly typedLettersService: TypedLettersService,
    private readonly toastr: ToastrService,
    private readonly gameStateService: GameStateService,
    private readonly globalStateService: GlobalStateService
  ) {}

  reset() {
    this.resetFoundWordArraySubject$.next();
  }
}
