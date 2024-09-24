import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { DoctorService } from '../services/doctor.service';
import { ManagerService } from '../services/manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit {

  constructor(private patientService:PatientService, private doctorService:DoctorService, private managerService:ManagerService, private router:Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('loggedIn')!=null){
      this.router.navigate(['']);
    }
  }

  username: string = "";
  oldpass: string = "";
  newpass: string = "";
  newpassValidate: string = "";
  type: string = "";
  message:string = "";

  loggedIn:string = null;


  changePass(){
    if (this.username=="" || this.oldpass=="" || this.newpass=="" || this.newpassValidate=="" 
    || this.type=="" ){
      this.message="All fields are required!";
      return;
    }
    else if (this.newpassValidate!=this.newpass){
      this.message = "Password and Verify Password are different!";
      return;
    }
    else if (this.newpass.length<8 || this.newpass.length>14){
      this.message = "Password needs to be between 8 and 14 characters long!";
      return;
    }
    else if (!this.newpass.match('[A-Z]')){
      this.message = "Password needs to contain an uppercase character!";
      return;
    }
    else if (!this.newpass.match('[0-9]')){
      this.message = "Password needs to contain a number!";
      return;
    }
    else if (!this.newpass.match('[^a-zA-Z0-9]')){
      this.message = "Password needs to contain a special character!";
      return;
    }
    else if (!this.newpass.match('^[a-zA-Z]')){
      this.message = "Password needs to start with a letter!";
      return
    }
    else {
      for (let i=0;i<this.newpass.length;i++){
        if (i!=this.newpass.length-1 && this.newpass[i]==this.newpass[i+1]){
          this.message = "Password can't contain two identical characters in a row!";
          return;
        }
      }
      if (this.type=="patient"){
        this.patientService.changePassword(this.username, this.oldpass, this.newpass).subscribe((resp)=>{
          if (resp['msg']=='ok'){
            alert("Congratulations! You have changed your password.");
            this.router.navigate(['login']);
          }
          else {
            this.message = "Wrong credentials! Try again.";
          }
        })
      }
      else if (this.type=="doctor"){
        this.doctorService.changePassword(this.username, this.oldpass, this.newpass).subscribe((resp)=>{
          if (resp['msg']=='ok'){
            alert("Congratulations! You have changed your password.");
            this.router.navigate(['login']);
          }
          else {
            this.message = "Wrong credentials! Try again.";
          }
        })
      }
      else if (this.type=="manager"){
        this.managerService.changePassword(this.username, this.oldpass, this.newpass).subscribe((resp)=>{
          if (resp['msg']=='ok'){
            alert("Congratulations! You have changed your password.");
            this.router.navigate(['login']);
          }
          else {
            this.message = "Wrong credentials! Try again.";
          }
        })
      }
    }

  }


}
