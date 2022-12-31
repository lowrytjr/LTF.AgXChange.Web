import { Component } from '@angular/core';
import { AccountService } from '../../services/account/account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  private _accountService: AccountService;

  constructor(accountService: AccountService) { 
    this._accountService = accountService;
  }
}
