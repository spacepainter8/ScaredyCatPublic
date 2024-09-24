import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import examinationsDB from '../models/examinationsBase';
import { ReportService } from '../services/report.service';
import Doctor from '../models/doctor';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-report-input',
  templateUrl: './report-input.component.html',
  styleUrls: ['./report-input.component.css']
})
export class ReportInputComponent implements OnInit {

  constructor(private router:Router, private reportService:ReportService, private doctorService:DoctorService) { }

  ngOnInit(): void {
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='doctor'){
      this.router.navigate(['']);
    }
    this.exam = JSON.parse(sessionStorage.getItem('report'));
    this.getDoctor();
  }

  exam: examinationsDB = null;
  doctor: Doctor = null;
  message: string = "";

  symptoms: string = "";
  diagnosis: string = "";
  therapy: string = "";
  next: string = "";

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  getDoctor(){
    this.doctorService.getOneDoctor(sessionStorage.getItem('loggedIn')).subscribe((d:Doctor)=>{
      this.doctor = d;
    })
  }

  save(){

    if (this.symptoms=="" || this.diagnosis=="" || this.therapy=="" || this.next==""){
      this.message = "Please input all of the fields!";
      return;
    }

    if (new Date(this.next)<=new Date(Date.now())){
      this.message = "Please choose a date that's in the future!";
      return;
    }

    this.reportService.inputReport(this.exam, this.doctor, this.symptoms, this.diagnosis, this.therapy, this.next).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("Success!");
        this.router.navigate(['chosenPatient']);
      }
      else {
        alert("Error");
      }
    })
    
  }

}
