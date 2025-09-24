import {
  BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideMarkdown } from 'ngx-markdown';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(
    AppComponent,
    {
      providers: [
        provideRouter(routes),
        importProvidersFrom(HttpClientModule, FormsModule),
        provideMarkdown(),
      ],
    },
    context
  );

export default bootstrap;
