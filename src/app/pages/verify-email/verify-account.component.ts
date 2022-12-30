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
  emailVerifyToken: string = "";

  constructor(private route: ActivatedRoute, accountService: AccountService) { 
    this._accountService = accountService;
  }

  ngOnInit() {
    // Get the verification token
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.emailVerifyToken = params["t"];
        alert(this.emailVerifyToken);
      }
    );

    let accountVerifyRequest = new AccountVerifyRequest(this.emailVerifyToken);

    // Call the account service
    this._accountService.verifyAccount(accountVerifyRequest).subscribe(
      apiResponse => {
          alert(apiResponse.message);
      }
    );  
  }
}
