import { Injectable } from '@angular/core';
import { filter, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyPressService {
  backspaceKeyPress$ = fromEvent(document, 'keyup').pipe(
    filter((e: KeyboardEvent) => e.keyCode === 8)
  );

  enterKeyPress$ = fromEvent(document, 'keyup').pipe(
    filter((e: KeyboardEvent) => e.keyCode === 13)
  );

  escKeyPress$ = fromEvent(document, 'keyup').pipe(
    filter((e: KeyboardEvent) => e.keyCode === 27)
  );

  anyLetterPress$ = fromEvent(document, 'keyup').pipe(
    filter((e: KeyboardEvent) => e.keyCode >= 65 && e.keyCode <= 90)
  );
}
