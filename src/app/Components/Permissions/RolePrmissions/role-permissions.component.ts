import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermissionCategory } from 'src/app/Model/permissionCategory';
import { RolePermissionService } from 'src/app/Services/rolePermission.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/Model/userRoles';

@Component({
  templateUrl: 'role-permissions.component.html'
})
export class RolePermissionsComponent implements OnInit {
  id = 0;
  role: Role;
  permissions: PermissionCategory[];
  submitted = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private rolePermissionService: RolePermissionService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group(
      {
        role_Id: [this.id || 0],
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
      this.loadPermissions(this.id);
    });
  }

  permissionCheckedChanged(permission, $event) {
    permission.isChecked = !permission.isChecked;
  }

  loadPermissions(id) {
    if (id) {
      this.rolePermissionService.rolePermissions(id).subscribe((data: Role) => {
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
      role.permissionsCategories = this.permissions;
      this.rolePermissionService.updateRolePermissions(role).subscribe(t => {
        console.log(t);
      });
    }
  }
}