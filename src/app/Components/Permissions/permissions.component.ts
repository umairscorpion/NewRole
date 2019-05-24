import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UsersService } from 'src/app/Services/users.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { RoleService } from 'src/app/Services/role.service';
import { UserSummary, User } from 'src/app/Model/user';
import { RoleSummary } from 'src/app/Model/userRoles';
import { UserService } from '../../Service/user.service';
import { UserEditComponent } from '../User/userEdit/userEdit.component';
import { MatDialog } from '@angular/material';
import swal from 'sweetalert2';

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
    selectedRoles: RoleSummary[] = [];
    selectedAllRoles = false;
    isOpen = true;
    msg: string;

    constructor(
        private userService: UsersService,
        private roleService: RoleService,
        private _userService: UserService,
        media: MediaMatcher,
        changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
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

    updateUsers(event) {
        const val = event.target.value.toLowerCase();
        const temp = this.users.filter(function (d) {
            return d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.rowsUsers = temp;
    }

    loadRoles() {
        this.roleService.getSummaryList().subscribe((roles: RoleSummary[]) => {
            this.roles = roles;
            this.rowsRoles = [...roles];
        });
    }

    updateRoles(event) {
        const val = event.target.value.toLowerCase();
        const temp = this.roles.filter(function (d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.rowsRoles = temp;
    }

    LoadUserResources(): void {
        const resourceTypeId = 2;
        const parentResourceTypeId = -1;
        const adminPortal = 0;
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

    addEditUser(user: UserSummary) {
        const dialogRef = this.dialog.open(UserEditComponent, {
            panelClass: 'user-create-dialog',
            data: user || new UserSummary()
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.user) {
                if (result.user.userId && result.user.userId.length > 0) {
                    this.userService.update(result.user).subscribe((data: any) => {
                        this.loadUsers();
                    },
                        error => this.msg = <any>error);
                } else {
                    this.userService.create(result.user).subscribe((data: any) => {
                        this.loadUsers();
                    },
                        error => this.msg = <any>error);
                }
            }
        });
    }

    addUser() {
        const dialogRef = this.dialog.open(UserEditComponent, {
            panelClass: 'user-create-dialog',
            data: new UserSummary()
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.user) {
                if (result.user.userId && result.user.userId.length > 0) {
                    this.userService.update(result.user).subscribe((data: any) => {
                        this.loadUsers();
                    },
                        error => this.msg = <any>error);
                } else {
                    this.userService.create(result.user).subscribe((data: any) => {
                        this.loadUsers();
                    },
                        error => this.msg = <any>error);
                }
            }
        });
    }

    removeUsers() {
        if (this.selectedUsers.length > 0) {
            swal.fire({
                title: 'Delete',
                text:
                    'Are you sure, you want to delete the selected users?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-danger',
                cancelButtonClass: 'btn btn-success',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: false
            }).then(r => {
                if (r.value) {
                    const selectedIds = this.selectedUsers.map((v, k) => {
                        return v.userId;
                    });
                    this.userService.deleteAll(selectedIds).subscribe(t => { this.loadUsers(); });
                }
            });
        }
    }

    removeRoles() {
        if (this.selectedRoles.length > 0) {
            swal.fire({
                title: 'Delete',
                text:
                    'Are you sure, you want to delete the selected roles?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-danger',
                cancelButtonClass: 'btn btn-success',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: false
            }).then(r => {
                if (r.value) {
                    const selectedIds = this.selectedRoles.map((v, k) => {
                        return v.role_Id;
                    });
                    this.roleService.deleteAll(selectedIds).subscribe(t => { this.loadRoles(); });
                }
            });
        }
    }
}