import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};

export const httpReq: ApplicationConfig = {
  providers: [provideHttpClient()],
};
export const editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
};
