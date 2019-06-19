import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
    templateUrl: 'reset-password.component.html',
    styleUrls: ['reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    private notifier: NotifierService;
    hide = true;
    msg: string;
    resetPasswordForm: FormGroup;
    email: string;
    activationKey: string;
    public resetPassAttempt: boolean;

    constructor(
        private fb: FormBuilder,
        private _userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        notifier: NotifierService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)]],
            confirmPassword: ['', Validators.required]
        });
        this.resetPasswordForm.validator = this.passwordMatchValidator;
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.key && params.email) {
                this.activationKey = params.key;
                this.email = params.email;
            }
            else {
                this.router.navigate(['/']);
            }
        });
    }

    passwordMatchValidator(frm: FormGroup) {
        return frm.controls['password'].value ===
            frm.controls['confirmPassword'].value
            ? null
            : { mismatch: true };
    }

    submitResetPassForm(form: FormGroup) {
        if (form.valid) {
            if (this.activationKey && this.email) {
                var model = {
                    password: form.value.confirmPassword,
                    email: this.email,
                    activationCode: this.activationKey
                }
                this._userService.updatePasswordByActivationCode('auth/updatePasswordByActivationCode', model).subscribe(result => {
                    this.notifier.notify('success', 'Password successfully changed');
                    this.router.navigate(['/']);
                },
                    error => this.msg = <any>error);
            }
            else {
                this.notifier.notify('error', 'Activation link not valid.');
                this.router.navigate(['/']);
            }
        }
        this.resetPassAttempt = true;
    }
}