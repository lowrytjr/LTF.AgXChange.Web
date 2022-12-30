import { Component } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

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
      this._isLoggedIn = this._authenticateService.IsLoggedIn();

      // Subscribe to future login/logout events
      this._authenticateService.GetIsLoggedIn().subscribe((isLoggedIn) => { 
        this._isLoggedIn = isLoggedIn;
      });
    }
}
