import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSession } from 'src/app/models/account/userSession.model';
import { AppSettingsService } from 'src/app/services/appSettings/app-settings.service';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private _formBuilder: FormBuilder;
  private _authenticateService: AuthenticateService;
  private _appSettings: AppSettingsService;
  private _router: Router;

  _userInfoForm: FormGroup;
  _userSession: UserSession;
  _showEmailError: boolean = false;
  _showScreenNameError: boolean = false;
  _emailErrorText: string = ""
  _screenNameErrorText: string = ""
  _showUserLoadingOverlay: boolean = false;
  _disableUserID: boolean = true;
  _disableScreenName: boolean = true;

  constructor(
    formBuilder: FormBuilder,
    authenticateService: AuthenticateService,
    appSettings: AppSettingsService,
    router: Router) {
      this._appSettings = appSettings;
      this._formBuilder = formBuilder;
      this._router = router;
      this._authenticateService = authenticateService;
      this._userSession = this._authenticateService.GetUserSession();

    // Build the User Info form
    this._userInfoForm = this._formBuilder.group({
      userID: [this._userSession.userProfile.emailAddress, [Validators.required, Validators.pattern(this._appSettings.emailValidationPattern)]],
      screenName: [this._userSession.userProfile.screenName, [Validators.required]]
    });

    // Disable the controls
    this._userInfoForm.controls['userID'].disable();
    this._userInfoForm.controls['screenName'].disable();
  }
}
