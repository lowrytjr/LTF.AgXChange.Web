import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordResetRequestRequest } from 'src/app/models/account/PasswordResetRequestRequest.model';
import { ErrorState } from 'src/app/models/common/errorState.model';
import { AccountService } from 'src/app/services/account/account.service';
import { AppSettingsService } from 'src/app/services/appSettings/app-settings.service';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private _formBuilder: FormBuilder;
  private _accountService: AccountService;
  private _appSettings: AppSettingsService;
  private _renderer: Renderer2;
  private _router: Router;
  
  _forgotPasswordForm: FormGroup;
  _emailErrorText: string = ""
  _showLoadingOverlay: boolean = false;
  _showEmailError: boolean = false;
  _disableUserID: boolean = false;
  _showResetForm: boolean = true;
  _SuccessMessageBox: boolean = false;

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
      this._appSettings = appSettings;
      this._renderer = renderer;
      this._router = router;
      
      // Build the form
      this._forgotPasswordForm = this._formBuilder.group({
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
  /** Submit Password Reset Form */
  SubmitPasswordReset(): void {
    // Make sure the email is valid
    if (this._forgotPasswordForm.get('userID')?.errors?.['required']) {
      this._emailErrorText = "Email address is required";
      this._showEmailError = true;
      return;
    }
    else if (this._forgotPasswordForm.get('userID')?.errors?.['pattern']) {
      this._emailErrorText = "Email address is invalid";
      this._showEmailError = true;
      return;
    }
    else {
      // Get the email address from the form
      let passwordResetRequestRequest = new PasswordResetRequestRequest(this._forgotPasswordForm.value.userID!);

      // Hide the email error message, disable the email box and show the loader
      this._showEmailError = false;
      this._showLoadingOverlay = true;
      this._forgotPasswordForm.controls['userID'].disable();
      this._disableUserID = true;

      // Call the authenticate service
      this._accountService.RequestPasswordReset(passwordResetRequestRequest).subscribe(
        passwordResetRequestResponse => {
          if (passwordResetRequestResponse.statusCode == 200) {
            // Show success
            this._SuccessMessageBox = true;
            this._showResetForm = false;
          }
          else {
            // Show error screen
            this._router.navigateByUrl('/error', { state: new ErrorState(passwordResetRequestResponse.statusCode, passwordResetRequestResponse.message, "/forgot-password", "Return to reset password page") });
          }
        }
      );
    }
  }
}
