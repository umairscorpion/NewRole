import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserSession } from '../Services/userSession.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router, private userSession : UserSession){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      if (localStorage.getItem('userToken') != null) {
        if (this.userSession.getUserRoleId() === 4 && next.data.rol)
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
  }
}
