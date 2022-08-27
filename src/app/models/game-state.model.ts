import { GameState } from './game-state.enum';

export class GameStateModel {
  gameState: GameState;
  isGameActive: boolean;
  isGameInactive: boolean;
  isLetterSelection: boolean;
  isPlayingGame: boolean;
  isViewScore: boolean;
}
