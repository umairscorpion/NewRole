import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';

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
    }

    Subscribe() {

    }

    UnSubscribe() {
        
    }
}