import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';

declare const $: any;

@Component({
  // moduleId: module.id,
  selector: 'ng-nav',
  templateUrl: 'nav.template.html'
})
export class NavbarComponent implements OnInit {
  public menuItems: any[];
  appName: string = 'Appointmentor';
  active: string = 'settings';
  trustedProfileImageUrl: SafeUrl;

  constructor(
    private router: Router) { }

  ngOnInit() {
    this.menuItems = this.router.config[1].children;
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector('.sidebar .sidebar-wrapper')
      );
      // let ps = new PerfectScrollbar(elemSidebar, {
      //   wheelSpeed: 2,
      //   suppressScrollX: true
      // });
    }
  }

  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
      navigator.platform.toUpperCase().indexOf('IPAD') >= 0
    ) {
      bool = true;
    }
    return bool;
  }
}
