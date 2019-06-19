import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../Services/role.service';
import { UsersService } from '../../../Services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './userEdit.component.html',
  styleUrls: ['./userEdit.component.scss']
})
export class UserEditComponent implements OnInit {
  user: any;
  submitted = false;
  form: FormGroup;
  roles: any;
  userTypes: any;
  msg: any;

  constructor(
    private dialogRef: MatDialogRef<UserEditComponent>,
    private _formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UsersService,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data;
    this.form = this._formBuilder.group({
      id: [''],
      roleId: [0],
      userTypeId: [0],
      userId: [''],
      firstName: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z ]*$')])],
      lastName: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z ]*$')])],
      phoneNumber: ['', [Validators.maxLength(30), Validators.pattern('[-0-9]+')]],
      gender: ['M'],
      email: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
    this.form.validator = this.passwordMatchValidator;
  }

  ngOnInit() {
    this.loadData();
    if (this.user && this.user.userId && this.user.userId.length > 0) {
      this.userService.get(`user/getUserById/${this.user.userId}`).subscribe((data: any) => {
        this.form.patchValue({ ...this.user });
      },
        error => this.msg = <any>error);
    }
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value ===
      frm.controls['confirmPassword'].value
      ? null
      : { mismatch: true };
  }

  loadData() {
    this.userService.get('user/getUserTypes').subscribe(userTypes => { this.userTypes = userTypes; });
    this.roleService.get('roles').subscribe(roles => { this.roles = roles; });
  }

  onSubmit(form) {
    this.submitted = true;
    if (!form.invalid) {
      this.msg = null;
      this.userService.post('user/verify', form.value).subscribe(result => {
        this.dialogRef.close({
          user: form.value
        });
      },
        error => this.msg = <any>error);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
