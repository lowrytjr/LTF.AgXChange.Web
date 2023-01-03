import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountState } from 'src/app/constants/enums';
import { AccountService } from '../../services/account/account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  private _formBuilder: FormBuilder;
  private _accountService: AccountService;
  _createAccountForm: FormGroup;
  _createAccountState: AccountState = AccountState.init;
  
  constructor(formBuilder: FormBuilder, accountService: AccountService) { 
    this._formBuilder = formBuilder;
    this._accountService = accountService;

    this._createAccountForm = this._formBuilder.group({
      userID: '',
      screenName: '',
      password: '',
      verifyPassword: ''
    });
  }
}
