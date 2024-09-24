import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Doctor from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { Time } from '@angular/common';
import Examination from '../models/examinations';
import examinationsDB from '../models/examinationsBase';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import * as FullCalendar from 'fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from "@fullcalendar/interaction";
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import FreeTime from '../models/freeTime';

@Component({
  selector: 'app-chosen-doctpr',
  templateUrl: './chosen-doctpr.component.html',
  styleUrls: ['./chosen-doctpr.component.css']
})
export class ChosenDoctprComponent implements OnInit {
  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent;


  constructor(private router:Router, private doctorService:DoctorService) { }

  ngOnInit(): void {

    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='patient'){
      this.router.navigate(['']);
    }

    this.getDoctor();
  
  }

  chosenDoctor: Doctor = null;
  chosenExam: number = null;
  examination: Examination = null;
  date: string = null;
  time: string = null;
  message: string = "";
  viewForm: boolean = false;
 


  getDoctor(){
    this.doctorService.getOneDoctor(sessionStorage.getItem('chosenDr')).subscribe((doctor:Doctor)=>{
      if (doctor) this.chosenDoctor = doctor;
      this.chosenDoctor.profilePhoto = "http://localhost:4000/uploads/" + this.chosenDoctor.profilePhoto;
      this.populateCalendar();
    })
  }

  
  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  schedule(){
 



    if (this.chosenExam==null || this.date==null || this.time==null){
      this.message = "You must input all of the data!";
      return;
    }

    let tempTime = this.time;
    let hours = Number.parseInt(tempTime[0]+tempTime[1]);
    let minutes = Number.parseInt(tempTime[3]+tempTime[4]);
    

    let fullDate = new Date(this.date).getTime() + (hours*60+minutes)*60*1000;
    if (fullDate<new Date(Date.now()).getTime()){
      this.message  = "Please choose a date that's in the future";
      return;
    }

    if (hours<8 || hours>20){
      this.message = "Working hours are 8am-8pm!";
      return;
    }


    let loggedIn = sessionStorage.getItem('loggedIn');
    let exam = null;
    this.chosenDoctor.examinations.forEach((e)=>{
      if (e.id==this.chosenExam) {
        exam = e;
        this.examination = e;
      
      } 
    })

    if (hours*60+minutes+exam.length>20*60) {
      this.message = "The examination is too long! It would last after closing time.";
      return;
    }


    this.doctorService.getAllExaminationsForDoctor(this.chosenDoctor.username).subscribe((exams:examinationsDB[])=>{
      let i = 0;
      if (exams.length>0){
        exams.forEach((e)=>{
          if (e.date==this.date.toString()){
            let hoursDB = Number.parseInt(e.time[0]+e.time[1]);
            let minutesDB = Number.parseInt(e.time[3]+e.time[4]);
            let timeDBstart = hoursDB*60+minutesDB;
            let timeDBend = timeDBstart+e.length;
            let timeFormstart = hours*60 + minutes;
            let timeFormend = timeFormstart + this.examination.length;
            if ((timeFormstart<timeDBstart && timeFormend>timeDBstart) || (timeFormstart>timeDBstart && timeFormend<timeDBend) || (timeFormstart>timeDBstart && timeFormstart<timeDBend && timeFormend>timeDBend)){
              i++;
            }
          }
        })
      }
      if (i!=0){
        this.message = "The doctor is busy at this time! Try a different time or date.";
        return;
      }
      else {
        this.doctorService.getFreeTimeForDoctor(this.chosenDoctor.username).subscribe((freetimes: FreeTime[])=>{
          let i = 0;
          if (freetimes.length!=0){
            freetimes.forEach((ft)=>{
              let myDate = new Date(this.date).getTime();
              let start = new Date(ft.start).getTime();
              let end = null;
              if (ft.end!=null) end = new Date(ft.end).getTime();
              if ((myDate==start)||(end!=null && myDate>=start && myDate<=end))
              {
                i++;
                
              } 
            })
          }
         
          if (i!=0){
            this.message = "The doctor is on vacation at this time! Try a different day.";
            return;
          }
          else {
            this.doctorService.scheduleExamination(this.chosenDoctor.username, loggedIn, exam.id,this.examination.name,  this.date, this.time, exam.length, this.chosenDoctor.department, this.chosenDoctor.name, this.chosenDoctor.lastname).subscribe((resp)=>{
              if (resp['msg']=='ok'){
                alert("Congratulations! You have successfully scheduled an examination.");
  
                this.date="";
                this.time="";
                this.ngOnInit();
              }
              else {
                this.message = "Error! Try again!";
              }
            })
          }
        })
       
      }
    

    })

    
    this.viewForm = false;
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      center: 'title',
      right: 'prev,next',
      left: ''
    },
    initialView: 'timeGridWeek',
    views: {
      timeGrid: {
        type: 'timeGrid',
        duration: { days: 7 },
        buttonText: 'Week',
        columnHeaderFormat: { weekday: 'short', day: 'numeric', month: 'short' },
        slotDuration: '00:15:00',
        slotMinTime: '08:00:00', 
        slotMaxTime: '20:00:00', 
        slotLabelInterval: { minutes: 15 }

      },
    },
    initialDate:Date.now(),
    allDaySlot: false,
    dateClick: (arg:any) => {
      let year = arg.date.getFullYear();
      let month = arg.date.getMonth()+1;
      let monthStr = String(month);
      if (month<10) monthStr="0"+monthStr;
      let day = arg.date.getDate();
      let dayStr = String(day);
      if (day<10) dayStr = "0"+dayStr;
      let hours = arg.date.getHours();
      let hStr = String(hours);
      if (hours<10) hStr = "0"+hStr;
      let mins = arg.date.getMinutes();
      let mStr = String(mins);
      if (mins<10) mStr = "0"+mStr;
      this.date = year + "-" + monthStr + "-" + dayStr;
      this.time = hStr+":"+mStr;
      this.viewForm = true;
      
      alert("Trying to schedule on " + this.date + " at " + this.time + ". Pick a type of examination on the right and confirm!");
     
    },
    eventColor:'#0d9144',
    eventBorderColor:'#a31b0f',
    events:[{}],
    
  };




  populateCalendar(){
    this.doctorService.getAllExaminationsForDoctor(sessionStorage.getItem('chosenDr')).subscribe((es:examinationsDB[])=>{
      this.calendarComponent.getApi().removeAllEvents();
      es.forEach((e)=>{
        let title = e.examName;
        let start = e.date+"T"+e.time+":00";
        let startHours = Number.parseInt(e.time[0]+e.time[1]);
        let startMinutes = Number.parseInt(e.time[3]+e.time[4]) + startHours*60;
        let endMinutes = startMinutes+e.length;
        let endHours = Math.floor(endMinutes/60);
        let endMin = endMinutes%60;
        let enhrsString:String = String(endHours);
        let endminString: String = String(endMin);
        if (endHours<10) enhrsString = "0" + enhrsString;
        if (endMin<10) endminString = "0" + endminString;
        let end = e.date+"T"+enhrsString+":"+endminString+":"+"00";
        const newEvent: EventInput = {
          title: title,
          start: start, 
          end: end 
        };
    
        
        const calendarApi = this.calendarComponent.getApi();
        
        calendarApi.addEvent(newEvent);

      })

      this.doctorService.getFreeTimeForDoctor(sessionStorage.getItem('chosenDr')).subscribe((freeTimes:FreeTime[])=>{
        freeTimes.forEach((ft)=>{
          let title = "Free day or vacation";
          let start = ft.start+"T"+"00:00:00";
          let end = "";
          if (ft.end==null) end = ft.start+"T"+"24:00:00";
          else {
            end = ft.end;
            let date:Date = new Date(new Date(end).getTime() + 48*60*60*1000-2*60*60*1000);
            end = date.toISOString().substring(0,10);
          }
          const newEvent: EventInput = {
            title:title,
            start:start,
            end:end
          }
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.addEvent(newEvent);
        })

      })


    })
  }

  onDateSelect(event:any){
    let x = 5;
    let date = String(event.year);
    let month = event.month;
    let monthStr = String(month);
    if (month<10) monthStr = "0"+monthStr;
    let day = event.day;
    let dayStr = String(day);
    if (day<10) dayStr = "0"+dayStr;

    date+="-"+monthStr+"-"+dayStr;

    this.calendarComponent.getApi().gotoDate(date);
  }
  
}
