import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, retry, tap } from 'rxjs';
import { ApiResponse } from '../../models/common/apiResponse.model';
import { AppSettingsService } from '../appSettings/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private _baseURL: string;

  /** ============================================================ */
  /** Constructor */
  constructor(private httpClient: HttpClient, private appSettings: AppSettingsService) { 
    this._baseURL = appSettings.baseApiUrl;
  }

  Post<T>(request: any, operation: string): Observable<T> {
    return this.httpClient.post<T>(`${this._baseURL}/${operation}`, request, { headers: this.getHeaders()}).pipe(
      tap(data => {
        let response = <ApiResponse>data;
        
      }),
      retry(1),
      catchError(
        this.handleError<T>(operation)
      )
    );
  }

  Get<T>(operation: string, queryParameters: string): Observable<T> {
    return this.httpClient.get<T>(`${this._baseURL}/${operation}?${queryParameters}`, { headers: this.getHeaders()}).pipe(
      catchError(
        this.handleError<T>(operation)
      )
    );
  }

  GetJSON<T>(operation: string): Observable<T> {
    return this.httpClient.get<T>(operation, { headers: this.getHeaders()}).pipe(
      catchError(
        this.handleError<T>(operation)
      )
    );
  }

  /** ============================================================ */
  /** Get Headers */
  private getHeaders(): HttpHeaders {
    let bearerToken = localStorage.getItem('id_token') ?? "not_authorized";

    return new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    });
  }
  
  /** ============================================================ */
  /** Handle Errors */
  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {

      let result = new ApiResponse

      try {
        if (error.error instanceof ErrorEvent) {
          result.statusCode = error.error.status
          result.message = `Error: ${error.error.message}`;
        } else {
          result.statusCode = error.status
          result.message = `Error: ${error.message}`;
        }
      }
      catch(e) {
        result.statusCode = 400
        result.message = "Unknown error"
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}