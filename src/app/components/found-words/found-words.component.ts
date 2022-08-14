import { Component, Input } from '@angular/core';
import { FoundWord } from '../../models/found-word.model';

@Component({
  selector: 'found-words',
  templateUrl: './found-words.component.html',
  styleUrls: ['./found-words.component.css'],
})
export class FoundWordsComponent {
  @Input() foundWordArray: FoundWord[];
}
