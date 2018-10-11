import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { Mat1DVal, Mat2DVal, User, UserData } from '../../types';
import { validate } from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'twittalyzer-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],

})
export class AnalysisComponent implements OnInit {

  username = '';
  tweets: string[] = [];
  alltime: UserData = undefined;

  hourlyActivity: Mat1DVal[] = [];
  hourlySentiment: Mat1DVal[] = [];

  weeklyActivity: Mat1DVal[] = [];
  weeklySentiment: Mat1DVal[] = [];

  hourlyDailyActivity: Mat2DVal[] = [];
  hourlyDailySentiment: Mat2DVal[] = [];

  constructor(private route: ActivatedRoute, private dserv: DataService) {
    this.route.params.subscribe( params => this.username = params.username);
  }

  async ngOnInit() {
    this.dserv.getAlltimeStats(this.username).then(data => this.alltime = data);
    await this.dserv.getTweets(this.username).then(data => this.tweets = data);

    const hourlyData: UserData[] = await this.dserv.getHourlyStats(this.username);
    let max = 0;
    for (const i of Object.keys(hourlyData)) {
      this.hourlyActivity.push({val: hourlyData[i].total, x: i });
      if (hourlyData[i].total > max) {
        max = hourlyData[i].total;
      }

      this.hourlySentiment.push({val: hourlyData[i].avg_sent, x: i});
    }

    // Normalize activity levels
    if (max > 0) {
      this.hourlyActivity = this.hourlyActivity.map(i => ({val: (i.val || 0) / max, x: i.x}));


    const weeklyData = await this.dserv.getWeeklyStats(this.username);
    max = 0;
    for (const i of Object.keys(weeklyData)) {
      this.weeklyActivity.push({val: weeklyData[i].total, x: i});
      if (weeklyData[i].total > max) {
        max = weeklyData[i].total;
      }

      this.weeklySentiment.push({val: weeklyData[i].avg_sent, x: i});
    }

    // Normalize activity levels
    if (max > 0) {
      this.weeklyActivity = this.weeklyActivity.map(x => ({val: (x.val || 0) / max, x: x.x}));
    }

    // @ts-ignore
    const hourlyDailyData: UserData[][] = await this.dserv.getHourlyDailyStats(this.username);
    max = 0;
    for (const x of Object.keys(hourlyDailyData)) {
      for (const y of Object.keys(hourlyDailyData[x])) {
        this.hourlyDailyActivity.push({val: hourlyDailyData[x][y].total, x: x, y: y});
        if (hourlyDailyData[x][y].total > max) {
          max = hourlyDailyData[x][y].total;
        }
        this.hourlyDailySentiment.push({val: hourlyDailyData[x][y].avg_sent, x: x, y: y});
      }
    }

    // Normalize activity levels
    if (max > 0) {
      this.hourlyDailyActivity = this.hourlyDailyActivity.map(o => ({val: o.val / max, x: o.x, y: o.y}));
      this.hourlySentiment = this.hourlySentiment;
    }
  }
}
