import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  APIUserListResponse,
  APIAnalyzeResponse,
  APIAllTimeAnalysis,
  APIGeneratedTweetsResponse,
  UserData,
  APIPointAnalysis, APIHourlyDailyAnalysis
} from './types';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  async getUserList(): Promise<APIUserListResponse> {
    return this.http.get<APIUserListResponse>(environment.urls.userList)
      .pipe(catchError((error: HttpErrorResponse): Observable<APIUserListResponse> => of(error.error)))
      .toPromise();
  }

  async anaylzeUser(username: string): Promise<APIAnalyzeResponse> {
    return this.http.put<APIAnalyzeResponse>(environment.urls.userAdd + '?username=' + encodeURI(username), null)
      .pipe(catchError((error: HttpErrorResponse): Observable<APIAnalyzeResponse> => of(error.error)))
      .toPromise();
  }

  async getAlltimeStats(username: string): Promise<UserData> {
    const url = environment.urls.analyze + '?username=' + encodeURI(username) + '&analysis=alltime';
    const response = await this.http.get<APIAllTimeAnalysis>(url)
      .pipe(catchError((error: HttpErrorResponse): Observable<APIAllTimeAnalysis> => of(error.error)))
      .toPromise();

    if (response.status !== 'error') {
      return response.data;
    } else {
      this.snackbar.open(response.message, '', {duration: 2500});
      return null;
    }
  }

  async getHourlyStats(username: string): Promise<UserData[]> {
    const url = environment.urls.analyze + '?username=' + encodeURI(username) + '&analysis=hourly';
    const response = await this.http.get<APIPointAnalysis>(url)
      .pipe(catchError((error: HttpErrorResponse): Observable<APIPointAnalysis> => of(error.error)))
      .toPromise();

    if (response.status !== 'error') {
      return response.data;
    } else {
      this.snackbar.open(response.message, '', {duration: 2500});
      return [];
    }
  }

  async getWeeklyStats(username: string): Promise<UserData[]> {
    const url = environment.urls.analyze + '?username=' + encodeURI(username) + '&analysis=weekly';
    const response = await this.http.get<APIPointAnalysis>(url)
      .pipe(catchError((error: HttpErrorResponse): Observable<APIPointAnalysis> => of(error.error)))
      .toPromise();

    if (response.status !== 'error') {
      return response.data;
    } else {
      return [];
    }
  }

  async getHourlyDailyStats(username: string): Promise<UserData[][]> {
    const url = environment.urls.analyze + '?username=' + encodeURI(username) + '&analysis=hourly_daily';
    const response = await this.http.get<APIHourlyDailyAnalysis>(url)
      .pipe(catchError((error: HttpErrorResponse): Observable<APIHourlyDailyAnalysis> => of(error.error)))
      .toPromise();

    if (response.status !== 'error') {
      return response.data;
    } else {
      return [];
    }
  }

  async getTweets(username: string, count: number = 10): Promise<string[]> {
    const url = environment.urls.generate + '?username=' + encodeURI(username) + '&count=' + count;
    const response = await this.http.get<APIGeneratedTweetsResponse>(url)
      .pipe(catchError((error: HttpErrorResponse): Observable<APIGeneratedTweetsResponse> => of(error.error)))
      .toPromise();

    if (response.status !== 'error') {
      return response.tweets;
    } else {
      return [];
    }
  }
}
