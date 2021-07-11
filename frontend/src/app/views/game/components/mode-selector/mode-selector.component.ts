import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mode-selector',
  templateUrl: './mode-selector.component.html',
  styleUrls: ['./mode-selector.component.scss'],
})
export class ModeSelectorComponent implements OnInit {
  @Output()
  onSelectMode: EventEmitter<number> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  startGame(mode: number): void {
    this.onSelectMode.emit(mode);
  }
}
