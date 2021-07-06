import { transition, trigger, useAnimation } from '@angular/animations';
import { Component } from '@angular/core';
import {
  rotateGlueFromLeft,
  rotateRoomToLeft,
  rotateRoomToRight,
} from 'ngx-router-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('rotateCubeToLeft', [
      transition('login => game', useAnimation(rotateRoomToLeft)),
      transition('game => login', useAnimation(rotateRoomToRight)),
    ]),
  ],
})
export class AppComponent {
  title = 'frontend';

  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
}
