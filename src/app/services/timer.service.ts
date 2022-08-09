import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  interval,
  map,
  merge,
  of,
  Subject,
  switchMap,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalStateService } from './global-state.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private readonly SECONDS = 30;

  private initialCountdownTime$ = of(this.SECONDS);

  private startTimerSubject$ = new Subject<void>();
  private stopTimerSubjec$ = new Subject<void>();

  private isTicking$ = this.globalStateService.chosenLetters$.pipe(
    map((selectedLetters) => {
      const isTicking = selectedLetters.length === 9;
      isTicking ? this.startTimerSubject$.next() : this.stopTimerSubjec$.next();
      return isTicking;
    })
  );

  private resetCountdownTimeSubject$ = new Subject<number>();

  private countdownTimeSubject$ = new BehaviorSubject<number>(null);

  private autoDecrementedTime$ = this.startTimerSubject$.pipe(
    switchMap(() =>
      interval(1000).pipe(
        withLatestFrom(this.countdownTimeSubject$),
        map(([interval, countdownTimer]) => countdownTimer - 1),
        takeWhile((countdownTimer) => countdownTimer >= 0),
        takeUntil(this.resetCountdownTimeSubject$)
      )
    )
  );

  private displayTime$ = merge(
    this.initialCountdownTime$,
    this.autoDecrementedTime$,
    this.resetCountdownTimeSubject$
  ).pipe(
    tap((countdownTimer) => {
      this.countdownTimeSubject$.next(countdownTimer);
    })
  );

  timerSettings$ = combineLatest([
    this.isTicking$,
    this.displayTime$,
    this.initialCountdownTime$,
  ]).pipe(
    map(([isTicking, displayTime, initialCountdownTime]) => {
      return { isTicking, displayTime, initialCountdownTime };
    }),
    tap((timerSettings) => {
      this.globalStateService.setTimerSettings(timerSettings);
    })
  );

  constructor(private readonly globalStateService: GlobalStateService) {}

  reset() {
    this.resetCountdownTimeSubject$.next(this.SECONDS);
  }
}
