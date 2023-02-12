import { Component } from '@angular/core';
import { UserSession } from 'src/app/models/account/userSession.model';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  private _authenticateService: AuthenticateService;
  
  _isLoggedIn: boolean = false;
  _screenName: string = "";
  _userSession: UserSession;
  
  /** ============================================================ */
  /** Constructor */
  constructor(
    authenticateService: AuthenticateService
  ) {
      this._authenticateService = authenticateService;

      // Get current USer Session
      this._userSession = this._authenticateService.GetUserSession();

      // Subscribe to future userSession events
      this._authenticateService.EmitUserSession().subscribe((userSession) => { 
        this._userSession = userSession;
        this._isLoggedIn = userSession.isLoggedIn;
        this._screenName = userSession.userProfile.screenName;
      });
  }
}
