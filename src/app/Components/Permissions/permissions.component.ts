import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UsersService } from 'src/app/Services/users.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { RoleService } from 'src/app/Services/role.service';
import { UserSummary } from 'src/app/Model/user';
import { RoleSummary } from 'src/app/Model/userRoles';
import { UserService } from '../../Service/user.service';
@Component({
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
    userTemplate: any;
    users = Array<UserSummary>();
    rowsUsers = Array<UserSummary>();
    selectedUsers: UserSummary[] = [];
    selectedAllUsers = false;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    roles = Array<RoleSummary>();
    rowsRoles = Array<RoleSummary>();
    selectedRoles: UserSummary[] = [];
    selectedAllRoles = false;
    isOpen = true;
    msg: string;

    constructor(
        private userService: UsersService,
        private roleService: RoleService,
        private _userService : UserService,
        media: MediaMatcher,
        changeDetectorRef: ChangeDetectorRef 
    ) { 
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.loadUsers();
        this.loadRoles();
        this.LoadUserResources();
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

    LoadUserResources(): void {
        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        let adminPortal = 0;
        this._userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
            this.userTemplate = data;
        },
            error => this.msg = <any>error);
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