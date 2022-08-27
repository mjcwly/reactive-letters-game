import { Injectable } from '@angular/core';
import { combineLatest, filter, map, merge, Observable, of } from 'rxjs';
import { GameState } from '../models/game-state.enum';
import { GlobalStateService } from './global-state.service';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private initialGameState$ = of(GameState.Inactive);

  private inactiveGameState$ = this.globalStateService.gameActive$.pipe(
    filter((gameActive) => !gameActive),
    map(() => GameState.Inactive)
  );

  private activeGameState$ = combineLatest([
    this.globalStateService.gameActive$,
    this.timerService.timerSettings$,
  ]).pipe(
    filter(([gameActive]) => gameActive),
    map(([_, timerSettings]) => {
      return !timerSettings.isTicking
        ? GameState.LetterSelection
        : timerSettings.displayTime > 0
        ? GameState.PlayingGame
        : GameState.ViewScore;
    })
  );

  gameState$: Observable<GameState> = merge(
    this.initialGameState$,
    this.inactiveGameState$,
    this.activeGameState$
  );

  constructor(
    private readonly globalStateService: GlobalStateService,
    private readonly timerService: TimerService
  ) {}
}
