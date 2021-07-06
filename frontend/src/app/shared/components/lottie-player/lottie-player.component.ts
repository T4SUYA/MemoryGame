import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lottie-player',
  templateUrl: './lottie-player.component.html',
  styleUrls: ['./lottie-player.component.css'],
})
export class LottiePlayerComponent implements OnInit {
  @Input()
  src: string = '';

  @Input()
  width: string = '500px';

  @Input()
  height: string = '500px';

  @Input()
  speed: string = '1';

  constructor() {}

  ngOnInit(): void {}
}
