import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionCategory } from '../../../Model/permissionCategory';
import { RolePermissionService } from '../../../Services/rolePermission.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../../../Model/userRoles';
import { UserService } from '../../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  templateUrl: 'role-permissions.component.html',
  styleUrls: ['role-permissions.component.scss']
})
export class RolePermissionsComponent implements OnInit {
  id = 0;
  userId = "";
  role: Role;
  permissions: PermissionCategory[];
  submitted = false;
  form: FormGroup;
  isOpen = true;
  msg: string;
  userTemplate: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rolePermissionService: RolePermissionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group(
      {
        role_Id: [this.id || 0],
        userId: [this.userId || ""],
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$')
          ])
        ],
      }
    );
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.userId = params.userId;
      this.loadPermissions(this.id, this.userId);
    });
    this.LoadUserResources();
    if (this.id > 0) {
      this.form.controls['name'].disable();
    }
  }

  LoadUserResources(): void {
    const resourceTypeId = 2;
    const parentResourceTypeId = -1;
    const adminPortal = 0;
    this.userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
      this.userTemplate = data;
    },
      error => this.msg = <any>error);
  }

  permissionCheckedChanged(permission, $event) {
    permission.isChecked = !permission.isChecked;
  }

  permisionVisibilityChanged(permission) {
    permission.isHided = !permission.isHided;
  }

  loadPermissions(id, userId) {
    if (id) {
      if (userId == "undefined") {
        userId = "-1"
      }
      this.rolePermissionService.rolePermissions(id, userId).subscribe((data: Role) => {
        this.role = data;
        this.permissions = data.permissionsCategories;
        this.form.patchValue(this.role);
      });
    }
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {
      let role = new Role();
      role = formGroup.value;
      role.userId = this.userId;
      if (role.userId == "undefined") {
        role.userId = "-1"
      }
      role.permissionsCategories = this.permissions;
      this.rolePermissionService.updateRolePermissions(role).subscribe(t => {
        this.router.navigate(['/permissions']);
      });
    }
  }
}
