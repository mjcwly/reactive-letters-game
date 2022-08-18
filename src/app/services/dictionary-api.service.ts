import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, EMPTY } from 'rxjs';
import {
  WordDefinitionNotFoundResponse,
  WordDefinitionResponse,
} from '../models/word-definition.model';

@Injectable({
  providedIn: 'root',
})
export class DictionaryApiService {
  constructor(private readonly httpClient: HttpClient) {}

  getWordDefinition(
    word: string
  ): Observable<WordDefinitionResponse | WordDefinitionNotFoundResponse> {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    return this.httpClient.get<WordDefinitionResponse>(url).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        switch (httpErrorResponse.status) {
          case 404: {
            // Expected API Error Response: Word Not Found
            // - So throw the same error to handle down stream
            throw httpErrorResponse;
          }
          default: {
            // Unexpected Http Error (e.g. No Network)
            // - So return the EMPTY observable to keep the stream alive
            // - Continue down the happy path (bypass this valid word check)
            return EMPTY;
          }
        }
      })
    );
  }
}
