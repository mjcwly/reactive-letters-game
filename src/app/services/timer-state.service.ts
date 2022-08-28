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
  private tenthsRemainingCacheSubject$ = new BehaviorSubject<number>(null);

  private isTicking$ = this.chosenLettersService.isChosenLettersFull$;

  private initialSecondsRemaining$: Observable<number> = of(Constants.SECONDS);
  private initialTenthsRemaining$: Observable<number> =
    this.initialSecondsRemaining$.pipe(map((seconds) => seconds * 10));

  private resetTenthsRemainingSubject$ = new Subject<void>();
  private resetTenthsRemaining$: Observable<number> =
    this.resetTenthsRemainingSubject$
      .asObservable()
      .pipe(switchMap(() => this.initialTenthsRemaining$));

  private intervalTenthsRemaining$: Observable<number> = this.isTicking$.pipe(
    filter((isTicking$: boolean) => isTicking$),
    switchMap(() =>
      interval(100).pipe(
        withLatestFrom(this.tenthsRemainingCacheSubject$),
        map(([_, tenthsRemaining]) => tenthsRemaining - 1),
        takeWhile((tenthsRemaining) => tenthsRemaining >= 0),
        takeUntil(this.resetTenthsRemainingSubject$)
      )
    )
  );

  private tenthsRemaining$: Observable<number> = merge(
    this.initialTenthsRemaining$,
    this.intervalTenthsRemaining$,
    this.resetTenthsRemaining$
  ).pipe(
    tap((tenthsRemaining) => {
      this.tenthsRemainingCacheSubject$.next(tenthsRemaining);
    }),
    shareReplay()
  );

  private secondsRemaining$ = this.tenthsRemaining$.pipe(
    map((tenthsRemaining) => Math.ceil(tenthsRemaining / 10))
  );

  private percentageRemaining$: Observable<number> = combineLatest([
    this.tenthsRemaining$,
    this.initialTenthsRemaining$,
  ]).pipe(
    map(([tenthsRemaining, initialTenthsRemaining]) => {
      const percentageRemaining = Math.round(
        (tenthsRemaining / initialTenthsRemaining) * 100
      );
      return percentageRemaining;
    })
  );

  timerStateModel$: Observable<ITimerStateModel> = combineLatest([
    this.isTicking$,
    this.secondsRemaining$,
    this.initialSecondsRemaining$,
    this.percentageRemaining$,
  ]).pipe(
    map(
      ([
        isTicking,
        secondsRemaining,
        initialCountdownTime,
        percentageTimeRemaining,
      ]) => {
        return {
          isTicking,
          secondsRemaining,
          initialCountdownTime,
          percentageTimeRemaining,
        };
      }
    ),
    shareReplay()
  );

  constructor(private readonly chosenLettersService: ChosenLettersService) {}

  reset() {
    this.resetTenthsRemainingSubject$.next();
  }
}
