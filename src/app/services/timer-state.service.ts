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
  shareReplay,
  Observable,
} from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants } from '../helpers/constants';
import { ITimerStateModel } from '../models/timer-state.model';
import { ChosenLettersService } from './chosen-letters.service';

@Injectable({
  providedIn: 'root',
})
export class TimerStateService {
  private secondsRemainingCacheSubject$ = new BehaviorSubject<number>(null);
  private secondsRemainingCache$ =
    this.secondsRemainingCacheSubject$.asObservable();

  private isTicking$ = this.chosenLettersService.isChosenLettersFull$;

  private initialSecondsRemaining$: Observable<number> = of(Constants.SECONDS);

  private resetSecondsRemainingSubject$ = new Subject<void>();
  private resetSecondsRemaining$: Observable<number> =
    this.resetSecondsRemainingSubject$
      .asObservable()
      .pipe(map(() => Constants.SECONDS));

  private intervalSecondsRemaining$: Observable<number> = this.isTicking$.pipe(
    filter((isTicking$: boolean) => isTicking$),
    switchMap(() =>
      interval(1000).pipe(
        withLatestFrom(this.secondsRemainingCache$),
        map(([_, countdownTimer]) => countdownTimer - 1),
        takeWhile((countdownTimer) => countdownTimer >= 0),
        takeUntil(this.resetSecondsRemainingSubject$)
      )
    )
  );

  private secondsRemaining$: Observable<number> = merge(
    this.initialSecondsRemaining$,
    this.intervalSecondsRemaining$,
    this.resetSecondsRemaining$
  ).pipe(
    tap((countdownTimer) => {
      this.secondsRemainingCacheSubject$.next(countdownTimer);
    })
  );

  timerStateModel$: Observable<ITimerStateModel> = combineLatest([
    this.isTicking$,
    this.secondsRemaining$,
    this.initialSecondsRemaining$,
  ]).pipe(
    map(([isTicking, displayTime, initialCountdownTime]) => {
      return { isTicking, displayTime, initialCountdownTime };
    }),
    shareReplay()
  );

  constructor(private readonly chosenLettersService: ChosenLettersService) {}

  reset() {
    this.resetSecondsRemainingSubject$.next();
  }
}
