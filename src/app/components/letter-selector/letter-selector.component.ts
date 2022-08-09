import { Component, EventEmitter, Output } from '@angular/core';
import { LetterType } from '../../models/letter-type';

@Component({
  selector: 'letter-selector',
  templateUrl: './letter-selector.component.html',
  styleUrls: ['./letter-selector.component.css'],
})
export class LetterSelectorComponent {
  @Output() letterTypeSelectedEvent = new EventEmitter<LetterType>();

  onConsonantClicked(): void {
    this.letterTypeSelectedEvent.emit(LetterType.Consonant);
  }

  onVowelClicked(): void {
    this.letterTypeSelectedEvent.emit(LetterType.Vowel);
  }
}
