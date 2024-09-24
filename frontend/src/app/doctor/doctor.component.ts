import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Doctor from '../models/doctor';
import { Router } from '@angular/router';
import * as FullCalendar from 'fullcalendar';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import { CalendarOptions, EventAddArg, EventInput} from '@fullcalendar/core';
import { DoctorService } from '../services/doctor.service';
import examinationsDB from '../models/examinationsBase';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from "@fullcalendar/interaction";
import Examination from '../models/examinations';



@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  constructor(private router:Router, private doctorService:DoctorService) { }

  ngOnInit(): void {
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='doctor'){
      this.router.navigate(['']);
    }

    this.getLoggedIn();

  }
  
  loggedIn: Doctor = null;
  primary: boolean = true;
  chosenImage: File = null;
  message: string = "";

  name: string = "";
  lastname: string = "";
  address: string = "";
  phone: string = "";
  licence: number = null;
  specialty: string = "";
  
  possibleExaminations: Examination[] = [];
  chosenExams: Examination[] = [];




  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  getLoggedIn(){
    this.doctorService.getOneDoctor(sessionStorage.getItem('loggedIn')).subscribe((d:Doctor)=>{
      this.loggedIn = d;
      this.loggedIn.profilePhoto = "http://localhost:4000/uploads/" + this.loggedIn.profilePhoto;
      this.getPossibleExaminations();
    })
  }

   fileChosen(event:any){
    if (event.target.value){
      this.chosenImage = <File> event.target.files[0];
    }
  }

  change(){
    this.primary = false;
    this.ngOnInit();
  }

  save(){
  

    if (this.phone!="" && !this.phone.match('^[0-9]{10}$')){
      this.message = "Phone number needs to be a set of exactly 10 numbers!";
      return;
    }


    if (this.name=="") this.name=this.loggedIn.name;
    if (this.lastname=="") this.lastname=this.loggedIn.lastname;
    if (this.address=="") this.address = this.loggedIn.address;
    if (this.phone=="") this.phone = this.loggedIn.phone;
    if (this.licence==null) this.licence = this.loggedIn.licence;
    if (this.specialty=="" || this.specialty==null) this.specialty = null;
    else this.specialty = this.specialty.toLowerCase();

    if (this.chosenImage==null){
      this.doctorService.updateDoctor(this.loggedIn.username, this.name, this.lastname, this.address, this.phone, this.licence, this.specialty).subscribe((resp)=>{
        if (resp['msg']=='ok'){
          alert("Congratulations! You have successfully updated your profile!");
          this.message = "";
        }
        if (this.message==""){
          this.name="";this.lastname="";this.address="";
          this.phone="";this.licence=null;this.specialty="";
          this.primary = true;
          this.possibleExaminations = [];
          this.ngOnInit();
        }
      })
    }
    else {
      let fd = new FormData();
      fd.append('username', this.loggedIn.username);
      fd.append('name', this.name);
      fd.append('lastname', this.lastname);
      fd.append('address', this.address);
      fd.append('phone', this.phone);
      fd.append('licence', JSON.stringify(this.licence));
      if (this.specialty!=null && this.specialty!="")fd.append('specialty', this.specialty.toLocaleLowerCase());


      if (!this.chosenImage.name.match(/\.(jpg|jpeg|png)$/)){
        this.message = "Improper file extension! Only jpg, jpeg, png and gif are allowed.";
        return;
      }
      // sta ako nije ubacena slika
      fd.append('chosenImage', this.chosenImage, this.chosenImage.name)
   

      this.doctorService.updateDoctorWPicture(fd).subscribe((resp)=>{
        if (resp['msg']=='badDim'){
          this.message = "Image needs to be between 100x100 and 300x300";
        }
        else if (resp['msg']=='ok'){
          alert("Congratulations! You have successfully updated your profile!");
          this.message = "";
        }
        if (this.message==""){
          this.name="";this.lastname="";this.address="";
          this.phone="";this.licence=null;this.specialty="";
          this.chosenImage=null;
          this.primary = true;
          this.possibleExaminations = [];
          this.ngOnInit();
        }

      })





    }

  }

  getPossibleExaminations(){

    this.doctorService.getPossibleExaminations(this.loggedIn.specialty).subscribe((e:Examination[])=>{
      if (e.length!=0){
        this.possibleExaminations = e;
        this.possibleExaminations.forEach((pe)=>{
          this.loggedIn.examinations.forEach((e)=>{
            if (e.id==pe.id) pe.chosen=true;
          })
        })
      }
    })
  }

  choose(){
    this.chosenExams = [];
    this.possibleExaminations.forEach((pE)=>{
      if (pE.chosen==true){
        let e = pE;
        e.chosen = null;
        this.chosenExams.push(e);
      }
    })

    this.doctorService.chooseExaminations(this.loggedIn.username,this.chosenExams).subscribe((resp)=>{
      if (resp['msg']=='ok') {alert("You have successfully updated your list of examinations!");this.ngOnInit();}
      else {
        alert("Error");
      }
    })
  }
  
  
}
