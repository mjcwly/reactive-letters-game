import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { LetterType } from './models/letter-type';
import { ChosenLettersArrayService } from './services/chosen-letters-array.service';
import { ChosenLettersService } from './services/chosen-letters.service';
import { FoundWordService } from './services/found-word.service';
import { GameStateService } from './services/game-state.service';
import { GlobalStateService } from './services/global-state.service';
import { RandomLetterService } from './services/random-letter.service';
import { ScoreService } from './services/score.service';
import { TimerService } from './services/timer.service';
import { TypedLettersService } from './services/typed-letters.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  vm$ = combineLatest([
    this.gameStateService.gameStateModel$,
    this.timerService.timerSettings$,
    this.chosenLettersArrayService.chosenLetterArray$,
    this.typedLettersService.typedLetters$,
    this.foundWordsService.foundWordArray$,
    this.scoreService.scoreModel$,
  ]).pipe(
    map(
      ([
        gameStateModel,
        timerSettings,
        chosenLetterArray,
        typedLetters,
        foundWordArray,
        scoreModel,
      ]) => {
        return {
          gameStateModel,
          timerSettings,
          chosenLetterArray,
          typedLetters,
          foundWordArray,
          scoreModel,
        };
      }
    )
  );

  constructor(
    private readonly chosenLettersService: ChosenLettersService,
    private readonly randomLetterService: RandomLetterService,
    private readonly typedLettersService: TypedLettersService,
    private readonly timerService: TimerService,
    private readonly foundWordsService: FoundWordService,
    private readonly scoreService: ScoreService,
    private readonly globalStateService: GlobalStateService,
    private readonly gameStateService: GameStateService,
    private readonly chosenLettersArrayService: ChosenLettersArrayService
  ) {}

  letterTypeSelectedHandler(letterType: LetterType) {
    this.randomLetterService.setRandomLetterType(letterType);
  }

  onStartButtonClicked() {
    this.globalStateService.setGameActive(true);
  }

  onResetButtonClicked() {
    this.typedLettersService.reset();
    this.chosenLettersService.reset();
    this.timerService.reset();
    this.foundWordsService.reset();
    this.globalStateService.setGameActive(false);
  }
}
