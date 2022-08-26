import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../helpers/constants';
import { ScoreModel } from '../../models/score';

@Component({
  selector: 'score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css'],
})
export class ScoreComponent {
  @Input() score: ScoreModel;

  constants = Constants;
}

export interface NumberOfLettersObj {
  numberOfLetters: string;
  countOfFound: number;
}
