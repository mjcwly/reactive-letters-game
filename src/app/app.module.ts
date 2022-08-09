import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LetterSelectorComponent } from './components/letter-selector/letter-selector.component';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { FoundWordsComponent } from './components/found-words/found-words.component';
import { TypedLettersComponent } from './components/typed-letters/typed-letters.component';
import { ChosenLettersComponent } from './components/chosen-letters/chosen-letters.component';
import { ScoreComponent } from './components/score/score.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    LetterSelectorComponent,
    ChosenLettersComponent,
    CountdownTimerComponent,
    FoundWordsComponent,
    TypedLettersComponent,
    ScoreComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
