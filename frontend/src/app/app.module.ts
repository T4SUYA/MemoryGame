import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './views/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { GameComponent } from './views/game/game.component';
import { AuthorizationInterceptor } from './shared/interceptors/authorization';
import { PlayingCardsComponent } from './views/game/components/playing-cards/playing-cards.component';
import { TimerComponent } from './views/game/components/timer/timer.component';
import { ModeSelectorComponent } from './views/game/components/mode-selector/mode-selector.component';
import { ModeMenuComponent } from './views/game/components/mode-menu/mode-menu.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    PlayingCardsComponent,
    TimerComponent,
    ModeSelectorComponent,
    ModeMenuComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ToastrModule.forRoot(),
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
