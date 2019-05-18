
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UserService } from '../../../Service/user.service';
import { DataContext } from '../../../Services/dataContext.service';
import { UserSession } from '../../../Services/userSession.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../../environments/environment';

@Component({
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {
    private notifier: NotifierService;
    hide = true;
    msg: string;
    forgotPasswordform: FormGroup;
    private formSubmitAttempt: boolean;
    constructor(private fb: FormBuilder, private _userService: UserService,
        private router: Router, private activatedRoute: ActivatedRoute,
        notifier: NotifierService, private _dataContext: DataContext,
        private _userSession: UserSession) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.forgotPasswordform = this.fb.group({
            email: ['', Validators.required]
        });
    }

    onSubmit(formData: any) {
        this.msg = "";
        if (this.forgotPasswordform.valid) {
            this.notifier.notify('error', 'This feature is in progress.')
        }
        this.formSubmitAttempt = true;
    }


    isFieldInvalid(field: string) {
        return (
            (!this.forgotPasswordform.get(field).valid && this.forgotPasswordform.get(field).touched) ||
            (this.forgotPasswordform.get(field).untouched && this.formSubmitAttempt)
        );
    }


}