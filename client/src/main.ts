import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig, httpReq } from './app/app.config';
import { provideStore } from '@ngrx/store';
import { userReducer } from './app/store/reducer';

bootstrapApplication(App, {
  providers: [...appConfig.providers, ...httpReq.providers, provideStore({ user: userReducer })],
}).catch((err) => console.error(err));

if (location.search.includes('debug=1')) {
  import('eruda').then((eruda) => eruda.default.init());
}
