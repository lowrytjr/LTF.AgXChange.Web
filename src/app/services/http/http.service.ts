import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, retry, tap, timer } from 'rxjs';
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
    return this.httpClient.post<T>(`${this._baseURL}/${operation}`, request, { withCredentials: true }).pipe(
      tap(data => {
        let response = <ApiResponse>data;
        
      }),
      retry({ count: 1, delay: this.shouldRetry }),
      catchError(
        this.handleError<T>(operation)
      )
    );
  }

  Get<T>(operation: string, queryParameters: string): Observable<T> {
    return this.httpClient.get<T>(`${this._baseURL}/${operation}?${queryParameters}`).pipe(
      catchError(
        this.handleError<T>(operation)
      )
    );
  }

  GetJSON<T>(operation: string): Observable<T> {
    return this.httpClient.get<T>(operation).pipe(
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
  
  private shouldRetry(error: HttpErrorResponse) {
    // Retry on 418 responses
    if (error.status === 418) {
      console.log("HttpService: Retry");
      return timer(500); 
    }

    throw error;
  }
  
  /** ============================================================ */
  /** Handle Errors */
  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {

      let result = new ApiResponse();

      try {
          result.statusCode = error.error.statusCode;
          result.message = error.error.message;
      }
      catch(e) {
        result.statusCode = 500
        result.message = "unexpected_error"
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}