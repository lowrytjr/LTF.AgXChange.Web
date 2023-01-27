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

  constructor(private authenticateService: AuthenticateService, router: Router){
    this._authenticateService = authenticateService;
    this._router = router;
  };
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let userSession = this._authenticateService.GetUserSession();

    if (userSession.userProfile.accountId) {
      return true;
    } 
    else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
