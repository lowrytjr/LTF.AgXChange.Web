import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession } from 'src/app/models/account/userSession.model';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private _authenticateService: AuthenticateService;
  private _router: Router;

  _userSession: UserSession;

  constructor(
    authenticateService: AuthenticateService,
    router: Router) {
    this._router = router;
    this._authenticateService = authenticateService;
    this._userSession = this._authenticateService.GetUserSession();
  }
}
