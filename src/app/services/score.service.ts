import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FoundWord } from '../models/found-word.model';
import { ScoreItem, ScoreModel } from '../models/score';
import { GlobalStateService } from './global-state.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private scoreItems$: Observable<ScoreItem[]> =
    this.globalStateService.foundWordArray$.pipe(
      map((foundWordArray: FoundWord[]) => {
        const wordLengths = [3, 4, 5, 6, 7, 8, 9];
        const mappedTotals = wordLengths.reduce(
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
      return { scoreItems };
    })
  );

  constructor(private readonly globalStateService: GlobalStateService) {}
}
