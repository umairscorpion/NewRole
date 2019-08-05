import { Directive, ElementRef, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { AuthorizationService } from '../../Services/authorization.service';

@Directive({
    selector: '[hideTabIfUnauthorized]'

})
export class HideTabIfUnauthorizedDirective implements AfterViewInit {
    @Input('hideTabIfUnauthorized')
    permission: string;
    hide: Boolean = true;

    constructor(
        private el: ElementRef,
        private cdr: ChangeDetectorRef,
        private authorizationService: AuthorizationService
    ) { }

    ngAfterViewInit() {
        if (!this.authorizationService.hasPermission(this.permission)) {
            this.hide = false;
          }
        this.cdr.detectChanges();
    }
}