import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
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
import { DrExaminationsComponent } from './dr-examinations/dr-examinations.component';
import { MiscComponent } from './misc/misc.component';
import { ChosenPatientComponent } from './chosen-patient/chosen-patient.component';
import { ReportInputComponent } from './report-input/report-input.component';
import { OtherComponent } from './other/other.component';

const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"", component:HomeComponent},
  {path:"register", component:RegisterComponent},
  {path:"forgottenPassword", component:ForgottenPasswordComponent},
  {path:"doctor", component:DoctorComponent},
  {path:"patient", component:PatientComponent},
  {path:"managerLogin", component:ManagerLoginComponent},
  {path:"manager", component:ManagerComponent},
  {path:'home', component:HomeComponent},
  {path:'profile', component:ProfileComponent},
  {path:'doctors', component:DoctorsComponent},
  {path:'examinations', component:ExaminationComponent},
  {path:'notifications', component:NotificationsComponent},
  {path:'chosenDr', component:ChosenDoctprComponent},
  {path:'drExaminations', component:DrExaminationsComponent},
  {path:'misc', component:MiscComponent},
  {path:'chosenPatient', component:ChosenPatientComponent},
  {path:'reportInput', component:ReportInputComponent},
  {path:'other', component:OtherComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
