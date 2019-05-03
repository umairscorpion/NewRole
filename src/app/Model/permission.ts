import { Entity } from "./entity";
import { PermissionCategory } from "./permissionCategory";

export class Permission extends Entity {
  id: number;
  title: string;
  description: string;
  permissionCategoryId: number;
  displayName: string;
  category: PermissionCategory;
  isChecked = false;
}