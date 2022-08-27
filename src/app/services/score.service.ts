import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FoundWord } from '../models/found-word.model';
import { ScoreItem, ScoreModel } from '../models/score';
import { Constants } from '../helpers/constants';
import { FoundWordService } from './found-word.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private scoreItems$: Observable<ScoreItem[]> =
    this.foundWordService.foundWordArray$.pipe(
      map((foundWordArray: FoundWord[]) => {
        // Output: [3,4,5,6,7,8,9]
        // when MIN_LETTERS = 3, MAX_LETTERS = 9
        const wordLengthsArray: number[] = Array.from(
          { length: Constants.MAX_LETTERS },
          (_, i) => i + 1
        ).filter((i) => i >= Constants.MIN_LETTERS);

        const mappedTotals = wordLengthsArray.reduce(
          (accScoreItems, curWordLength) => {
            const countOfFoundWords = foundWordArray.filter(
              (foundWord: FoundWord) =>
                foundWord.word.length === curWordLength && foundWord.isValidWord
            ).length;

            const scoreItem: ScoreItem = {
              wordLength: curWordLength,
              wordCount: countOfFoundWords,
            };

            accScoreItems = [...accScoreItems, scoreItem];

            return accScoreItems;
          },
          []
        );

        return mappedTotals;
      })
    );

  displayScore$: Observable<ScoreModel> = this.scoreItems$.pipe(
    map((scoreItems) => {
      const longestWordLength = scoreItems.reduce((acc, cur) => {
        return cur.wordCount > 0 && cur.wordLength > acc ? cur.wordLength : acc;
      }, 0);

      const scoreModel: ScoreModel = {
        scoreItems,
        longestWordLength,
      };

      return scoreModel;
    })
  );

  constructor(private readonly foundWordService: FoundWordService) {}
}
