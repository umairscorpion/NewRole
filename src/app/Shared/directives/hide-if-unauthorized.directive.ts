import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthorizationService } from 'src/app/Services/authorization.service';

@Directive({
  selector: '[hideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {
  @Input('hideIfUnauthorized')
  permission: string;
  constructor(
    private el: ElementRef,
    private authorizationService: AuthorizationService
  ) { }
  ngOnInit() {
    if (!this.authorizationService.hasPermission(this.permission)) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
