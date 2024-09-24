import { Component, OnInit } from '@angular/core';
import Report from '../models/report';
import { ReportService } from '../services/report.service';
import { Router } from '@angular/router';
import examinationsDB from '../models/examinationsBase';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-chosen-patient',
  templateUrl: './chosen-patient.component.html',
  styleUrls: ['./chosen-patient.component.css']
})
export class ChosenPatientComponent implements OnInit {

  constructor(private reportService:ReportService, private router:Router, private patientService:PatientService) { }

  ngOnInit(): void {
    this.myReports = [];this.pastExaminations = [];
    this.getReports();
  }

  myReports:Report[] = [];
  pastExaminations: examinationsDB[] = [];

  getReports(){
    this.reportService.getMyReports(sessionStorage.getItem('chosenPatient')).subscribe((reports:Report[])=>{
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

      this.getPastExaminations();



    })
  }

  getPastExaminations(){
    this.patientService.getExamsForPatient(sessionStorage.getItem('chosenPatient')).subscribe((exams:examinationsDB[])=>{
      exams.forEach((e)=>{
        let date = Date.parse(e.date)-2*60*60*1000;
        let hours = Number.parseInt(e.time[0]+e.time[1]);
        let minutes = Number.parseInt(e.time[3]+e.time[4]);
        if (date+(hours*60+minutes)*60*1000<=Date.now() && e.doctor==sessionStorage.getItem('loggedIn')){
          this.pastExaminations.push(e);
        }
        
      })
      if (this.pastExaminations.length>0){
        this.pastExaminations = this.pastExaminations.sort((e1, e2) => {
          let minutes1 = Number.parseInt(e1.time[0]+e1.time[1])*60+Number.parseInt(e1.time[3]+e1.time[4]);          
          let minutes2 = Number.parseInt(e2.time[0]+e2.time[1])*60+Number.parseInt(e2.time[3]+e2.time[4]);

          let date1 = Date.parse(e1.date)-2*60*60*1000+minutes1*60*1000;
          let date2 = Date.parse(e2.date)-2*60*60*1000+minutes2*60*1000;
          if (date1<date2) return 1;
          else if (date1>date2) return -1;
          else return 0; 
        })

      }

    })
  }

  
  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  report(id){
    let exam = new examinationsDB();
    this.pastExaminations.forEach((e)=>{
      if (e.id==id) exam = e; 
    })
    sessionStorage.setItem('report', JSON.stringify(exam));
    this.router.navigate(['reportInput']);
  }

}
