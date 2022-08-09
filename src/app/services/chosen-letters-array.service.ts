import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, Observable } from 'rxjs';
import {
  Blank,
  ChosenLetter,
  QuestionMark,
} from '../models/chosen-letter.model';
import { GameState } from '../models/game-state.enum';
import { ChosenLettersService } from './chosen-letters.service';
import { GameStateService } from './game-state.service';
import { TypedLettersService } from './typed-letters.service';

@Injectable({
  providedIn: 'root',
})
export class ChosenLettersArrayService {
  private fillChar$: Observable<ChosenLetter> =
    this.gameStateService.gameState$.pipe(
      map((gameState) =>
        gameState === GameState.LetterSelection ? QuestionMark : Blank
      )
    );

  chosenLetterArray$ = combineLatest([
    this.chosenLettersService.displayChosenLetters$,
    this.fillChar$,
    this.typedLettersService.displayTypedLetters$,
  ]).pipe(
    map(([chosenLetters, fillChar, typedLetters]) => {
      const chosenLettersArr = [...chosenLetters];
      const prefilledChosenLettersArr = new Array(9).fill(fillChar);
      const chosenLetterArr: ChosenLetter[] = chosenLettersArr.reduce(
        (acc, cur, index) => {
          acc[index] = {
            letter: cur,
            isTypedLetter: false,
          };
          return acc;
        },
        prefilledChosenLettersArr
      );

      const typedLettersArr = [...typedLetters];
      const chosenLetterArr2: ChosenLetter[] = typedLettersArr.reduce(
        (acc, cur, index) => {
          const foundChosenLetterObj = acc.find(
            (chosenLetterObj) =>
              chosenLetterObj.letter === cur && !chosenLetterObj.isTypedLetter
          );
          foundChosenLetterObj.isTypedLetter = true;
          return acc;
        },
        chosenLetterArr
      );

      return chosenLetterArr2;
    }),
    catchError((err) => {
      console.warn('chosenLetterArray$ | catchError | err', err);
      return EMPTY;
    })
  );

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly chosenLettersService: ChosenLettersService,
    private readonly typedLettersService: TypedLettersService
  ) {}
}
