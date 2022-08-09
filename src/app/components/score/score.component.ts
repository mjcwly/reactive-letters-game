import { Component, Input, OnInit } from '@angular/core';
import { ScoreModel } from '../../models/score';

@Component({
  selector: 'score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css'],
})
export class ScoreComponent {
  @Input() score: ScoreModel;
}

export interface NumberOfLettersObj {
  numberOfLetters: string;
  countOfFound: number;
}
