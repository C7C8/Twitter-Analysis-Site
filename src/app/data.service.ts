import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, APIUserListResponse } from './types';
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
}
