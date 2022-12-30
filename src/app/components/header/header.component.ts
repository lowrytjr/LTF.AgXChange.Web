import { Component } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private _authenticateService: AuthenticateService;
  _isLoggedIn: boolean;
  
  /** ============================================================ */
  /** Constructor */
  constructor(
    authenticateService: AuthenticateService
  ) {
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
    this._authenticateService.logOut();
  }
}
