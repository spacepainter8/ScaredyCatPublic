import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Notification } from '../models/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private router:Router, private patientService:PatientService) { }

  ngOnInit(): void {
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='patient'){
      this.router.navigate(['']);
    }

    this.getNotifs();
  }

  notifs: Notification[] = [];

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  getNotifs(){
    this.patientService.getAllNotificationsForPatient(sessionStorage.getItem('loggedIn')).subscribe((ns:Notification[])=>{
      this.notifs = ns;
      this.notifs.forEach((n)=>{
        if (n.read.length!=0 && n.read.includes(sessionStorage.getItem('loggedIn'))){
          n.readByMe = true;
        }
        else {
          n.readByMe = false;
        }
      })
      
    })
  }

  change(id){
    this.patientService.setNotifAsRead(id, sessionStorage.getItem('loggedIn')).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        this.notifs.forEach((n)=>{
          if (n.id==id) {n.readByMe = true;n.read.push(sessionStorage.getItem('loggedIn'))};
        })
      }
    })
  }

  

}
