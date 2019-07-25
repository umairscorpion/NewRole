import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DataContext } from '../../../Services/dataContext.service';

@Component({
    templateUrl: 'unsubscribed.component.html',
    styleUrls: ['unsubscribed.component.scss']
})
export class SubscriptionComponent implements OnInit {
    private notifier: NotifierService;
    hide = true;
    msg: string;
    resetPasswordForm: FormGroup;
    email: string;
    activationKey: string;
    subscribed: boolean = false;
    public resetPassAttempt: boolean;

    constructor(
        private fb: FormBuilder,
        private _dataContext: DataContext,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        notifier: NotifierService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.email = params.email;
            if (params.email) {
                this.UnSubscribe(params.email);
            }
        });
    }

    Subscribe() {
        let user = {
            email: this.email,
            isSubscribedEmail: 1
        }
        this._dataContext.post('user/updateSubscription', user).subscribe((data: any) => {
            this.notifier.notify('sucess', 'Subscribed Successfully');
            this.subscribed = false;
        });
    }

    UnSubscribe(email?: string) {
        
        let user = {
            email: email || this.email,
            isSubscribedEmail: 0
        }
        this._dataContext.post('user/updateSubscription', user).subscribe((data: any) => {
            this.notifier.notify('sucess', 'UnSubscribed Successfully');
            this.subscribed = true;
        });
    }
}