import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { UserData } from '../../types';

@Component({
  selector: 'twittalyzer-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],

})
export class AnalysisComponent implements OnInit {

  username = '';
  tweets: string[] = [];
  alltime: UserData = undefined;
  hourly: UserData[] = [];
  weekly: UserData[] = [];
  hourlyDaily: UserData[] = [];

  constructor(private route: ActivatedRoute, private dserv: DataService) {
    this.route.params.subscribe( params => this.username = params.username);
  }

  async ngOnInit() {
    this.alltime = await this.dserv.getAlltimeStats(this.username);
    this.hourly = await this.dserv.getHourlyStats(this.username);
    this.weekly = await this.dserv.getWeeklyStats(this.username);
    // @ts-ignore
    this.hourlyDaily = (await this.dserv.getHourlyDailyStats(this.username)) as UserData[][];
    this.tweets = await this.dserv.getTweets(this.username);
  }
}
