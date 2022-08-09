import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'found-words',
  templateUrl: './found-words.component.html',
  styleUrls: ['./found-words.component.css'],
})
export class FoundWordsComponent {
  @Input() words: string[];
}
