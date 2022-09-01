import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ChosenLetter } from '../../models/chosen-letter.model';
import { GameState } from '../../models/game-state.enum';

@Component({
  selector: 'chosen-letters',
  templateUrl: './chosen-letters.component.html',
  styleUrls: ['./chosen-letters.component.css'],
})
export class ChosenLettersComponent implements OnChanges {
  @Input() chosenLetterArray: ChosenLetter[];
  @Input() gameState: GameState;
  @Output() shuffleChosenLettersEvent = new EventEmitter<void>();

  isOutOfFocus = false;

  ngOnChanges(changes: SimpleChanges): void {
    const outOfFocusStates = [GameState.Inactive, GameState.ViewScore];
    this.isOutOfFocus = outOfFocusStates.indexOf(this.gameState) > -1;
  }

  onShuffleButtonClicked() {
    this.shuffleChosenLettersEvent.emit();
  }
}
