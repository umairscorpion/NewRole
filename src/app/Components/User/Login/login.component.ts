
import { Component, OnInit, ViewChild, ViewContainerRef, NgZone } from '@angular/core';
import { UserService } from '../../../Service/user.service';
import { DataContext } from '../../../Services/dataContext.service';
import { UserSession } from '../../../Services/userSession.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../../../Shared/global';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import {
    AuthService,
    GoogleLoginProvider
} from 'angular-6-social-login';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {
    JobId = 0;
    Date = new Date();
    private notifier: NotifierService;
    hide = true;
    msg: string;
    loginFrm: FormGroup;
    private formSubmitAttempt: boolean;
    constructor(private socialAuthService: AuthService, private ngZone: NgZone,
        private fb: FormBuilder, private _userService: UserService, private router: Router, private activatedRoute: ActivatedRoute,
        notifier: NotifierService, private _dataContext: DataContext, private _userSession: UserSession) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.loginFrm = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.pa && params.email && params.job) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userClaims');
                this.JobId = params.job;
                let model = {
                    userName: params.email,
                    password: params.pa
                }
                this.loginFrm.setValue(model);
                this.onSubmit(this.loginFrm);

            }
        })
    }

    changeLang(lang: string) {

        if (lang === 'es') {
            localStorage.setItem('locale', 'es');
            location.reload();
        }

        if (lang === 'en') {
            localStorage.setItem('locale', 'en');
            location.reload();
        }
    }

    onSubmit(formData: any) {
        this.msg = "";
        if (this.loginFrm.valid) {
            this._userService.userAuthentication(Global.authenticationApiUrl, formData.value).subscribe((data: any) => {
                localStorage.setItem('userToken', data.token);
                this.GetUserClaims();
                // let promise = Promise.resolve(this.GetUserClaims());
                // promise.then((val) => this.router.navigate(['/home']
                // ).then(() => {
                //     this.notifier.notify( 'success', 'Successfully Login!' );
                // }));
            },
                (err: HttpErrorResponse) => {
                    this.notifier.notify('error', err.statusText);
                });
        }
        this.formSubmitAttempt = true;
    }
    // Login with Google
    public loginWithGoogle() {
        let socialPlatformProvider;
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        this.socialAuthService.signIn(socialPlatformProvider).then(res =>
            this.signInSuccessWithGoogle(res), err => this.signInErrorWithGoogle(err));
    }

    isFieldInvalid(field: string) {
        return (
            (!this.loginFrm.get(field).valid && this.loginFrm.get(field).touched) ||
            (this.loginFrm.get(field).untouched && this.formSubmitAttempt)
        );
    }

    GetUserClaims(): void {
        this._userService.getUserClaims().subscribe((data: any) => {
            localStorage.setItem('userClaims', JSON.stringify(data));
            this._userSession.SetUserSession();
            if (data.roleId == 4 && this.activatedRoute.snapshot.params) {
                if (this.activatedRoute.queryParams && this.JobId > 0) {
                    this.AcceptJob(this.JobId)
                }
                else {
                    this.router.navigate(['/viewjobs']
                    ).then(() => {
                        this.notifier.notify('success', 'Successfully Login!');
                    });
                }
            }
            else
                this.router.navigate(['/home']
                ).then(() => {
                    this.notifier.notify('success', 'Successfully Login!');
                });
        });
    }

    // On successfully login with Google
    private signInSuccessWithGoogle(res: any) {
        this.ngZone.run(() => {
            let object = {
                Email: res.email,
                Id: res.id,
                IdToken: res.idToken,
                Image: res.image,
                Name: res.name,
                Providor: res.provider,
                Token: res.token
            }
            //Currently Just saving its information in Table nothing else .This need to change accordingly.
            this._userService.userAuthenticationFromGoogle('auth/insertExternalUser', object).subscribe((data: any) => {
                this.notifier.notify('success', 'Successfully login with following google Email Id: ' + res.email);
                console.log(res);
            },
                (err: HttpErrorResponse) => {
                    this.notifier.notify('error', err.error.error_description);
                });

        });
    }

    AcceptJob(jobId: number) {
        this.router.navigate(['/viewjobs/myJobs'], { queryParams: { jobId: jobId } });
    }

    // If Error occurred on login with Google
    private signInErrorWithGoogle(err) {
        this.notifier.notify('error', err);
    }
    //SetControlsState(isEnable: boolean) {
    //    isEnable ? this.loginFrm.enable() : this.loginFrm.disable();
    //}
}