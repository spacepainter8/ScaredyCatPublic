import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import Doctor from '../models/doctor';
import FreeTime from '../models/freeTime';
import examinationsDB from '../models/examinationsBase';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.css']
})
export class MiscComponent implements OnInit {

  constructor(private router:Router, private doctorService:DoctorService) { }

  ngOnInit(): void {
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='doctor'){
      this.router.navigate(['']);
    }
    this.getDoctor();
    
  }

  doctor: Doctor;
  examinations:examinationsDB[] = [];
  freetimes: FreeTime[] = [];

  newExam:string = "";
  length: number;
  price: number;

  freeDay: string="";
  startVac: string = "";
  endVac: string = "";

  examMess: string = "";
  fdMess: string = "";
  vacMess: string = "";

  getDoctor(){
    this.doctorService.getOneDoctor(sessionStorage.getItem('loggedIn')).subscribe((d:Doctor)=>{
      this.doctor = d;
      this.doctorService.getAllExaminationsForDoctor(this.doctor.username).subscribe((exams:examinationsDB[])=>{
        this.examinations = exams;
        this.doctorService.getFreeTimeForDoctor(this.doctor.username).subscribe((fts:FreeTime[])=>{
          this.freetimes = fts;
        })
      })
    })
  }


  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  request(){
    if (this.newExam=="" || this.length==null || this.price==null ){
      this.examMess = "You must input all fields";
      return;
    }

    this.doctorService.requestExamination(this.doctor.username, this.doctor.specialty, this.newExam, this.length, this.price).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        this.newExam = "";
        this.length = null;
        this.price = null;
        this.examMess = "You have successfully requested a new examination";
      }
      else {
        this.examMess = "Error";
      }
    })
  }

  free(){
    let i = 0;
    if (this.freeDay==""){
      this.fdMess = "You must insert the date of your free day!";
      return;
    }
    if (new Date(this.freeDay)<=new Date(Date.now())){
      this.fdMess = "You must choose a date that's in the future!";
      return;
    }
    this.examinations.forEach((e)=>{
      if (new Date(e.date).getTime()==new Date(this.freeDay).getTime()){
        i++;
      }
    })
    if (i>0) {
      this.fdMess = "You have an examination scheduled on this day";
        return;
    }
    this.freetimes.forEach((ft)=>{
      if (ft.end==null){
        if (new Date(ft.start).getTime()==new Date(this.freeDay).getTime()){
         i++;
        }
      }
      else {
        if (new Date(this.freeDay)>=new Date(ft.start) && new Date(this.freeDay)<=new Date(ft.end)){
          i++;
        }
      }
    })
    if (i>0){
      this.fdMess = "You already have a free day or vacation on this day";
      return;
    }

    this.doctorService.insertFreeTime(this.doctor.username, this.freeDay, null).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        this.fdMess = "Success! You have a free day!";
        this.freeDay = "";
      }
      else this.fdMess  ="Error";
    })
  }

  vacation(){
    if (this.startVac=="" || this.endVac==""){
      this.vacMess  ="You must input both fields!";
      return;
    }
    
    if (new Date(this.startVac)<=new Date(Date.now())){
     this.vacMess  ="Vacation start day must be in the future!";
      return;
    }
    if (new Date(this.endVac)<=new Date(Date.now())){
      this.vacMess = "Vacation end day must be in the future!";
      return;
    }
    if (new Date(this.endVac)<=new Date(this.startVac)){
      this.vacMess  ="Vacation start day must be before end day!";
      return;
    }

    // startVac
    // endVac
    // first check examinations and then other free times
    let  i = 0;
    this.examinations.forEach((e)=>{
      if (new Date(e.date).getTime()>=new Date(this.startVac).getTime() && new Date(e.date).getTime()<=new Date(this.endVac).getTime()){
        i++;
      }
    })
    if (i>0){
      this.vacMess = "You have an examination during this time";
      return;
    }

    let sv = new Date(this.startVac).getTime();
    let ev = new Date(this.endVac).getTime();

    this.freetimes.forEach((ft)=>{
      if (ft.end==null){
        if (new Date(ft.start).getTime()>=new Date(this.startVac).getTime() && new Date(ft.start).getTime()<=new Date(this.endVac).getTime()){
          i++;
        }
        
      }
      else {
        let sft = new Date(ft.start).getTime();
        let eft = new Date(ft.end).getTime();
        if (sv<sft && ev>sft) i++;
        else if (sv>sft && sv<eft) i++;
      }
    })

    if (i>0){
      this.vacMess = "You already have vacation or a free day during this time";
      return;
    }

    this.doctorService.insertFreeTime(this.doctor.username, this.startVac, this.endVac).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        this.vacMess  ="You have successfully scheduled your vacation!";
        this.startVac = "";
        this.endVac = "";
      }
      else {
        this.vacMess = "Error";
      }
    })


  }


}
