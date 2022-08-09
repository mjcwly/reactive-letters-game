import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ScoreItem, ScoreModel } from '../models/score';
import { GlobalStateService } from './global-state.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private scoreItems$: Observable<ScoreItem[]> =
    this.globalStateService.foundWords$.pipe(
      map((foundWords) => {
        const wordLengths = [3, 4, 5, 6, 7, 8, 9];
        const mappedTotals = wordLengths.reduce(
          (accScoreItems, curWordLength) => {
            const countOfFoundWords = foundWords.filter(
              (word) => word.length === curWordLength
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
