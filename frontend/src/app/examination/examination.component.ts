import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import examinationsDB from '../models/examinationsBase';
import { PatientService } from '../services/patient.service';
import { DoctorService } from '../services/doctor.service';
import Doctor from '../models/doctor';
import Report from '../models/report';
import { ReportService } from '../services/report.service';

import Patient from '../models/patient';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent implements OnInit {

  constructor(private router:Router, private renderer:Renderer2, private patientService:PatientService, private doctorService:DoctorService, private reportService:ReportService) { }

  ngOnInit(): void {
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='patient'){
      this.router.navigate(['']);
    }

    this.getMyExams();
  
  }

 
  loggedIn: Patient = null;

  myFutureExaminations:examinationsDB[] = [];
  myReports: Report[] = [];


  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  getMyExams(){
    this.patientService.getExamsForPatient(sessionStorage.getItem('loggedIn')).subscribe((exams:examinationsDB[])=>{
      exams.forEach((e)=>{
        let date = Date.parse(e.date)-2*60*60*1000;
        let hours = Number.parseInt(e.time[0]+e.time[1]);
        let minutes = Number.parseInt(e.time[3]+e.time[4]);
        if (date+(hours*60+minutes)*60*1000>Date.now()){
          this.myFutureExaminations.push(e);
        }
        
      })
      if (this.myFutureExaminations.length>0){
        this.myFutureExaminations = this.myFutureExaminations.sort((e1, e2) => {
          let minutes1 = Number.parseInt(e1.time[0]+e1.time[1])*60+Number.parseInt(e1.time[3]+e1.time[4]);          
          let minutes2 = Number.parseInt(e2.time[0]+e2.time[1])*60+Number.parseInt(e2.time[3]+e2.time[4]);

          let date1 = Date.parse(e1.date)-2*60*60*1000+minutes1*60*1000;
          let date2 = Date.parse(e2.date)-2*60*60*1000+minutes2*60*1000;
          if (date1<date2) return -1;
          else if (date1>date2) return 1;
          else return 0; 
        })

        this.myFutureExaminations.forEach((e)=>{
          this.doctorService.getOneDoctor(e.doctor).subscribe((d:Doctor)=>{
            if (d) e.doctorObj = d;
            else {
              
            }
          })
        })
      }
      this.getMyReports();

      

    })
  }

  cancel(id){
    this.patientService.cancelExamination(id).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("You have successfully cancelled an examination");
        this.myFutureExaminations = [];
        this.ngOnInit();
      }
      else {
        alert("There has been an error! Try again.");
      }
    })
  }

  getMyReports(){
    this.reportService.getMyReports(sessionStorage.getItem('loggedIn')).subscribe((reports:Report[])=>{
      this.myReports = reports;
      if (this.myReports.length>0){
        this.myReports = this.myReports.sort((r1, r2) => {
          let minutes1 = Number.parseInt(r1.time[0]+r1.time[1])*60+Number.parseInt(r1.time[3]+r1.time[4]);          
          let minutes2 = Number.parseInt(r2.time[0]+r2.time[1])*60+Number.parseInt(r2.time[3]+r2.time[4]);

          let date1 = Date.parse(r1.date)-2*60*60*1000+minutes1*60*1000;
          let date2 = Date.parse(r2.date)-2*60*60*1000+minutes2*60*1000;
          if (date1<date2) return 1;
          else if (date1>date2) return -1;
          else return 0; 
        })
      }
      this.patientService.getOnePatient(sessionStorage.getItem('loggedIn')).subscribe((p:Patient)=>{
        this.loggedIn = p;
      })
      
    })
  }
  
  savePdf(){
    this.patientService.test(this.myReports, this.loggedIn.email).subscribe((r)=>{
      alert("You have been sent a link to the pdf via email");
    })
  }


  saveSpecificPdf(id){
    let r = null;
    this.myReports.forEach((rs)=>{
      if (rs.id==id) r=rs;
    })
    this.patientService.testOne(r, this.loggedIn.email).subscribe((r)=>{
      alert("You have been sent a link to the pdf via email");
    })
  }
    
 
  
 
}
