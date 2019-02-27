import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// whenever you want to change language set this locale string in local storage and reload the location
if (localStorage.getItem('locale') === null) {
  localStorage.setItem('locale', 'en');
}
localStorage.setItem('locale', 'en');
const locale = localStorage.getItem('locale');
declare const require;  
const translations = require(`raw-loader!./locale/messages.${locale}.xlf`);
platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    {provide: TRANSLATIONS, useValue: translations},
    {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'}
  ]
}).catch(err => console.log(err));
  
