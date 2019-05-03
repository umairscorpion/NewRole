import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/Services/users.service';
import { RoleService } from 'src/app/Services/role.service';
import { UserSummary } from 'src/app/Model/user';
import { RoleSummary } from 'src/app/Model/userRoles';
@Component({
    templateUrl: 'permissions.component.html'
})
export class PermissionsComponent implements OnInit {
    users = Array<UserSummary>();
    rowsUsers = Array<UserSummary>();
    selectedUsers: UserSummary[] = [];
    selectedAllUsers = false;

    roles = Array<RoleSummary>();
    rowsRoles = Array<RoleSummary>();
    selectedRoles: UserSummary[] = [];
    selectedAllRoles = false;

    constructor(
        private userService: UsersService,
        private roleService: RoleService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers() {
        this.userService.getSummaryList().subscribe((users: UserSummary[]) => {
            this.users = users;
            this.rowsUsers = [...users];
        });
    }

    loadRoles() {
        this.roleService.getSummaryList().subscribe((roles: RoleSummary[]) => {
            this.roles = roles;
            this.rowsRoles = [...roles];
        });
    }

    onUserSelect({ selected }) {
        this.selectedUsers.splice(0, this.selectedUsers.length);
        this.selectedUsers.push(...selected);
        if (this.selectedUsers.length === this.rowsUsers.length) {
            this.selectedAllUsers = true;
        } else {
            this.selectedAllUsers = false;
        }
    }

    onRoleSelect({ selected }) {
        this.selectedRoles.splice(0, this.selectedRoles.length);
        this.selectedRoles.push(...selected);
        if (this.selectedUsers.length === this.rowsRoles.length) {
            this.selectedAllRoles = true;
        } else {
            this.selectedAllRoles = false;
        }
    }
}