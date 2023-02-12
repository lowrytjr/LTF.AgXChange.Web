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
  
  _isLoggedIn: boolean = false;
  _screenName: string = "";
  _userSession: UserSession | undefined = undefined;
  
  /** ============================================================ */
  /** Constructor */
  constructor(authenticateService: AuthenticateService) {
    // Initialize the services  
    this._authenticateService = authenticateService;

    // Subscribe to future userSession events
    this._authenticateService.EmitUserSession().subscribe((userSession) => { 
      this._userSession = userSession;
      this._isLoggedIn = userSession.isLoggedIn;
      this._screenName = userSession.userProfile.screenName;
      console.log("Home Emit User Session");
    });
  }

  /** ============================================================ */
  /** ngAfterViewInit */
  ngAfterViewInit() {
    // Load data
    console.log("Start Home ngAfterViewInit");

    // Hide full screen loader
    setTimeout(() => {
      var loader = document.getElementById('fullScreenLoader');
      if (loader != null) {
        loader.style.display = 'none';
      }
    }, 5000)
  }
}
