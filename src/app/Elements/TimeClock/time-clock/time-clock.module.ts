import { NgModule, Injector,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCustomElement } from '@angular/elements';
import{AppModule} from '../../../app.module';

@NgModule({
  imports: [
    CommonModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  // exports: [TimeClockModule]
})
export class TimeClockModule {
  constructor(injector:Injector) {
  }
 }
