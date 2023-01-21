import { EventEmitter, Injectable, Output } from '@angular/core';
import { AuthenticateRequestRequest } from '../../models/account/authenticateRequestRequest.model'
import { AuthenticateRequestResponse } from '../../models/account/authenticateRequestResponse.model'
import { AuthenticateRequest } from '../../models/account/authenticateRequest.model'
import {AuthenticateResponse } from '../../models/account/authenticateResponse.model'
import { map, Observable, tap } from 'rxjs';
import { HttpService } from '../http/http.service';
import { AccountVerifyRequest } from 'src/app/models/account/accountVerifyRequest.model';
import { ApiResponse } from 'src/app/models/common/apiResponse.model';
import { UserSession } from 'src/app/models/account/userSession.model';
import { UserProfile } from 'src/app/models/account/userProfile.model';
import { LogoutRequest } from 'src/app/models/account/logoutRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  _userSession: UserSession;
  
  @Output() LoggedIn: EventEmitter<any> = new EventEmitter<any>();
  @Output() UserSession: EventEmitter<any> = new EventEmitter<any>();

  /** ============================================================ */
  /** Constructor */
  constructor(private http: HttpService) {
    this._userSession = this.GetUserSession();
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
        if (data.isLoggedIn)
        {
          let userProfile = new UserProfile(data.emailAddress, data.screenName);
          let userSession = new UserSession(userProfile, data.isLoggedIn);
          this._userSession = this.PutUserSession(userSession);
          this.LoggedIn.emit(true);
          this.UserSession.emit(this._userSession);
        }
      }),
      map(val => { return val})
    );
  }

  /** ============================================================ */
  /** Log Out */
  logOut(logoutRequest: LogoutRequest): Observable<ApiResponse> {
    return this.http.Post<ApiResponse>(logoutRequest, "authenticate/logout").pipe(
      tap(data => {
        this._userSession = this.ClearUserSession();
        this.LoggedIn.emit(true);
        this.UserSession.emit(this._userSession);
      }),
      map(val => { return val})
    );
  }

  /** ============================================================ */
  /** Get user session */
  GetUserSession() : UserSession {
    let isLoggedIn = localStorage.getItem('isLoggedIn') == "true";
    let emailAddress = sessionStorage.getItem('emailAddress') ?? undefined;
    let screenName = sessionStorage.getItem('screenName') ?? undefined;
    let userProfile = new UserProfile(emailAddress, screenName);

    return new UserSession(userProfile, isLoggedIn)
  }

  /** ============================================================ */
  /** Put user session */
  PutUserSession(userSession: UserSession) : UserSession {
    localStorage.setItem('isLoggedIn', userSession.isLoggedIn ? "true" : "false");
    sessionStorage.setItem("emailAddress", userSession.userProfile.emailAddress);
    sessionStorage.setItem("screenName", userSession.userProfile.screenName);

    return this.GetUserSession();
  }

  /** ============================================================ */
  /** Clear user session */
  ClearUserSession() : UserSession {
    let userProfile = new UserProfile("", "");
    let userSession = new UserSession(userProfile, false);
    this.PutUserSession(userSession);

    return userSession;
  }

  /** ============================================================ */
  /** Subscribe to user login/logout events */
  GetIsLoggedIn() { 
    return this.LoggedIn; 
  }

  EmitUserSession() {
    return this.UserSession;
  }
}
