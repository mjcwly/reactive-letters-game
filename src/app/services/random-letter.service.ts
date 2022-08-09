import { Injectable } from '@angular/core';
import { map, Observable, of, Subject, switchMap } from 'rxjs';
import { LetterType } from '../models/letter-type';

@Injectable({
  providedIn: 'root',
})
export class RandomLetterService {
  private vowels = 'AAAAAAAAAEEEEEEEEEEEEIIIIIIIIIOOOOOOOOUUUU';
  private vowels$ = of(this.vowels);

  private consonants =
    'BBCCDDDDFFGGGHHJKLLLLMMNNNNNNPPQRRRRRRSSSSTTTTTTVVWWXYYZ';
  private consonants$ = of(this.consonants);

  private randomLetterType$ = new Subject<LetterType>();

  private letterSet$: Observable<string> = this.randomLetterType$.pipe(
    switchMap((letterType) =>
      letterType === LetterType.Vowel ? this.vowels$ : this.consonants$
    )
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
