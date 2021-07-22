import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { ScoreModel } from 'src/app/shared/models/score_model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { CardModel } from './../../shared/models/card-model';
import { PhotoModel } from './../../shared/models/photo-model';
import { ResponseModel } from './../../shared/models/response-model';
import { UserModel } from './../../shared/models/user-model';
import { PlayingCardsComponent } from './components/playing-cards/playing-cards.component';
import { TimerComponent } from './components/timer/timer.component';

enum GameLevel {
  EASY = 6,
  MEDIUM = 8,
  HARD = 12,
  PROGRESSIVE,
}

enum GameStatus {
  LOADING,
  MENU,
  STARTED,
  OVER,
  WON,
  BETWEN_ROUNDS,
  MODE_MENU,
}

enum NavigationStatus {
  MAIN_MENU,
  MENU_MODE,
  GAME,
}

class ProgressiveModel {
  round: number = 1;
  lastMaxItens: number = 2;
  points: number = 0;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  gameLevel: number = 1;
  models: Array<CardModel> = [];
  user!: UserModel;
  isLeadboardExpanded: boolean = false;
  scores: Array<ScoreModel> = [];
  soundPlaying: boolean = true;
  @ViewChild('timer')
  timer!: TimerComponent;
  gameStatus: GameStatus = GameStatus.MENU;
  @ViewChild('cards')
  cards?: PlayingCardsComponent;
  data: Array<PhotoModel> = [];
  progressiveModel: ProgressiveModel = new ProgressiveModel();
  canPlayAudio: boolean = true;
  actualPage: number = -1;
  hasReachedMaxCards: boolean = false;
  showLeadboard: boolean = false;
  navigationStatus: NavigationStatus = NavigationStatus.MAIN_MENU;

  constructor(private http: HttpClient, private authService: AuthService) {
    authService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }
  ngOnInit(): void {
    this.loadData(8).then(() => {
      this.gameStatus = GameStatus.MENU;
    });
  }

  buildLeadboard() {
    this.http
      .get<Array<ScoreModel>>(
        environment.BACKEND_URL + '/scores/game/' + this.gameLevel
      )

      .subscribe((data) => {
        this.scores = data;
      });
  }

  async loadData(nextMaxCards: number) {
    this.gameStatus = GameStatus.LOADING;

    if (nextMaxCards > this.data.length) {
      this.actualPage++;
    } else {
      this.mountData(this.data, nextMaxCards);
      return;
    }
    let response = await this.getData();

    this.data.push(...response.DATA);
    this.mountData(this.data, nextMaxCards);
    this.hasReachedMaxCards = response.DATA.length == 0;
    return timer(500).subscribe(() => Promise.resolve(true));
  }

  async getData() {
    return await this.http
      .get<ResponseModel>(
        environment.BACKEND_URL + '/photos' + '?page=' + this.actualPage
      )
      .toPromise();
  }

  getMaxItems() {
    if (this.gameLevel == 1) {
      return GameLevel.EASY;
    } else if (this.gameLevel == 2) {
      return GameLevel.MEDIUM;
    } else if (this.gameLevel == 3) {
      return GameLevel.HARD;
    } else {
      return this.handleInfinite();
    }
  }

  handleInfinite() {
    this.progressiveModel.lastMaxItens += 2;
    return this.progressiveModel.lastMaxItens;
  }

  mountData(photos: Array<PhotoModel>, maxItens: number) {
    let count = 0;

    let models: Array<CardModel> = [];

    photos.forEach((item) => {
      if (count == maxItens) {
        return;
      }
      let model = new CardModel();
      model.cardId = Math.random();
      model.id = item._id;
      model.frontUrl = 'data:image/png;base64,' + item.base64;
      models.push(model);
      count++;
    });
    let copyArray: Array<CardModel> = models.map((model) => {
      let card = new CardModel();
      card.cardId = card.cardId + Math.random();
      card.id = model.id;
      card.frontUrl = model.frontUrl;
      return card;
    });
    models = [...models, ...copyArray];
    this.shuffleFisherYates(models);
    this.models = models;
  }

  shuffleFisherYates(array: Array<CardModel>) {
    let i = array.length;
    while (i--) {
      const ri = Math.floor(Math.random() * (i + 1));
      [array[i], array[ri]] = [array[ri], array[i]];
    }
    return array;
  }
  async startGame() {
    this.gameStatus = GameStatus.LOADING;
    this.loadData(this.getMaxItems()).then((result) => {
      const timing = this.models.length * 135;

      this.models.forEach((model) => {
        model.flipped = false;
        model.hasMatch = false;
      });
      this.gameStatus = GameStatus.STARTED;
      this.navigationStatus = NavigationStatus.GAME;
      timer(500).subscribe(() => {
        this.cards?.startAnimation();
        timer(timing * 2).subscribe(() => {
          if (this.gameLevel == 4) {
            const bonusTime = this.progressiveModel.lastMaxItens / 15;
            this.timer?.start(new Date().getTime() + (1.3 + bonusTime) * 60000);
          } else {
            this.timer?.start(new Date().getTime() + 1.3 * 60000);
          }
        });
      });
    });
  }

  async onTimerCompleted() {
    this.cards?.stack();
    if (this.gameLevel == 4) {
      this.user.points = this.toDecimalPlaces(this.progressiveModel.points);
      this.createOrUpdateScores(
        await this.checkExistentScore(this.progressiveModel.points)
      );
      this.progressiveModel = new ProgressiveModel();
    }
    timer(this.models.length * 150).subscribe(
      () => (this.gameStatus = GameStatus.OVER)
    );
  }

  async onGameCompleted() {
    this.timer?.stop();
    let userPoints = this.toDecimalPlaces(
      this.gameLevel * 20 * this.timer.getTimeLeft() * 0.2
    );
    if (this.gameLevel == 4) {
      this.progressiveModel.points += this.toDecimalPlaces(
        userPoints * this.progressiveModel.lastMaxItens * 0.15
      );

      this.handleProgressiveGame();
      return;
    }
    const new_score = await this.checkExistentScore(userPoints);
    this.cards?.stack();
    this.user.points = this.toDecimalPlaces(userPoints);
    this.createOrUpdateScores(new_score);

    timer(this.models.length * 120).subscribe(
      () => (this.gameStatus = GameStatus.WON)
    );
  }

  toDecimalPlaces(result: number): number {
    return Number(result.toFixed(2));
  }

  createOrUpdateScores(score: ScoreModel) {
    this.http
      .post<ScoreModel>(environment.BACKEND_URL + '/scores', score)
      .subscribe(() => this.buildLeadboard());
  }
  async checkExistentScore(points: number) {
    let newScore: ScoreModel = {
      userId: this.user._id,
      score: points,
      gameType: this.gameLevel,
    };
    let oldScore: ScoreModel = await this.http
      .post<ScoreModel>(environment.BACKEND_URL + '/score', newScore)
      .toPromise();
    if (oldScore) {
      newScore._id = oldScore._id;
    }

    return newScore;
  }
  showMainMenu() {
    this.gameStatus = GameStatus.MENU;
    this.progressiveModel = new ProgressiveModel();
  }

  async handleProgressiveGame() {
    this.user.points = this.toDecimalPlaces(this.progressiveModel.points);
    this.createOrUpdateScores(
      await this.checkExistentScore(this.progressiveModel.points)
    );
    if (this.hasReachedMaxCards) {
      this.gameStatus = GameStatus.WON;
      return;
    }
    this.cards?.stack();
    const timming = this.models.length * 120;
    timer(timming).subscribe(
      () => (this.gameStatus = GameStatus.BETWEN_ROUNDS)
    );
    timer(timming * 2.1).subscribe(() => this.startGame());
  }

  onGameEndMessage() {
    if (this.gameLevel == 4 && GameStatus.OVER == this.gameStatus)
      return 'Game Over ';

    return 'You Won';
  }

  onSelectDifficulty(event: number) {
    this.gameLevel = event;
    this.gameStatus = GameStatus.MODE_MENU;
    this.navigationStatus = NavigationStatus.MENU_MODE;
  }

  onClickToNavigateBack() {
    if (this.navigationStatus == NavigationStatus.MENU_MODE) {
      this.navigationStatus = NavigationStatus.MAIN_MENU;
      this.gameStatus = GameStatus.MENU;
    } else if (this.navigationStatus == NavigationStatus.GAME) {
      this.navigationStatus = NavigationStatus.MENU_MODE;
      this.gameStatus = GameStatus.MODE_MENU;
    }
  }
}
