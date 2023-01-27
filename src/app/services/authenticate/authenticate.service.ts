import { EventEmitter, Injectable, Output } from '@angular/core';
import { AuthenticateRequestRequest } from '../../models/account/authenticateRequestRequest.model'
import { AuthenticateRequestResponse } from '../../models/account/authenticateRequestResponse.model'
import { AuthenticateRequest } from '../../models/account/authenticateRequest.model'
import {AuthenticateResponse } from '../../models/account/authenticateResponse.model'
import { map, Observable, tap } from 'rxjs';
import { HttpService } from '../http/http.service';
import { ApiResponse } from 'src/app/models/common/apiResponse.model';
import { UserSession } from 'src/app/models/account/userSession.model';
import { UserProfile } from 'src/app/models/account/userProfile.model';
import { LogoutRequest } from 'src/app/models/account/logoutRequest.model';
import { AccountRetrieveRequest } from 'src/app/models/account/accountRetrieveRequest.model';
import { AccountRetrieveResponse } from 'src/app/models/account/accountRetrieveResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  _userSession: UserSession;
  
  @Output() UserSession: EventEmitter<any> = new EventEmitter<any>();

  /** ============================================================ */
  /** Constructor */
  constructor(private http: HttpService) {
    this._userSession = this.GetUserSession();
    if (this._userSession.userProfile.accountId && (!this._userSession.userProfile.emailAddress || !this._userSession.userProfile.screenName)) {
      this.retrieveAccount(new AccountRetrieveRequest(this._userSession.userProfile.accountId)).subscribe(
        accountResponse => {
          if (accountResponse.statusCode == 200) {
            let userProfile = new UserProfile(accountResponse.accountId, accountResponse.emailAddress, accountResponse.screenName, accountResponse.emailVerified);
            let userSession = new UserSession(userProfile);
            this._userSession = this.PutUserSession(userSession);
          }
          else {
            this._userSession = this.ClearUserSession();
          }

          // Emit the session change
          this.UserSession.emit(this._userSession);
        } );
    }
  }

  /** ============================================================ */
  /** POST: Get Authenticate Token */
  retrieveAccount(accountRequest: AccountRetrieveRequest): Observable<AccountRetrieveResponse> {
    return this.http.Post<AccountRetrieveResponse>(accountRequest, "account/retrieve");
  }

  /** ============================================================ */
  /** POST: Get Authenticate Token */
  authenticateRequest(authenticateRequestRequest: AuthenticateRequestRequest): Observable<AuthenticateRequestResponse> {
    return this.http.Post<AuthenticateRequestResponse>(authenticateRequestRequest, "authenticate/request");
  }

  /** ============================================================ */
  /** POST: Authenticate Password */
  authenticate(authenticateRequest: AuthenticateRequest): Observable<AuthenticateResponse> {
    return this.http.Post<AuthenticateResponse>(authenticateRequest, "authenticate/login").pipe(
      tap(data => {
        if (data.accountId)
        {
          let userProfile = new UserProfile(data.accountId, data.emailAddress, data.screenName, data.emailVerified);
          let userSession = new UserSession(userProfile);
          this._userSession = this.PutUserSession(userSession);
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
        this.UserSession.emit(this._userSession);
      }),
      map(val => { return val})
    );
  }

  /** ============================================================ */
  /** Get user session */
  GetUserSession() : UserSession {
    let accountId = localStorage.getItem('accountId') ?? undefined;
    let emailAddress = sessionStorage.getItem('emailAddress') ?? undefined;
    let screenName = sessionStorage.getItem('screenName') ?? undefined;
    let emailVerified = sessionStorage.getItem('emailVerified') ?? undefined;
    let userProfile = new UserProfile(accountId, emailAddress, screenName, (emailVerified == "true") ? true : false);

    return new UserSession(userProfile)
  }

  /** ============================================================ */
  /** Put user session */
  PutUserSession(userSession: UserSession) : UserSession {
    this.SetLocalStorageItem("accountId", userSession.userProfile.accountId);
    this.SetSessionStorageItem("emailAddress", userSession.userProfile.emailAddress);
    this.SetSessionStorageItem("screenName", userSession.userProfile.screenName);
    this.SetSessionStorageItem("emailVerified", userSession.userProfile.emailVerified ? "true" : "false");
    
    return this.GetUserSession();
  }

  /** ============================================================ */
  /** Clear user session */
  ClearUserSession() : UserSession {
    let userProfile = new UserProfile(undefined, undefined, undefined, false);
    let userSession = new UserSession(userProfile);
    this.PutUserSession(userSession);

    return userSession;
  }

  /** ============================================================ */
  /** Emit user session to subscribers */
  EmitUserSession() {
    return this.UserSession;
  }

  /** ============================================================ */
  /** Set a local storage item */
  SetLocalStorageItem(itemName: string, itemValue: string | undefined) {
    if (itemValue) {
      localStorage.setItem(itemName, itemValue);
    }
    else {
      localStorage.removeItem(itemName);
    }
  }

  /** ============================================================ */
  /** Set a session storage item */
  SetSessionStorageItem(itemName: string, itemValue: string | undefined) {
    if (itemValue) {
      sessionStorage.setItem(itemName, itemValue);
    }
    else {
      sessionStorage.removeItem(itemName);
    }
  }
}
