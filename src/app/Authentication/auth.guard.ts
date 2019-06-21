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
        let sds = next.data.permission.roles.find(x => x == this.userSession.getUserRoleId());
        if (next.data.permission && typeof next.data.permission.roles.find(x => x == this.userSession.getUserRoleId()) === 'undefined') {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
  }
}
