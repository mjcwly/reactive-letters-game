import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Constants } from '../../helpers/constants';
import { GameState } from '../../models/game-state.enum';

@Component({
  selector: 'typed-letters',
  templateUrl: './typed-letters.component.html',
  styleUrls: ['./typed-letters.component.css'],
})
export class TypedLettersComponent implements OnChanges {
  @Input() letters: string;
  @Input() gameState: GameState;

  gameStateEnum: typeof GameState = GameState;
  typedLettersArr: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.typedLettersArr = new Array(Constants.MAX_LETTERS).fill(' ');
    this.letters.split('').forEach((letter, index) => {
      this.typedLettersArr[index] = letter;
    });
  }
}
