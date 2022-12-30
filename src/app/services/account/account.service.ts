import { EventEmitter, Injectable, Output } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpService } from '../http/http.service';
import { AccountVerifyRequest } from 'src/app/models/account/accountVerifyRequest.model';
import { ApiResponse } from 'src/app/models/common/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  /** ============================================================ */
  /** Constructor */
  constructor(private http: HttpService) { }

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
