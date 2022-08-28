import { Injectable } from '@angular/core';
import { combineLatest, filter, map, merge, Observable, of } from 'rxjs';
import { GameState } from '../models/game-state.enum';
import { GameStateModel } from '../models/game-state.model';
import { GlobalStateService } from './global-state.service';
import { TimerStateService } from './timer-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private initialGameState$ = of(GameState.Inactive);

  private inactiveGameState$ = this.globalStateService.isGameActive$.pipe(
    filter((isGameActive) => !isGameActive),
    map(() => GameState.Inactive)
  );

  private activeGameState$ = combineLatest([
    this.globalStateService.isGameActive$,
    this.timerStateService.timerStateModel$,
  ]).pipe(
    filter(([gameActive]) => gameActive),
    map(([_, timerStateModel]) => {
      return !timerStateModel.isTicking
        ? GameState.LetterSelection
        : timerStateModel.displayTime > 0
        ? GameState.PlayingGame
        : GameState.ViewScore;
    })
  );

  private gameState$: Observable<GameState> = merge(
    this.initialGameState$,
    this.inactiveGameState$,
    this.activeGameState$
  );

  gameStateModel$: Observable<GameStateModel> = combineLatest([
    this.globalStateService.isGameActive$,
    this.gameState$,
  ]).pipe(
    map(([gameActive, gameState]: [boolean, GameState]) => ({
      gameState: gameState,
      isGameActive: gameActive,
      isGameInactive: gameState === GameState.Inactive,
      isLetterSelection: gameState === GameState.LetterSelection,
      isPlayingGame: gameState === GameState.PlayingGame,
      isViewScore: gameState === GameState.ViewScore,
    }))
  );

  constructor(
    private readonly globalStateService: GlobalStateService,
    private readonly timerStateService: TimerStateService
  ) {}
}
