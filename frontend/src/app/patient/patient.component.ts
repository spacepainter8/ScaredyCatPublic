import { Component, OnInit } from '@angular/core';
import Patient from '../models/patient';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  constructor(private patientService:PatientService, private router:Router) { }

  ngOnInit(): void {
    this.router.navigate(['profile']);
    // someone needs to be LOGGED IN  and it needs to be a PATIENT
    // if (sessionStorage.getItem('loggedIn')==null || (sessionStorage.getItem('loggedIn')!=null && sessionStorage.getItem('type')!='patient')){
    //   this.router.navigate(['']);
    // }
    // this.getLoggedIn();
   
  }

  loggedIn:Patient = null;

  getLoggedIn(){
    this.patientService.getOnePatient(sessionStorage.getItem('loggedIn')).subscribe((patient:Patient)=>{
      this.loggedIn = patient;
      if (this.loggedIn!=null) this.loggedIn.profilePhoto = "http://localhost:4000/uploads/" + this.loggedIn.profilePhoto;
      if (this.loggedIn==null || (this.loggedIn!=null && sessionStorage.getItem('type')!='patient') ) {
        this.router.navigate(['']);
      }
    })
  }


}
