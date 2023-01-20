import { Component } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

/** ============================================================ */
/** Home Component */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private _authenticateService: AuthenticateService;
  _isLoggedIn: boolean;
  

  /** ============================================================ */
  /** Constructor */
  constructor(authenticateService: AuthenticateService) {
      this._authenticateService = authenticateService;

      // Get current logged in state
      let userSession = this._authenticateService.GetUserSession();
      this._isLoggedIn = userSession.isLoggedIn;

      // Subscribe to future login/logout events
      this._authenticateService.GetIsLoggedIn().subscribe((isLoggedIn) => { 
        this._isLoggedIn = isLoggedIn;
      });
    }
}
