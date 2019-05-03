import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthorizationService } from 'src/app/Services/authorization.service';


@Directive({
  selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {
  @Input('disableIfUnauthorized')
  permission: string;
  constructor(
    private el: ElementRef,
    private authorizationService: AuthorizationService
  ) { }
  ngOnInit() {
    if (!this.authorizationService.hasPermission(this.permission)) {
      this.el.nativeElement.disabled = true;
    }
  }
}
