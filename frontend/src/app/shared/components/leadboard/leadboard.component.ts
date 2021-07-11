import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { ScoreModel } from '../../models/score_model';
import { timer } from 'rxjs';

@Component({
  selector: 'app-leadboard',
  templateUrl: './leadboard.component.html',
  styleUrls: ['./leadboard.component.scss'],
})
export class LeadboardComponent implements OnInit {
  top3: Array<ScoreModel> = [];
  rest: Array<ScoreModel> = [];
  data: Array<ScoreModel> = [];
  isLoading: boolean = true;
  closing: boolean = false;

  @Input()
  gameLevel: number = 1;

  @Output()
  onClickToClose: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Array<ScoreModel>>(
        environment.BACKEND_URL + '/scores/game/' + this.gameLevel
      )
      .subscribe((data) => {
        data.forEach((item, index) => (item.position = index + 1));
        this.data = data;
        if (this.isMobile) this.buildMobileLeadboard(data);
        else this.buildFrontendLeadboard(data);
      });
  }

  buildFrontendLeadboard(data: Array<ScoreModel>): void {
    this.top3 = [data[2], data[0], data[1]];
    this.rest = data.slice(3);
    this.isLoading = false;
  }
  buildMobileLeadboard(data: Array<ScoreModel>): void {
    this.rest = data;
    this.isLoading = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.isMobile) this.buildMobileLeadboard(this.data);
    else this.buildFrontendLeadboard(this.data);
  }
  get isMobile(): boolean {
    return window.innerWidth <= 600;
  }

  onClose() {
    this.closing = true;
    timer(800).subscribe(() => this.onClickToClose.emit());
  }
}
