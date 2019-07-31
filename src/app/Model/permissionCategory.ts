import { Entity } from "./entity";
import { RolePermission } from "./rolePermissions";

export class PermissionCategory extends Entity {
  id: number;
  title: string;
  description: string;
  permissions: RolePermission[];
  isChecked = false;
  isHided = true;
}