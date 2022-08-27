import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, Observable } from 'rxjs';
import { Constants } from '../helpers/constants';
import {
  Blank,
  ChosenLetter,
  QuestionMark,
} from '../models/chosen-letter.model';
import { GameStateModel } from '../models/game-state.model';
import { ChosenLettersService } from './chosen-letters.service';
import { GameStateService } from './game-state.service';
import { TypedLettersService } from './typed-letters.service';

@Injectable({
  providedIn: 'root',
})
export class ChosenLettersArrayService {
  private fillChar$: Observable<ChosenLetter> =
    this.gameStateService.gameStateModel$.pipe(
      map((gameStateModel: GameStateModel) =>
        gameStateModel.isLetterSelection ? QuestionMark : Blank
      )
    );

  chosenLetterArray$: Observable<ChosenLetter[]> = combineLatest([
    this.chosenLettersService.chosenLetters$,
    this.typedLettersService.typedLetters$,
    this.fillChar$,
  ]).pipe(
    map(([chosenLetters, typedLetters, fillChar]) => {
      const chosenLettersArr = [...chosenLetters];
      const prefilledChosenLettersArr = new Array(Constants.MAX_LETTERS).fill(
        fillChar
      );
      const chosenLetterArr: ChosenLetter[] = chosenLettersArr.reduce(
        (acc, cur, index) => {
          acc[index] = { letter: cur, isTypedLetter: false };
          return acc;
        },
        prefilledChosenLettersArr
      );

      const typedLettersArr = [...typedLetters];
      const chosenLetterArr2: ChosenLetter[] = typedLettersArr.reduce(
        (acc, cur) => {
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
