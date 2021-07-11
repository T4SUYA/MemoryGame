import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-mode-menu',
  templateUrl: './mode-menu.component.html',
  styleUrls: ['./mode-menu.component.scss'],
})
export class ModeMenuComponent implements OnInit {
  @Output()
  onStart: EventEmitter<number> = new EventEmitter();

  @Output()
  onShowLeadBoard: EventEmitter<any> = new EventEmitter();

  @Input()
  level!: number;
  constructor() {}

  ngOnInit(): void {}
}
