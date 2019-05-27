import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RestService } from './restService';
import { RolePermission } from '../Model/rolePermissions';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { environment } from '../../environments/environment';
import { PermissionCategory } from '../Model/permissionCategory';
import { Entity } from '../Model/entity';
import { Role } from '../Model/userRoles';

@Injectable()
export class RolePermissionService extends RestService<RolePermission> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  getId(model: RolePermission): number {
    return 1;
  }

  getUri(): string {
    return `${environment.apiUrl}permissions`;
  }

  rolePermissions(roleId: number): Observable<Role> {
    return this.httpClient
      .get<Role>(
        `${this.getUri()}/role/${roleId}`
      )
      .pipe(
        catchError(this.errorHandler.handleError),
        map((response: Role) => {
          return response;
        })
      );
  }

  updateRolePermissions(model: Role): Observable<Role> {
    return this.httpClient
      .post<Role>(
        `${this.getUri()}/bulk/update`, model
      )
      .pipe(
        catchError(this.errorHandler.handleError),
        map((response: Role) => {
          return response;
        })
      );
  }


  getInstance(): Entity {
    return new RolePermission();
  }
}
