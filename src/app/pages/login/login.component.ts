import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginState } from "../../constants/enums";
import { AuthenticateService } from '../../services/authenticate/authenticate.service';
import { AuthenticateRequestRequest } from '../../models/account/authenticateRequestRequest.model'
import { AuthenticateRequest } from '../../models/account/authenticateRequest.model';
import { Router } from '@angular/router';
import { ErrorState } from 'src/app/models/common/errorState.model';
import { AppSettingsService } from 'src/app/services/appSettings/app-settings.service';

/** ============================================================ */
/** Login Component */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private _formBuilder: FormBuilder;
  private _authenticateService: AuthenticateService;
  private _emailToken: string;
  private _appSettings: AppSettingsService;
  private _renderer: Renderer2;
  private _router: Router

  _loginForm: FormGroup;
  _loginState: LoginState = LoginState.init;
  _emailErrorText: string = ""
  _passwordErrorText: string = ""
  _loginButtonText: string = "";
  _showPassword: boolean = false;
  _showEmailError: boolean = false;
  _showPasswordError: boolean = false;
  _showEmailLoader: boolean = false;
  _showPasswordLoader: boolean = false;
  
  /** ============================================================ */
  /** Constructor */
  constructor(
    formBuilder: FormBuilder, 
    authenticateService: AuthenticateService, 
    renderer: Renderer2, 
    router: Router, 
    appSettings: AppSettingsService) {
      // Initialize properties
      this._formBuilder = formBuilder;
      this._authenticateService = authenticateService;
      this._appSettings = appSettings;
      this._router = router;
      this._renderer = renderer;
      this._loginButtonText = "Next";
      this._emailToken = "";
    
      // Build the form
      this._loginForm = this._formBuilder.group({
        userID: ['', [Validators.required, Validators.pattern(this._appSettings.emailValidationPattern)]],
        password: ['', [Validators.required]]
      });
  }

  /** ============================================================ */
  /**  ngAfterViewInit */
  ngAfterViewInit() {
    // Set focus to the user id
    this._renderer.selectRootElement('#userID').focus();
  }

  /** ============================================================ */
  /** Submit Logon Form */
  SubmitLogon(): void {
    // Check the state of the form
    switch(this._loginState) {
      case LoginState.init:
        // Make sure the email is valid
        if (this._loginForm.get('userID')?.errors?.['required']) {
          this._emailErrorText = "Email address is required";
          this._showEmailError = true;
          return;
        }
        else if (this._loginForm.get('userID')?.errors?.['pattern']) {
          this._emailErrorText = "Email address is invalid";
          this._showEmailError = true;
          return;
        }
        else {
          // Hide the email error message, disable the email box and show the loader
          this._showEmailError = false;
          this._showEmailLoader = true;
          this._loginForm.controls['userID'].disable();

          // Get the email address from the form
          let authenticateRequestRequest = new AuthenticateRequestRequest(this._loginForm.value.userID!);

          // Call the authenticate service
          this._authenticateService.authenticateRequest(authenticateRequestRequest).subscribe(
            authenticateRequestResponse => {
              if (authenticateRequestResponse.statusCode == 200) {
                // Get the email token and show the password box
                this._emailToken = authenticateRequestResponse.emailToken!;
                this._showPassword = true;
                this._loginState = LoginState.emailSubmit;
                
                // Update button and hide loader
                setTimeout(() => {
                  this._loginButtonText = "Submit";
                  this._showEmailLoader = false;
                  this._renderer.selectRootElement('#password').focus();
              }, 150);
              }
              else {
                // Show error screen
                this._router.navigateByUrl('/error', { state: new ErrorState("login", authenticateRequestResponse.statusCode, authenticateRequestResponse.message) });
              }
            }
          );
        }
        break;

      case LoginState.emailSubmit:
        // Make sure a password was provided
        if (this._loginForm.get('password')?.errors?.['required']) {
          // Show the invalid password error message
          this._passwordErrorText = "Password is required.";
          this._showPasswordError = true;
          return;
        }

        // Hide the password error, disable the password box and show the loader
        this._showPasswordError = false;
        this._showPasswordLoader = true;
        this._loginForm.controls['password'].disable();

        // Get the password from the form
        let authenticateRequest = new AuthenticateRequest(this._loginForm.value.password!, this._emailToken!);
        
        // Call the authenticate service
        this._authenticateService.authenticate(authenticateRequest).subscribe(
          authenticateResponse => {
            // Hide the loader
            this._showPasswordLoader = false;

            if (authenticateResponse.statusCode == 200) {
              // Show the home screen
              this._router.navigateByUrl('/');
            }
            else {
              switch(authenticateResponse.statusCode) {
                case 400:
                  // Request is invlaid or expired, so just reload the page
                  window.location.reload();
                  break;

                default:
                  // Show error screen
                  this._router.navigateByUrl('/error', { state: { statusCode:authenticateResponse.statusCode , message:authenticateResponse.message } });
                  break;
              }
            }
          }
        );
        break;
    }
  }
}
