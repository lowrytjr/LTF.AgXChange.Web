import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutRequest } from 'src/app/models/account/logoutRequest.model';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private _authenticateService: AuthenticateService;
  private _router: Router;

  _isLoggedIn: boolean;
  
  /** ============================================================ */
  /** Constructor */
  constructor(
    authenticateService: AuthenticateService,
    router: Router
  ) {
      this._router = router;
      this._authenticateService = authenticateService;

      // Get current logged in state
      this._isLoggedIn = this._authenticateService.IsLoggedIn();

      // Subscribe to future login/logout events
      this._authenticateService.GetIsLoggedIn().subscribe((isLoggedIn) => { 
        this._isLoggedIn = isLoggedIn;
      });
  }

  /** ============================================================ */
  /** Log out */
  LogOut() {
    let userSession = this._authenticateService.GetUserSession();
    let logoutRequest = new LogoutRequest(userSession.userProfile.emailAddress);

    this._authenticateService.logOut(logoutRequest).subscribe(
      logoutResponse => {
        if (logoutResponse.statusCode != 200) {
          // Make sure the session is cleared
          this._authenticateService.ClearUserSession();
        }
      }
    );
  }
}
