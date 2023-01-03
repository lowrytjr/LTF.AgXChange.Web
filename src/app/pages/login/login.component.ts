import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginState } from "../../constants/enums";
import { AuthenticateService } from '../../services/authenticate/authenticate.service';
import { EmailRequest } from '../../models/account/emailRequest.model'
import { AuthenticateRequest } from '../../models/account/authenticateRequest.model';
import { Router } from '@angular/router';
import { ErrorState } from 'src/app/models/common/errorState.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private _formBuilder: FormBuilder;
  private _authenticateService: AuthenticateService;
  private _emailToken: string;
  private _emailPattern: string;

  _loginForm: FormGroup;
  _loginState: LoginState = LoginState.init;
  _loginButtonText: string = "Next";
  _showPassword: boolean = false;
  _showEmailError: boolean = false;
  _showEmailLoader: boolean = false;
  _showPasswordLoader: boolean = false;
  
  /** ============================================================ */
  /** Constructor */
  constructor(formBuilder: FormBuilder, authenticateService: AuthenticateService, private renderer: Renderer2, private router: Router) {
    this._formBuilder = formBuilder;
    this._authenticateService = authenticateService;
    this._emailToken = "";
    this._emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    
    // Build the form
    this._loginForm = this._formBuilder.group({
      userID: ['', [Validators.required, Validators.pattern(this._emailPattern)]],
      password: ''
    });
  }

  /** ============================================================ */
  /**  ngAfterViewInit */
  ngAfterViewInit() {
    // Set focus to the user id
    this.renderer.selectRootElement('#userID').focus();
  }

  /** ============================================================ */
  /** Submit Logon Form */
  SubmitLogon(): void {
    // Check the state of the form
    switch(this._loginState) {
      case LoginState.init:
        // Make sure the email is valid
        if (this._loginForm.get('userID')?.errors?.['pattern']) {
          // Show the invalid email error message
          this._showEmailError = true;
          return;
        }
        else {
          // Hide the email error message and show the loader
          this._showEmailError = false;
          this._showEmailLoader = true;

          // Get the email address from the form
          let emailRequest = new EmailRequest(this._loginForm.value.userID!);

          // Call the account service
          this._authenticateService.authenticateEmailAddress(emailRequest).subscribe(
            emailResponse => {
              if (emailResponse.statusCode == 200) {
                // Show the password box and disable email
                this._emailToken = emailResponse.emailToken!;
                this._showPassword = true;
                this._loginState = LoginState.emailSubmit;
                this._loginForm.controls['userID'].disable();
                
                // Update button and hide loader
                setTimeout(() => {
                  this._loginButtonText = "Submit";
                  this._showEmailLoader = false;
                  this.renderer.selectRootElement('#password').focus();
              }, 150);
              }
              else {
                // Show error screen
                this.router.navigateByUrl('/error', { state: new ErrorState("login", emailResponse.statusCode, emailResponse.message) });
                //{ page:"login", statusCode:emailResponse.statusCode , message:emailResponse.statusCode }
              }
            }
          );
        }
        break;

      case LoginState.emailSubmit:
        // Get the password from the form
        let authenticateRequest = new AuthenticateRequest(this._loginForm.value.password!, this._emailToken!);
        
        // Call the account service
        this._authenticateService.authenticatePassword(authenticateRequest).subscribe(
          authenticateResponse => {
            if (authenticateResponse.statusCode == 200) {
              // Show the home screen
              this.router.navigateByUrl('/');
            }
            else {
              switch(authenticateResponse.statusCode) {
                case 400:
                  // Request is invlaid or expired, so just reload the page
                  window.location.reload();
                  break;

                default:
                  // Show error screen
                  this.router.navigateByUrl('/error', { state: { statusCode:authenticateResponse.statusCode , message:authenticateResponse.message } });
                  break;
              }
            }
          }
        );
        break;
    }
  }
}
