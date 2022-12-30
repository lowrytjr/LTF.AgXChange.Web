import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginState } from "../../constants/enums";
import { AuthenticateService } from '../../services/authenticate/authenticate.service';
import { EmailRequest } from '../../models/account/emailRequest.model'
import { EmailResponse } from '../../models/account/emailResponse.model'
import { AuthenticateRequest } from '../../models/account/authenticateRequest.model';
import { AuthenticateResponse } from '../../models/account/authenticateResponse.model';
import { catchError, Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private _formBuilder: FormBuilder;
  private _authenticateService: AuthenticateService;
  private _emailToken: string;
  _loginForm: FormGroup;
  _loginState: LoginState = LoginState.init;
  _showPassword: boolean = false;
  
  /** ============================================================ */
  /** Constructor */
  constructor(formBuilder: FormBuilder, authenticateService: AuthenticateService) {
    this._formBuilder = formBuilder;
    this._authenticateService = authenticateService;
    this._emailToken = "";

    this._loginForm = this._formBuilder.group({
      userID: '',
      password: ''
    });
  }

  /** ============================================================ */
  /** Submit Logon Form */
  SubmitLogon(): void {
    // Check the state of the form
    switch(this._loginState) {
      case LoginState.init:
        // Get the email address from the form
        let emailRequest = new EmailRequest(this._loginForm.value.userID!);

        // Call the account service
        this._authenticateService.authenticateEmailAddress(emailRequest).subscribe(
          emailResponse => {
              this._emailToken = emailResponse.emailToken!;
              this._showPassword = true;
              this._loginState = LoginState.emailSubmit;
          }
        );  
        break;

      case LoginState.emailSubmit:
        // Get the password from the form
        let authenticateRequest = new AuthenticateRequest(this._loginForm.value.password!, this._emailToken!);
        
        // Call the account service
        this._authenticateService.authenticatePassword(authenticateRequest).subscribe(
          authenticateResponse => {
              this._loginState = LoginState.passwordSubmit;
          }
        );
        break;

      case LoginState.passwordSubmit:
        alert(localStorage.getItem('id_token'))
        break;
    }
  }
}
