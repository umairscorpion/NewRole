import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import 'rxjs/add/operator/do';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    @BlockUI() blockUI: NgBlockUI;
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.blockUI.start('Loading...');
        if (req.headers.get('No-Auth') == "True")
        {
            return next.handle(req.clone())
            .do(
                (succ:any)=> {
                    if(succ.status === 200)
                        {
                            this.blockUI.stop();
                        }
                 },
                err => {
                    this.blockUI.stop();
                    if (err.status === 401)
                        this.router.navigateByUrl('/');
                }
                );
        }
        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken')),
            });
            return next.handle(clonedreq)
                .do(
                (succ:any)=> {
                    if(succ.status === 200)
                        {
                            this.blockUI.stop();
                        }
                 },
                err => {
                    this.blockUI.stop();
                    if (err.status === 401)
                        this.router.navigateByUrl('/');
                }
                );
        }
        else {
            this.router.navigateByUrl('/');
        }
    }
}