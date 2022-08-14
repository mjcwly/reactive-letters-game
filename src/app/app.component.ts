import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { GameState } from './models/game-state.enum';
import { LetterType } from './models/letter-type';
import { ChosenLettersArrayService } from './services/chosen-letters-array.service';
import { ChosenLettersService } from './services/chosen-letters.service';
import { FoundWordArrayService } from './services/found-word-array.service';
import { FoundWordService } from './services/found-words.service';
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
    this.foundWordArrayService.foundWordArray$,
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
        foundWordArray,
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
          foundWordArray,
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
    private readonly chosenLettersArrayService: ChosenLettersArrayService,
    private readonly foundWordArrayService: FoundWordArrayService
  ) {}

  letterTypeSelectedHandler(letterType: LetterType) {
    this.randomLetterService.setRandomLetterType(letterType);
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
