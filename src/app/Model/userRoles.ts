import { Entity } from './entity';
import { RolePermission } from './rolePermissions';
import { PermissionCategory } from './permissionCategory';

export class UserRole extends Entity {
  id: number;
  roleCategory: string;
  title: string;
  isDeleted: boolean;
  orgId: number | null;
  rolePermissions: Array<RolePermission>;
  users: Array<any>;
}

export class Role extends Entity {
  role_Id: number;
  name: string;
  userId: string;
  permissionsCategories: Array<PermissionCategory>;
}
export class RoleSummary extends Entity {
  role_Id: number;
  name: string;
  usersCount: number;
}
