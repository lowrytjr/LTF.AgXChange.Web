import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountVerifyRequest } from 'src/app/models/account/accountVerifyRequest.model';
import { AccountService } from '../../services/account/account.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})

export class VerifyAccountComponent {
  private _accountService: AccountService;
  private emailVerifyToken: string = "";
  _message = "";

  constructor(private route: ActivatedRoute, accountService: AccountService) { 
    this._accountService = accountService;
  }

  ngOnInit() {
    // Get the verification token
    this.route.queryParams
      .subscribe(params => {
        this.emailVerifyToken = params["t"];
      }
    );

    // Create an account verification request
    let accountVerifyRequest = new AccountVerifyRequest(this.emailVerifyToken);

    // Make sure we have a token
    if (this.emailVerifyToken == null || this.emailVerifyToken.length == 0)
    {
      this._message = "This request appears to be invalid.";
    }
    else {
      // Verify the account
      this._accountService.verifyAccount(accountVerifyRequest).subscribe(
        apiResponse => {
            // Check to see if the account was verified
            switch(apiResponse.message) { 
              case "email_changed": { 
                this._message = "The email for this account has changed.";
                break; 
              } 
              case "email_verified": { 
                this._message = "Your email has been verified!";
                break; 
              } 
              case "invalid_request": { 
                this._message = "This request appears to be invalid.";
                break; 
              }
              default: { 
                this._message = "Oops. An unexpected error has occurred.";
                break; 
              } 
          }
        }
      );  
    }
  }
}
