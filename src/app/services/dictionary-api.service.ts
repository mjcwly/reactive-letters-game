import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.httpClient.get<WordDefinitionResponse>(url);
  }
}
