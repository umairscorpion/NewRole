import { Entity } from './entity';

export class RolePermission extends Entity {
  id: number;
  roleId: number;
  permissionId: number;
  title: string;
  displayName: string;
  description: string;
  isChecked: boolean;
}
