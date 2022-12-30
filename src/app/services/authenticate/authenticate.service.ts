import { EventEmitter, Injectable, Output } from '@angular/core';
import { EmailRequest } from '../../models/account/emailRequest.model'
import { EmailResponse } from '../../models/account/emailResponse.model'
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
  authenticateEmailAddress(emailRequest: EmailRequest): Observable<EmailResponse> {
    return this.http.Post<EmailResponse>(emailRequest, "authenticate/username");
  }

  /** ============================================================ */
  /** POST: Authenticate Password */
  authenticatePassword(authenticateRequest: AuthenticateRequest): Observable<AuthenticateResponse> {
    return this.http.Post<AuthenticateResponse>(authenticateRequest, "authenticate/password").pipe(
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
