import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  merge,
  Observable,
  of,
  switchMap,
  shareReplay,
} from 'rxjs';
import { FoundWord } from '../models/found-word.model';
import {
  WordDefinitionNotFoundResponse,
  WordDefinitionResponse,
} from '../models/word-definition.model';
import { DictionaryApiService } from './dictionary-api.service';
import { GlobalStateService } from './global-state.service';

@Injectable({
  providedIn: 'root',
})
export class FoundWordArrayService {
  private foundWordArrayDefaults$: Observable<FoundWord[]> =
    this.globalStateService.foundWords$.pipe(
      map((foundWords) => {
        return foundWords.map((word: string) => {
          const foundWord: FoundWord = { word, isValidWord: true };
          return foundWord;
        });
      })
    );

  private foundWordArrayUpdated$: Observable<FoundWord[]> =
    this.foundWordArrayDefaults$.pipe(
      switchMap((foundWordArray: FoundWord[]) => {
        const wordDefinitions$ = foundWordArray.map((foundWord: FoundWord) => {
          return this.dictionaryApiService
            .getWordDefinition(foundWord.word)
            .pipe(
              map((response: WordDefinitionResponse) => {
                return {
                  ...foundWord,
                  isValidWord: true,
                };
              }),
              catchError((err: WordDefinitionNotFoundResponse) => {
                // Handle expected 404 error response from the api call
                // by returning a FoundWord object with isValidWord flag
                // set to false.
                return of({
                  ...foundWord,
                  isValidWord: false,
                });
              })
            );
        });
        return forkJoin([...wordDefinitions$]);
      })
    );

  foundWordArray$ = merge(
    this.foundWordArrayDefaults$,
    this.foundWordArrayUpdated$
  ).pipe(shareReplay());

  constructor(
    private readonly globalStateService: GlobalStateService,
    private readonly dictionaryApiService: DictionaryApiService
  ) {}
}
