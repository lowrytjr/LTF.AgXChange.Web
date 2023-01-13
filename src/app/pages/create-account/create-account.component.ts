import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateAccountState } from 'src/app/constants/enums';
import { AppSettingsService } from 'src/app/services/appSettings/app-settings.service';
import { AccountService } from '../../services/account/account.service';
import { AccountRequestRequest } from 'src/app/models/account/accountRequestRequest.model';
import { AccountCreateRequest } from 'src/app/models/account/accountCreateRequest.model';
import { ErrorState } from 'src/app/models/common/errorState.model';
import { Router } from '@angular/router';
import { RegistrationState } from 'src/app/models/common/registrationState';

/** ============================================================ */
/** CreateAccount Component */
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  private _formBuilder: FormBuilder;
  private _accountService: AccountService;
  private _appSettings: AppSettingsService;
  private _renderer: Renderer2;
  private _router: Router;
  private _accountRequestToken: string;

  _createAccountForm: FormGroup;
  _createAccountState: CreateAccountState = CreateAccountState.collectUserInformation;
  _emailErrorText: string = "";
  _screenNameErrorText: string = "";
  _passwordErrorText: string = "";
  _verifyPasswordErrorText: string = "";
  _loginButtonText: string = "Next";
  _showEmailError: boolean = false;
  _showScreenNameError: boolean = false;
  _showPassword: boolean = false;
  _showPasswordError: boolean = false;
  _showVerifyPasswordError: boolean = false;
  _showLoadingOverlay: boolean = false;
  _disableUserInputs: boolean = false;
  _passwordIsValid: boolean = false;

  /** ============================================================ */
  /** Constructor */
  constructor(
    formBuilder: FormBuilder, 
    accountService: AccountService,
    renderer: Renderer2,
    router: Router,
    appSettings: AppSettingsService) {
      // Initialize properties
      this._formBuilder = formBuilder;
      this._accountService = accountService;
      this._renderer = renderer;
      this._router = router;
      this._appSettings = appSettings;
      this._accountRequestToken = "";
      
      // Build the form
      this._createAccountForm = this._formBuilder.group({
        userID: ['', [Validators.required, Validators.pattern(this._appSettings.emailValidationPattern)]],
        screenName: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.pattern(this._appSettings.passwordValidationPattern)]],
        verifyPassword: ['', [Validators.required]],
      });
  }

  /** ============================================================ */
  /**  ngAfterViewInit */
  ngAfterViewInit() {
    // Set the form state
    this.SetFormState(CreateAccountState.collectUserInformation, false, false, false, false);
    this._createAccountState = CreateAccountState.collectUserInformation;
  }

  /** ============================================================ */
  /** Submit Registration Form */
  SubmitRegistration(): void {
    // Check the state of the form
    switch(this._createAccountState) {
      // Submit email and screen name
      case CreateAccountState.collectUserInformation:
        // Reset form state
        this.SetFormState(CreateAccountState.collectUserInformation, false, false, false, false);

        // Get the email address and screen name from the form
        let accountRequestRequest = new AccountRequestRequest(this._createAccountForm.value.userID!, this._createAccountForm.value.screenName!);

        // Make sure email and screen name are valid before submitting
        if (this._createAccountForm.get('userID')?.errors?.['required']) {
          this._emailErrorText = "Email address is required";
          this._showEmailError = true;
        }
        if (this._createAccountForm.get('userID')?.errors?.['pattern']) {
          this._emailErrorText = "Email address is invalid";
          this._showEmailError = true;
        }
        if (this._createAccountForm.get('screenName')?.errors?.['required']) {
          this._screenNameErrorText = "Screen name is required.";
          this._showScreenNameError = true;
        }

        // If there is a validation error, set form state and return
        if (this._showEmailError || this._showScreenNameError) {
          this.SetFormState(CreateAccountState.collectUserInformation, this._showEmailError, this._showScreenNameError, false, false);
          return;
        }
        
        // Set the form state
        this.SetFormState(CreateAccountState.submitUserInformation, false, false, false, false);

        // Call the account service
        this._accountService.requestAccount(accountRequestRequest).subscribe(
          accountRequestResponse => {
            if (accountRequestResponse.statusCode == 200) {
              // Get the email token and show the password box
              this._accountRequestToken = accountRequestResponse.accountRequestToken!;
              this._showPassword = true;
              this._createAccountState = CreateAccountState.collectPasswordInformation;
              
              // Set the form state
              setTimeout(() => {
                this.SetFormState(CreateAccountState.collectPasswordInformation, false, false, false, false);
            }, 150);
            }
            else {
              if (accountRequestResponse.statusCode == 400 && accountRequestResponse.message == "screen_name_exists") {
                // Screen name is already taken
                this._screenNameErrorText = "Screen name is already taken.";
                this._showScreenNameError = true;
                setTimeout(() => {
                  this.SetFormState(CreateAccountState.collectUserInformation, false, this._showScreenNameError, false, false);
                  this._renderer.selectRootElement('#screenName').focus();
                }, 150);
              }
              else {
                // Show error screen
                this._router.navigateByUrl('/error', { state: new ErrorState("login", accountRequestResponse.statusCode, accountRequestResponse.message) });
              }
            }
          }
        );
        break;

      // Submit Passwords
      case CreateAccountState.collectPasswordInformation:
        // Reset the form state
        this.SetFormState(CreateAccountState.collectPasswordInformation, false, false, false, false);

        // Get the passwords from the form
        let accountCreateRequest = new AccountCreateRequest(this._accountRequestToken, this._createAccountForm.value.password!, this._createAccountForm.value.verifyPassword!);
        
        // Make sure passwords are valid before submitting
        if (this._createAccountForm.get('password')?.errors?.['required']) {
          this._passwordErrorText = "Password is required.";
          this._showPasswordError = true;
        }
        else if (this._createAccountForm.get('password')?.errors?.['pattern']) {
          this._passwordErrorText = "Password is invalid.";
          this._showPasswordError = true;
        }
        else if (this._createAccountForm.value.password != this._createAccountForm.value.verifyPassword){
          this._verifyPasswordErrorText = "Passwords must match.";
          this._showVerifyPasswordError = true;
        }

        // If there is a validation error, set form state and return
        if (this._showPasswordError || this._showVerifyPasswordError) {
          this.SetFormState(CreateAccountState.collectPasswordInformation, false, false, this._showPasswordError, this._showVerifyPasswordError);
          return;
        }

        // Set the form state
        this.SetFormState(CreateAccountState.submitPasswordInformation, false, false, false, false);

        // Call the account service
        this._accountService.createAccount(accountCreateRequest).subscribe(
          accountCreateResponse => {
            if (accountCreateResponse.statusCode == 200) {
              // Redirect to the login page
              this._router.navigateByUrl('/login', { state: new RegistrationState(true, accountCreateResponse.emailAddress!, accountCreateResponse.screenName!) });
            }
            else {
              if (accountCreateResponse.statusCode == 400 && accountCreateResponse.message == "screen_name_exists") {
                // Screen name is already taken
                this._screenNameErrorText = "Screen name is already taken.";
                this._showScreenNameError = true;
                setTimeout(() => {
                  this.SetFormState(CreateAccountState.collectUserInformation, false, this._showScreenNameError, false, false);
                  this._renderer.selectRootElement('#screenName').focus();
                }, 150);
              }
              else if (accountCreateResponse.statusCode == 400 && accountCreateResponse.message == "password_not_strong") {
                this._passwordErrorText = "Password is not strong enough.";
                this._showPasswordError = true;
                setTimeout(() => {
                  this.SetFormState(CreateAccountState.collectPasswordInformation, false, false, this._showPasswordError, false);
                  this._renderer.selectRootElement('#password').focus();
                }, 150);
              }
              else {
                // Show error screen
                this._router.navigateByUrl('/error', { state: new ErrorState("login", accountCreateResponse.statusCode, accountCreateResponse.message) });
              }
            }
          }
        );
        break;

      default:
        // Form is being submitted, so do nothing
        break;
    }
  }
  
  /** ============================================================ */
  /** Set Form State */
  SetFormState(state: CreateAccountState, showEmailError: boolean, showScreenNameError: boolean, showPasswordError: boolean, showVerifyPasswordError: boolean): void {
    this._showEmailError = showEmailError;
    this._showScreenNameError = showScreenNameError;  
    this._showPasswordError = showPasswordError;
    this._showVerifyPasswordError = showVerifyPasswordError;

    switch(state) {
      case CreateAccountState.collectUserInformation:
        this._loginButtonText = "Next";
        this._renderer.selectRootElement('#userID').focus();
        this._showLoadingOverlay = false;
        this._disableUserInputs = false;
        this._createAccountForm.controls['userID'].enable();
        this._createAccountForm.controls['screenName'].enable();
        break;

      case CreateAccountState.submitUserInformation:
        this._showLoadingOverlay = true;
        this._disableUserInputs = true;
        this._createAccountForm.controls['userID'].disable();
        this._createAccountForm.controls['screenName'].disable();
        break;

      case CreateAccountState.collectPasswordInformation:
        this._loginButtonText = "Submit";
        this._renderer.selectRootElement('#password').focus();
        this._showLoadingOverlay = false;
        
        break;

      case CreateAccountState.submitPasswordInformation:
        this._showLoadingOverlay = true;
        
        break;
    }
  }

  /** ============================================================ */
  /** Reset the Form */
  ResetForm(): void {
    this._createAccountState = CreateAccountState.collectUserInformation;
    this.SetFormState(CreateAccountState.collectUserInformation, false, false, false, false);
    this._createAccountForm.controls['userID'].setValue("");
    this._createAccountForm.controls['screenName'].setValue("");
    this._createAccountForm.controls['password'].setValue("");
    this._createAccountForm.controls['verifyPassword'].setValue("");
  }
}


