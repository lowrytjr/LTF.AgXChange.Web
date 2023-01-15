import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {
  private _authenticateService: AuthenticateService;
  private _router: Router;

  _isLoggedIn: boolean;

  constructor(private authenticateService: AuthenticateService, router: Router){
    this._authenticateService = authenticateService;
    this._router = router;

    // Get current logged in state
    this._isLoggedIn = this._authenticateService.IsLoggedIn();

    // Subscribe to future login/logout events
    this._authenticateService.GetIsLoggedIn().subscribe((isLoggedIn) => { 
      this._isLoggedIn = isLoggedIn;
    });
  };
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this._isLoggedIn) {
      return true;
    } 
    else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
