import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { ManagerLoginComponent } from './manager-login/manager-login.component';
import { ManagerComponent } from './manager/manager.component';
import { ProfileComponent } from './profile/profile.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { ExaminationComponent } from './examination/examination.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChosenDoctprComponent } from './chosen-doctpr/chosen-doctpr.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DrExaminationsComponent } from './dr-examinations/dr-examinations.component';
import { MiscComponent } from './misc/misc.component';
import { ChosenPatientComponent } from './chosen-patient/chosen-patient.component';
import { ReportInputComponent } from './report-input/report-input.component';
import { OtherComponent } from './other/other.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ForgottenPasswordComponent,
    DoctorComponent,
    PatientComponent,
    ManagerLoginComponent,
    ManagerComponent,
    ProfileComponent,
    DoctorsComponent,
    ExaminationComponent,
    NotificationsComponent,
    ChosenDoctprComponent,
    DrExaminationsComponent,
    MiscComponent,
    ChosenPatientComponent,
    ReportInputComponent,
    OtherComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbPaginationModule, NgbAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
