import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetRequest } from 'src/app/models/account/PasswordResetRequest.model';
import { ErrorState } from 'src/app/models/common/errorState.model';
import { AccountService } from 'src/app/services/account/account.service';
import { AppSettingsService } from 'src/app/services/appSettings/app-settings.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  private _formBuilder: FormBuilder;
  private _accountService: AccountService;
  private _appSettings: AppSettingsService;
  private _renderer: Renderer2;
  private _router: Router;
  private _route: ActivatedRoute;

  _passwordResetToken: string = "";
  _resetPasswordForm: FormGroup;
  _passwordErrorText: string = "";
  _verifyPasswordErrorText: string = "";
  _showPasswordError: boolean = false;
  _showVerifyPasswordError: boolean = false;
  _showLoadingOverlay: boolean = false;
  _disableUserInputs: boolean = false;
  _passwordIsValid: boolean = false;
  _showResetForm: boolean = true;
  _SuccessMessageBox: boolean = false;

  /** ============================================================ */
  /** Constructor */
  constructor(
    formBuilder: FormBuilder, 
    accountService: AccountService,
    renderer: Renderer2,
    router: Router,
    appSettings: AppSettingsService,
    route: ActivatedRoute) {
      // Initialize properties
      this._formBuilder = formBuilder;
      this._accountService = accountService;
      this._appSettings = appSettings;
      this._renderer = renderer;
      this._router = router;
      this._route = route;
      
      // Build the form
      this._resetPasswordForm = this._formBuilder.group({
        password: ['', [Validators.required, Validators.pattern(this._appSettings.passwordValidationPattern)]],
        verifyPassword: ['', [Validators.required]],
      });
  }
  
  /** ============================================================ */
  /** ngOnInit */
  ngOnInit() {
    this._route.queryParams
      .subscribe(params => {
        this._passwordResetToken = params["t"];
        if (!this._passwordResetToken) {
          // Redirect to forgot password page
          this._router.navigateByUrl('/forgot-password');
        }
      }
    );
  }

  /** ============================================================ */
  /** Submit Reset Password Form */
  SubmitResetPassword(): void {
    // Reset the form state  
    this._showPasswordError = false;
    this._showVerifyPasswordError = false;

    // Get the passwords from the form
    let passwordResetRequest = new PasswordResetRequest(this._passwordResetToken, this._resetPasswordForm.value.password!, this._resetPasswordForm.value.verifyPassword!);
    
    // Make sure passwords are valid before submitting
    if (this._resetPasswordForm.get('password')?.errors?.['required']) {
      this._passwordErrorText = "Password is required.";
      this._showPasswordError = true;
    }
    else if (this._resetPasswordForm.get('password')?.errors?.['pattern']) {
      this._passwordErrorText = "Password is invalid.";
      this._showPasswordError = true;
    }
    else if (this._resetPasswordForm.value.password != this._resetPasswordForm.value.verifyPassword){
      this._verifyPasswordErrorText = "Passwords must match.";
      this._showVerifyPasswordError = true;
    }

    // If there is a validation error, set form state and return
    if (this._showPasswordError || this._showVerifyPasswordError) {
      return;
    }

    // Call the account service
    this._accountService.PasswordReset(passwordResetRequest).subscribe(
      passwordResetResponse => {
        if (passwordResetResponse.statusCode == 200) {
          // Show success
          this._SuccessMessageBox = true;
          this._showResetForm = false;
        }
        else {
          // Show error screen
          this._router.navigateByUrl('/error', { state: new ErrorState(passwordResetResponse.statusCode, passwordResetResponse.message, undefined, undefined) });
        }
      }
    );
  }

}
