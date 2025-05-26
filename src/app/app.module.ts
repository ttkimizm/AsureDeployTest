import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { FontAwesomeService } from '../app/services/font-awesome.service';
import { Screen1Component } from './screen1/screen1.component';
import { Screen2Component } from './screen2/screen2.component';
import { Screen3Component } from './screen3/screen3.component';
import { NgxResizeObserverModule } from 'ngx-resize-observer';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { LoadingSpinnerService } from './services/loading-spinner.service';
import { AjaxService } from './services/ajax.service';
import { CustomDateAdapterService } from './services/custom-date-adapter.service';
import { InterceptorService } from './services/interceptor.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch
} from '@angular/common/http';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  DateAdapter
} from '@angular/material/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';
import {
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalService,
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent
} from '@azure/msal-angular';
import {
  msalGuardConfigFactory,
  msalInstanceFactory,
  msalInterceptorConfigFactory
} from './services/msal-factory.service';

@NgModule({
  declarations: [
    AppComponent,
    Screen1Component,
    Screen2Component,
    Screen3Component,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatTabsModule,
    MsalModule,
    FontAwesomeModule,
    NgxResizeObserverModule
  ],
  providers: [
    DatePipe,
    MsalBroadcastService,
    MsalService,
    MsalGuard,
    FontAwesomeService,
    LoadingSpinnerService,
    AjaxService,
    AuthGuard,
    LoginGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: msalGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: msalInterceptorConfigFactory,
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapterService
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'ja-JP'
    },
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ],
  bootstrap: [
    AppComponent,
    MsalRedirectComponent
  ]
})
export class AppModule { }
