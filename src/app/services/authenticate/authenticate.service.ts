import { EventEmitter, Injectable, Output } from '@angular/core';
import { AuthenticateRequestRequest } from '../../models/account/authenticateRequestRequest.model'
import { AuthenticateRequestResponse } from '../../models/account/authenticateRequestResponse.model'
import { AuthenticateRequest } from '../../models/account/authenticateRequest.model'
import {AuthenticateResponse } from '../../models/account/authenticateResponse.model'
import { map, Observable, tap } from 'rxjs';
import { HttpService } from '../http/http.service';
import { AccountVerifyRequest } from 'src/app/models/account/accountVerifyRequest.model';
import { ApiResponse } from 'src/app/models/common/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  _isLoggedIn : boolean = false;
  @Output() LoggedIn: EventEmitter<any> = new EventEmitter<any>();

  /** ============================================================ */
  /** Constructor */
  constructor(private http: HttpService) {
    this._isLoggedIn = localStorage.getItem('isLoggedIn') == "true";
  }

  /** ============================================================ */
  /** POST: Get Email Token */
  authenticateRequest(authenticateRequestRequest: AuthenticateRequestRequest): Observable<AuthenticateRequestResponse> {
    return this.http.Post<AuthenticateRequestResponse>(authenticateRequestRequest, "authenticate/request");
  }

  /** ============================================================ */
  /** POST: Authenticate Password */
  authenticate(authenticateRequest: AuthenticateRequest): Observable<AuthenticateResponse> {
    return this.http.Post<AuthenticateResponse>(authenticateRequest, "authenticate/login").pipe(
      tap(data => {
        if (data.jwt)
        {
          localStorage.setItem('isLoggedIn', "true");
          localStorage.setItem('id_token', data.jwt);
          this._isLoggedIn = true;
          this.LoggedIn.emit(this._isLoggedIn);
        }
      }),
      map(val => { return val})
    );
  }

  /** ============================================================ */
  /** Log Out */
  logOut() {
    localStorage.setItem('isLoggedIn', "false");
    localStorage.setItem('id_token', "");
    this._isLoggedIn = false;
    this.LoggedIn.emit(this._isLoggedIn);
  }

  /** ============================================================ */
  /** Return user logged in status */
  IsLoggedIn() : boolean {
    return this._isLoggedIn;
  }

  /** ============================================================ */
  /** Subscribe to user login/logout events */
  GetIsLoggedIn() { 
    return this.LoggedIn; 
  }
}
