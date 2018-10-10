import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, APIUserListResponse, APIAnalyzeResponse, APIAllTimeAnalysis } from './types';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

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

  async getAlltimeStats(username: string): Promise<APIAllTimeAnalysis> {
    return this.http.get<APIAllTimeAnalysis>(environment.urls.analyze + '?username=' + encodeURI(username))
      .pipe(catchError((error: HttpErrorResponse): Observable<APIAllTimeAnalysis> => of(error.error)))
      .toPromise();
  }
}
