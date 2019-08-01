import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthorizationService } from '../../Services/authorization.service';

@Directive({
  selector: '[hideIfUnauthorized]',
  exportAs:'hideIfUnauthorized',
})
export class HideIfUnauthorizedDirective implements OnInit {
  @Input('hideIfUnauthorized')
  permission: string;
  hide:boolean = true;
  constructor(
    private el: ElementRef,
    private authorizationService: AuthorizationService
  ) { }
  ngOnInit() {
    if (!this.authorizationService.hasPermission(this.permission)) {
      this.el.nativeElement.style.display = 'none';
      this.hide = false;
    }
  }
}
