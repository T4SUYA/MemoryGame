import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  private subscription?: Subscription;

  public dateNow = new Date();

  private duration: number = 0;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference = 0;
  public secondsToDuration = 0;
  public minutesToDuration = 0;

  @Output()
  onTimerComplete: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  start(duration: number) {
    this.duration = duration;
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });
  }

  stop() {
    this.subscription?.unsubscribe();
  }

  getTimeLeft() {
    return this.secondsToDuration + 60 * this.minutesToDuration;
  }

  private getTimeDifference() {
    this.timeDifference = this.duration - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    this.secondsToDuration = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute
    );
    this.minutesToDuration = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );

    if (this.secondsToDuration <= 0 && this.minutesToDuration <= 0) {
      this.stop();
      this.onTimerComplete.emit();
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
