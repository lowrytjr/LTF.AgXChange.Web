import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession } from 'src/app/models/account/userSession.model';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-base-page',
  template: ``,
  styles: []
})
export class BasePageComponent implements OnInit {
  _userSession: UserSession | undefined = undefined;
  _isLoggedIn: boolean = false;
  _screenName: string = "";

  /** ============================================================ */
  /** Constructor */
  constructor(public router: Router, public authenticateService: AuthenticateService) { 
    console.log("BasePage: constructor");
  }

  /** ============================================================ */
  /** NgOnInit */
  ngOnInit(): void {
    console.log("BasePage: ngOnInit");
    // Get the current user session
    this._userSession = this.authenticateService.GetUserSession();

    // Hide the full screen loader, if necessary
    if (!this._userSession.isLoggedIn || (this._userSession.isLoggedIn && this._userSession.isSessionActive)) {
      this.authenticateService.showLoader(false);
    }
  
    // Subscribe to future userSession events
    this.authenticateService.EmitUserSession().subscribe((userSession) => { 
      this._userSession = userSession;
      this._isLoggedIn = userSession.isLoggedIn;
      this._screenName = userSession.userProfile.screenName;

      // Hide the full screen loader, if necessary
      if (!userSession.isLoggedIn || (userSession.isLoggedIn && userSession.isSessionActive)) {
        this.authenticateService.showLoader(false);
      }
      
      console.log("BasePage: Emit User Session");
    });
  }

  /** ============================================================ */
  /** OpenPage */
  openPage(routename: string) {
    this.router.navigateByUrl(`/${routename}`);
  }
}
