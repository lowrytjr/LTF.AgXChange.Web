import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutRequest } from 'src/app/models/account/logoutRequest.model';
import { UserSession } from 'src/app/models/account/userSession.model';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private _authenticateService: AuthenticateService;
  private _router: Router;

  _isLoggedIn: boolean = false;
  _screenName: string = "";
  _userSession: UserSession | undefined = undefined;
  
  /** ============================================================ */
  /** Constructor */
  constructor(
    authenticateService: AuthenticateService,
    router: Router
  ) {
      // Initialize the services
      this._router = router;
      this._authenticateService = authenticateService;
    
      // Subscribe to userSession events
      this._authenticateService.EmitUserSession().subscribe((userSession) => { 
        this._userSession = userSession;
        this._isLoggedIn = userSession.isLoggedIn;
        this._screenName = userSession.userProfile.screenName;
      });
  }

  /** ============================================================ */
  /* Close the menu */
  CloseMenu(submenu: string | undefined = undefined) {
    var element = <HTMLInputElement> document.getElementById("mainMenu");
    element.className = "topnav";

    if (submenu != undefined) {
      this.CloseSubMenu(submenu);
    }
  }

  /** ============================================================ */
  /* Toggle Top Menu */
  ToggleMenu() {
    var element = <HTMLInputElement> document.getElementById("mainMenu");
    if (element.className === "topnav") {
      element.className += " responsive";
    } else {
      element.className = "topnav";
    }
  }

  /** ============================================================ */
  /* Toggle SubMenu */
  ToggleSubMenu(elementID: string) {
    var element = <HTMLInputElement> document.getElementById(elementID);
    if (element.className === "dropdown-content") {
      element.className += " dropdown-open";
    } else {
      element.className = "dropdown-content";
    }
  }

  /** ============================================================ */
  /* Close SubMenu */
  CloseSubMenu(elementID: string) {
    var element = <HTMLInputElement> document.getElementById(elementID);
    element.className = "dropdown-content";
  }

  /** ============================================================ */
  /** Log out */
  LogOut() {
    let userSession = this._authenticateService.GetUserSession();
    let logoutRequest = new LogoutRequest(userSession.userProfile.emailAddress);

    this.CloseMenu();

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
