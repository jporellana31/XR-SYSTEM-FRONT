import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MatStepperModule} from '@angular/material/stepper';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { Modelo1Component } from './modelo1/modelo1.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologysComponent } from './radiologys/radiologys.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";
// import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './login/iterceptors/token.interceptor';
import { AuthInterceptor } from './login/iterceptors/auth.interceptor';
import { AdminComponent } from './admin/admin.component';
import { NgxPaginationModule } from 'ngx-pagination';
// import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PageUserComponent } from './page-user/page-user.component';
import { ProfileComponent } from './profile/profile.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { MagneticResonanceComponent } from './magnetic-resonance/magnetic-resonance.component';
import { ResonanceComponent } from './resonance/resonance.component';
import { ModalComponent } from './modal/modal.component';
// import {CornerstoneModule} from 'cornerstone-core';


@NgModule({
  declarations: [
    AppComponent,
    Modelo1Component,
    NavbarComponent,
    FooterComponent,
    RadiologyComponent,
    RadiologysComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    PageUserComponent,
    ProfileComponent,
    LostPasswordComponent,
    MagneticResonanceComponent,
    ResonanceComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // MatStepperModule,
    FormsModule,
    NgxChartsModule,
    // NgChartsModule,
    HttpClientModule,
    // NgbPaginationModule, NgbAlertModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    // CornerstoneModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass:TokenInterceptor, multi:true},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
