import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { CardModel } from 'src/app/shared/models/card-model';

@Component({
  selector: 'app-playing-cards',
  templateUrl: './playing-cards.component.html',
  styleUrls: ['./playing-cards.component.scss'],
})
export class PlayingCardsComponent implements OnInit {
  swap: boolean = false;

  @Input()
  models: Array<CardModel> = [];

  @Output()
  onGameCompleted: EventEmitter<any> = new EventEmitter();

  @Input()
  canPlayEffects: boolean = true;

  @Input()
  gameLevel: number = 1;

  cardSize: number = 110;

  card1: number | undefined;
  card2: number | undefined;

  canClick: boolean = false;

  swipeEffect: HTMLAudioElement;

  swappingCheck: boolean = false;
  constructor() {
    this.swipeEffect = new Audio('assets/sounds/swipe_effect.mp3');
    this.swipeEffect.load();
    this.swipeEffect.volume = 0.1;
  }

  ngOnInit(): void {
    this.calculateCardSize(110);
  }

  startAnimation() {
    const timing = this.cards.length * 140;
    timer(300).subscribe(() => {
      this.spread();
      timer(timing).subscribe(() => {
        this.swap = true;
      });
      timer(timing * 1.8).subscribe(() => {
        this.swap = false;
        this.canClick = true;
      });
    });
  }

  stack() {
    const cards = this.cards;
    for (let index = 0; index < cards.length; index++) {
      timer(index * 100).subscribe(() =>
        cards.item(index)?.setAttribute('class', 'card-wrapper stacked ')
      );
    }
  }

  spread() {
    const cards = this.cards;
    for (let index = 0; index < cards.length; index++) {
      timer(index * 100).subscribe(() =>
        cards.item(index)?.setAttribute('class', 'card-wrapper free')
      );
    }
  }

  get cards() {
    return document.getElementsByClassName('card-wrapper');
  }

  onCardSwap(cardId: number) {
    const c = this.getCard(cardId);
    if (c.hasMatch || !this.canClick) return;
    if (!this.card1) {
      this.card1 = cardId;
      this.flipCard(cardId);
    } else if (!this.card2 && cardId != this.card1) {
      this.card2 = cardId;
      this.flipCard(cardId);
      this.whenTwoCardsExist(this.card1, this.card2);
    }
  }

  whenTwoCardsExist(card1: number, card2: number) {
    const c1 = this.getCard(card1);
    const c2 = this.getCard(card2);

    if (c1.id == c2.id) {
      c1.hasMatch = true;
      c2.hasMatch = true;
      this.checkGameWon();
    } else {
      timer(350).subscribe(() => {
        c1.flipped = false;
        c2.flipped = false;
      });
    }
    this.cleanSelectedCards();
  }

  cleanSelectedCards() {
    this.card1 = undefined;
    this.card2 = undefined;
  }

  getCard(cardId: number) {
    const card = this.models.find((card) => card.cardId === cardId);
    if (card) {
      return card;
    }
    return new CardModel();
  }

  flipCard(cardId: number) {
    const card = this.models.find((card) => card.cardId === cardId);
    if (card) {
      if (this.canPlayEffects) {
        this.swipeEffect.play();
      }
      card.flipped = !card.flipped;
    }
  }

  checkGameWon() {
    let validation = this.models.every((card) => card.hasMatch === true);
    if (validation) {
      this.onGameCompleted.emit();
    }
  }

  findCardById(id: string): any {
    return this.models.findIndex((card) => card.id.includes(id));
  }

  getGrid() {
    let windWidth = window.innerWidth;
    let grid = new GridObject();

    if (windWidth < 500) {
      grid.isMobile = true;
      grid = this.calculateGrid(grid);
      return {
        gridTemplateColumns: `repeat(${grid.columns}, ${this.cardSize}px)`,
        gridTemplateRows: `repeat(${grid.rows}, ${this.cardSize}px)`,
      };
    }

    grid.isMobile = false;
    grid = this.calculateGrid(grid);
    return {
      gridTemplateColumns: `repeat(${grid.columns}, ${this.cardSize}px)`,
      gridTemplateRows: `repeat(${grid.rows}, ${this.cardSize}px)`,
    };
  }

  calculateCardSize(initialSize: number) {
    const calc = this.models.length / 4;
    const windWidth = window.innerWidth - 40;
    const windHeight = window.innerHeight - 200;
    const sizeToValidate = initialSize + 10;
    const isMobile = window.innerWidth < 500;

    if (calc >= 5) {
      if (isMobile && calc * sizeToValidate >= windHeight) {
        this.calculateCardSize(initialSize - 1);
      } else if (isMobile && 4 * sizeToValidate >= windWidth) {
        this.calculateCardSize(initialSize - 1);
      } else if (!isMobile && calc * sizeToValidate >= windWidth) {
        this.calculateCardSize(initialSize - 1);
      } else {
        this.cardSize = initialSize;
      }
      return;
    }
    this.cardSize = isMobile ? 80 : 110;
  }

  calculateGrid(grid: GridObject): GridObject {
    if (grid.isMobile) {
      if (this.cards.length / 4 >= 5) {
        grid.columns = 4;
        grid.rows = this.cards.length / 4;
        return grid;
      }
    } else if (this.cards.length / 4 >= 5) {
      grid.columns = this.cards.length / 4;
      grid.rows = 4;
      return grid;
    }

    return grid;
  }
}

export class GridObject {
  rows: number = 4;
  columns: number = 4;
  isMobile: boolean = false;
}
