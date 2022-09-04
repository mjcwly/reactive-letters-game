import { Injectable } from '@angular/core';
import { map, Observable, of, Subject, switchMap } from 'rxjs';
import { Constants } from '../helpers/constants';
import { LetterType } from '../models/letter-type';

@Injectable({
  providedIn: 'root',
})
export class RandomLetterService {
  private randomLetterType$ = new Subject<LetterType>();

  private letterSet$: Observable<string> = this.randomLetterType$.pipe(
    map((randomLetterType: LetterType) => {
      return randomLetterType === LetterType.Vowel
        ? Constants.VOWELS_LETTER_SET
        : Constants.CONSONANTS_LETTER_SET;
    })
  );

  randomLetter$ = this.letterSet$.pipe(
    map((letterSet) => {
      const randomIndex = Math.floor(Math.random() * letterSet.length);
      const randomLetter = letterSet.charAt(randomIndex);
      return randomLetter;
    })
  );

  setRandomLetterType(letterType: LetterType) {
    this.randomLetterType$.next(letterType);
  }
}
