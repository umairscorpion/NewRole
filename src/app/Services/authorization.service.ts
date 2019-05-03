import { Injectable } from '@angular/core';
import { UserSession } from './userSession.service';

@Injectable()
export class AuthorizationService {
  permissions: Array<string>;
  constructor(
    private userSessionService: UserSession,
  ) { }
  hasPermission(permissionTitle: string) {
    if (
      this.userSessionService.UserClaim.permissions &&
      this.userSessionService.UserClaim.permissions.find(permission => {
        return (
          (permission.permissionTitle === permissionTitle && permission.isChecked) != null
        );
      })
    ) {
      return true;
    }
    return false;
  }

  // initializePermissions() {
  //   return new Promise((resolve, reject) => {
  //     // Call API to retrieve the list of actions this user is permitted to perform.
  //     // In this case, the method returns a Promise, but it could have been implemented as an Observable
  //     this.rolePermissionService
  //       .userPermissions(this.userInfoService.currentUser.id)
  //       .subscribe(permissions => {
  //         this.permissions = permissions;
  //         resolve();
  //       });
  //   });
  // }
}
