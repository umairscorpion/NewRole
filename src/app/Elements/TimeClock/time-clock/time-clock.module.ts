import { NgModule, Injector,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCustomElement } from '@angular/elements';
import { NewTimeClockComponent } from 'src/app/Components/TimeClock/timeclock/timeclock.component';
import{AppModule} from 'src/app/app.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NewTimeClockComponent],
  entryComponents:[NewTimeClockComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  // exports: [TimeClockModule]
})
export class TimeClockModule {
  constructor(injector:Injector) {
    const el = createCustomElement(NewTimeClockComponent, { injector: injector });
    customElements.define('subzz-time-clock', el);
  }
 }
