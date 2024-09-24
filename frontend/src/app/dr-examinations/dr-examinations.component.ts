import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import examinationsDB from '../models/examinationsBase';
import { DoctorService } from '../services/doctor.service';
import { CalendarOptions, DateInput, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FullCalendarComponent } from '@fullcalendar/angular';
import Doctor from '../models/doctor';
import FreeTime from '../models/freeTime';
import { PatientService } from '../services/patient.service';
import Patient from '../models/patient';


@Component({
  selector: 'app-dr-examinations',
  templateUrl: './dr-examinations.component.html',
  styleUrls: ['./dr-examinations.component.css']
})
export class DrExaminationsComponent implements OnInit {
  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent;


  constructor(private router:Router, private doctorService:DoctorService, private patientService:PatientService) { }

  ngOnInit(): void {
    this.myNextExaminations = [];
    this.nextThree = [];
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='doctor'){
      this.router.navigate(['']);
    }

    // get ending day for calendar
    let currentDay = new Date(Date.now()).getDay();
    if (currentDay==0) this.daysLeft = 1;
    else this.daysLeft = 8-currentDay;




    this.getMyExaminations();
  }

  loggedIn: Doctor = null;
  myNextExaminations:examinationsDB[] = [];
  nextThree: examinationsDB[] = [];
  daysLeft:number;
  reason:string;
  
  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
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
    allDaySlot: false,
    eventColor:'#0d9144',
    eventBorderColor:'#a31b0f',
    events:[{}],
    eventClick: this.handleEventClick.bind(this),
    
  };

  handleEventClick(arg){
    if (arg.event.title=="Free day or vacation") return;
   this.patient(arg.event.id);
  }

  getMyExaminations(){
    this.myNextExaminations = [];
    this.doctorService.getAllExaminationsForDoctor(sessionStorage.getItem('loggedIn')).subscribe((exams:examinationsDB[])=>{
      exams.forEach((e)=>{
        let date = Date.parse(e.date)-2*60*60*1000;
        let hours = Number.parseInt(e.time[0]+e.time[1]);
        let minutes = Number.parseInt(e.time[3]+e.time[4]);
        if (date+(hours*60+minutes)*60*1000>Date.now()){
          this.myNextExaminations.push(e);
        }
        
      })

      if (this.myNextExaminations.length>0){
        this.myNextExaminations = this.myNextExaminations.sort((e1, e2) => {
          let minutes1 = Number.parseInt(e1.time[0]+e1.time[1])*60+Number.parseInt(e1.time[3]+e1.time[4]);          
          let minutes2 = Number.parseInt(e2.time[0]+e2.time[1])*60+Number.parseInt(e2.time[3]+e2.time[4]);

          let date1 = Date.parse(e1.date)-2*60*60*1000+minutes1*60*1000;
          let date2 = Date.parse(e2.date)-2*60*60*1000+minutes2*60*1000;
          if (date1<date2) return -1;
          else if (date1>date2) return 1;
          else return 0; 
        })
        this.nextThree.push(this.myNextExaminations[0]);
        this.nextThree.push(this.myNextExaminations[1]);
        this.nextThree.push(this.myNextExaminations[2]);
      }

      this.calendarComponent.getApi().removeAllEvents();
      exams.forEach((e)=>{
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
          end: end,
          id:e.patient
        };
    
        
        const calendarApi = this.calendarComponent.getApi();
        
    
    
        calendarApi.addEvent(newEvent);

      });

      this.doctorService.getFreeTimeForDoctor(sessionStorage.getItem('loggedIn')).subscribe((freeTimes:FreeTime[])=>{
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
        const calendarApi = this.calendarComponent.getApi();
        
        calendarApi.setOption('validRange', {
          start: new Date().toISOString().substring(0, 10),
          end: new Date(new Date().getTime() + (7+this.daysLeft) * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        });
  
        this.doctorService.getOneDoctor(sessionStorage.getItem('loggedIn')).subscribe((d:Doctor)=>{
          this.loggedIn = d;
          this.loggedIn.profilePhoto = "http://localhost:4000/uploads/" + this.loggedIn.profilePhoto;
        })
      })

      
      this.getPatientNamesForExamination();

    

    })
  }

  getPatientNamesForExamination(){
    this.myNextExaminations.forEach((ne)=>{
      this.patientService.getOnePatient(ne.patient).subscribe((p:Patient)=>{
        ne.patientName = p.name;
        ne.patientLastname = p.lastname;
      })
    })
  }

  cancel(id){
    let chosen:examinationsDB = null;
    this.nextThree.forEach((e)=>{
      if (e.id==id) chosen=e;
    })
    this.reason = chosen.reason;
    this.reason = "Your examination on " + chosen.date + " at " + chosen.time + " with doctor " + this.loggedIn.name + " " + this.loggedIn.lastname + " has been cancelled. \n" + this.reason;

    this.doctorService.cancelAndExplain(chosen, this.reason).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("Succefully cancelled!");
        this.myNextExaminations = [];
        this.ngOnInit();
      }
      else {
        alert("Error!");
      }
    })
  }

  patient(username){
    sessionStorage.setItem('chosenPatient', username);
    this.router.navigate(['chosenPatient']);
  }

  

}
