import { Component, Input } from '@angular/core';
import { ITimerStateModel } from '../../models/timer-state.model';

@Component({
  selector: 'countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css'],
})
export class CountdownTimerComponent {
  @Input() timerStateModel: ITimerStateModel;
}
