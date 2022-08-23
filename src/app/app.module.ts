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
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    }),
  ],
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
