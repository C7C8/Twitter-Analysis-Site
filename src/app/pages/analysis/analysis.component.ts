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

  hourlyActivity: number[] = [];
  hourlySentiment: number[] = [];

  weeklyActivity: number[] = [];
  weeklySentiment: number[] = [];

  hourlyDailyActivity: number[][] = [];
  hourlyDailySentiment: number[][] = [];

  constructor(private route: ActivatedRoute, private dserv: DataService) {
    this.route.params.subscribe( params => this.username = params.username);
  }

  async ngOnInit() {
    this.dserv.getAlltimeStats(this.username).then(data => this.alltime = data);
    await this.dserv.getTweets(this.username).then(data => this.tweets = data);

    const hourlyData: UserData[] = await this.dserv.getHourlyStats(this.username);
    let max = 0;
    for (const data of hourlyData) {
      this.hourlyActivity.push(data.total);
      if (data.total > max) {
        max = data.total;
      }

      this.hourlySentiment.push(data.avg_sent);
    }

    // Normalize activity levels
    if (max > 0) {
      this.hourlyActivity = this.hourlyActivity.map(x => x / max);
    }

    const weeklyData = await this.dserv.getWeeklyStats(this.username);
    max = 0;
    for (const data of weeklyData) {
      this.weeklyActivity.push(data.total);
      if (data.total > max) {
        max = data.total;
      }

      this.weeklySentiment.push(data.avg_sent);
    }

    // Normalize activity levels
    if (max > 0) {
      this.weeklyActivity = this.weeklyActivity.map(x => x / max);
    }

    // @ts-ignore
    const hourlyDailyData: UserData[][] = await this.dserv.getHourlyDailyStats(this.username);
    max = 0;
    for (const dataArray of hourlyDailyData) {
      const activityRet = [], sentimentRet = [];
      for (const data of dataArray) {
        activityRet.push(data.total);
        if (data.total > max) {
          max = data.total;
        }

        sentimentRet.push(data.avg_sent);
      }

      this.hourlyDailyActivity.push(activityRet);
      this.hourlyDailySentiment.push(sentimentRet);
    }

    // Normalize activity levels
    if (max > 0) {
      this.hourlyDailyActivity = this.hourlyDailySentiment.map(x => x.map(y => y / max));
    }
  }
}
