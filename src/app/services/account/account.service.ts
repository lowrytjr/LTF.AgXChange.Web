import { EventEmitter, Injectable, Output } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpService } from '../http/http.service';
import { AccountVerifyRequest } from 'src/app/models/account/accountVerifyRequest.model';
import { ApiResponse } from 'src/app/models/common/apiResponse.model';
import { AccountRequestResponse } from 'src/app/models/account/accountRequestResponse.model';
import { AccountRequestRequest } from 'src/app/models/account/accountRequestRequest.model';
import { AccountCreateRequest } from 'src/app/models/account/accountCreateRequest.model';
import { AccountCreateResponse } from 'src/app/models/account/accountCreateResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  /** ============================================================ */
  /** Constructor */
  constructor(private http: HttpService) { }

  /** ============================================================ */
  /** POST: Request Account */
  requestAccount(accountRequestRequest: AccountRequestRequest): Observable<AccountRequestResponse> {
    return this.http.Post<AccountRequestResponse>(accountRequestRequest, "account/request").pipe(
      tap(data => {
        
      }),
      map(val => { return val})
    );
  } 

  /** ============================================================ */
  /** POST: Create Account */
  createAccount(accountCreateRequest: AccountCreateRequest): Observable<AccountCreateResponse> {
    return this.http.Post<AccountCreateResponse>(accountCreateRequest, "account/create").pipe(
      tap(data => {
        
      }),
      map(val => { return val})
    );
  }

  /** ============================================================ */
  /** POST: Verify Account */
  verifyAccount(accountVerifyRequest: AccountVerifyRequest): Observable<ApiResponse> {
    return this.http.Post<ApiResponse>(accountVerifyRequest, "account/verify").pipe(
      tap(data => {
        
      }),
      map(val => { return val})
    );
  } 
}
