import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { GameState } from './models/game-state.enum';
import { LetterType } from './models/letter-type';
import { ChosenLettersArrayService } from './services/chosen-letters-array.service';
import { ChosenLettersService } from './services/chosen-letters.service';
import { FoundWordService } from './services/found-words.service';
import { GameStateService } from './services/game-state.service';
import { GlobalStateService } from './services/global-state.service';
import { ScoreService } from './services/score.service';
import { TimerService } from './services/timer.service';
import { TypedLettersService } from './services/typed-letters.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  gameState = GameState;

  vm$ = combineLatest([
    this.gameStateService.gameState$,
    this.globalStateService.gameActive$,
    this.chosenLettersService.displayChosenLetters$,
    this.timerService.timerSettings$,
    this.typedLettersService.displayTypedLetters$,
    this.foundWordsService.displayFoundWords$,
    this.chosenLettersArrayService.chosenLetterArray$,
    this.scoreService.displayScore$,
  ]).pipe(
    map(
      ([
        gameState,
        gameActive,
        chosenLetters,
        timerSettings,
        typedLetters,
        foundWords,
        chosenLetterArray,
        score,
      ]) => {
        return {
          gameState,
          gameActive,
          chosenLetters,
          timerSettings,
          typedLetters,
          foundWords,
          chosenLetterArray,
          score,
        };
      }
    )
  );

  constructor(
    private readonly chosenLettersService: ChosenLettersService,
    private readonly typedLettersService: TypedLettersService,
    private readonly timerService: TimerService,
    private readonly foundWordsService: FoundWordService,
    private readonly scoreService: ScoreService,
    private readonly globalStateService: GlobalStateService,
    private readonly gameStateService: GameStateService,
    private readonly chosenLettersArrayService: ChosenLettersArrayService
  ) {}

  letterTypeSelectedHandler(letterType: LetterType) {
    this.chosenLettersService.setLetterType(letterType);
  }

  start() {
    this.globalStateService.startGame();
  }

  reset() {
    this.typedLettersService.reset();
    this.chosenLettersService.reset();
    this.timerService.reset();
    this.foundWordsService.reset();
    this.globalStateService.endGame();
  }
}
