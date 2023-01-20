import { Component } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  private _authenticateService: AuthenticateService;
  _isLoggedIn: boolean;
  
  /** ============================================================ */
  /** Constructor */
  constructor(
    private authenticateService: AuthenticateService
  ) {
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
