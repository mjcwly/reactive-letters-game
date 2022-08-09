import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css'],
})
export class CountdownTimerComponent implements OnChanges {
  @Input() timeRemaining: number;
  @Input() initialTime: number;

  percentage: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.percentage = ((this.timeRemaining * 100) / (this.initialTime * 100)) * 100;
  }
}
