import { Component } from '@angular/core';
import { UserSession } from 'src/app/models/account/userSession.model';
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
  
  _userSession: UserSession;
  
  /** ============================================================ */
  /** Constructor */
  constructor(authenticateService: AuthenticateService) {
      this._authenticateService = authenticateService;

      // Get current USer Session
      this._userSession = this._authenticateService.GetUserSession();

      // Subscribe to future userSession events
      this._authenticateService.EmitUserSession().subscribe((userSession) => { 
        this._userSession = userSession;
      });
    }
}
