import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import Doctor from '../models/doctor';
import { Router } from '@angular/router';
import Patient from '../models/patient';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private doctorService:DoctorService, private patientService:PatientService, private router:Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('loggedIn')!=null){
      this.router.navigate(['']);
    }
  }

  username:string = "";
  password: string = "";
  type: string = "";
  message:string = "";

  login(){
    // check if all data is in
    // loginDoctor and loginPatient

    if (this.username==""){
      this.message = "Please input your username!";
      return;
    }
    else if (this.password==""){
      this.message = "Please input your password!";
      return;
    }
    else if (this.type==""){
      this.message = "Please choose whether you're a patient or a doctor!";
      return;
    }
    else {
      if (this.type=="doctor"){
        this.doctorService.login(this.username, this.password, this.type).subscribe((doctor:Doctor)=>{
         
          if (doctor!=null){
            sessionStorage.setItem('loggedIn', this.username);
            sessionStorage.setItem('type', "doctor");
            this.router.navigate(['doctor']);

          }
          else {
            this.message = "Wrong credentials or wrong user type!";
            return;
          }
        })
      }
      else if (this.type=="patient"){
        this.patientService.login(this.username, this.password, this.type).subscribe((patient:Patient)=>{
          if (patient!=null){

            sessionStorage.setItem('loggedIn', this.username);
            sessionStorage.setItem('type', 'patient');
            this.router.navigate(['profile']);
          }
          else {
            this.message = "Wrong credentials or wrong user type!";
            return;
          }
        })
      }
      else {
        this.message = "Unknown type of user!";
        return;
      }
    }

  }


}
