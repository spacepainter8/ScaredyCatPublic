import { Component, OnInit } from '@angular/core';
import Doctor from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private doctorService:DoctorService, private router:Router) { }

  ngOnInit(): void {
    this.getAllDoctors();
    this.loggedIn = sessionStorage.getItem('loggedIn');
    this.type = sessionStorage.getItem('type');
  }

  allDoctors: Doctor[] = [];
  sortOption: string = "";
  name: string = "";
  lastname: string = "";
  specialty: string = "";

  loggedIn: string = null;
  type:string = "";


  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }



  getAllDoctors(){
    this.doctorService.getAllDoctors().subscribe((doctors:Doctor[])=>{
      this.allDoctors = doctors;
      this.allDoctors.forEach((d)=>{
        d.profilePhoto = "http://localhost:4000/uploads/" + d.profilePhoto;
      })
      
      
    })
  }

  sort(){
    switch(this.sortOption){
      case "NA":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.name>d2.name) return 1;
          else if (d1.name==d2.name) return 0;
          else return -1;
        })
        break;
      }
      case "ND":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.name<d2.name) return 1;
          else if (d1.name==d2.name) return 0;
          else return -1;
        })
        break;
      }
      case "LA":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.lastname>d2.lastname) return 1;
          else if (d1.lastname==d2.lastname) return 0;
          else return -1;
        })
        break;
      }
      case "LD":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.lastname<d2.lastname) return 1;
          else if (d1.lastname==d2.lastname) return 0;
          else return -1;
        })
        break;
      }
      case "SA":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.specialty>d2.specialty) return 1;
          else if (d1.specialty==d2.specialty) return 0;
          else return -1;
        })
        break;
      }
      case "SD":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.specialty<d2.specialty) return 1;
          else if (d1.specialty==d2.specialty) return 0;
          else return -1;
        })
        break;
      }
    }


  }

  search() {
    this.doctorService.getAllDoctors().subscribe((doctors:Doctor[])=>{
      if (this.name!=""){
        this.name = this.name.toLowerCase();
        doctors = doctors.filter((d)=>{
          return d.name.toLowerCase().includes(this.name, 0);
        })
      }
      if (this.lastname!=""){
        this.lastname = this.lastname.toLowerCase();
        doctors = doctors.filter((d)=>{
          return d.lastname.toLowerCase().includes(this.lastname, 0);
        })
      }
      if (this.specialty!=""){
        this.specialty = this.specialty.toLowerCase();
        doctors = doctors.filter((d)=>{
          return d.specialty.toLowerCase().includes(this.specialty, 0);
        })
      }
      this.allDoctors = doctors;
      this.allDoctors.forEach((d)=>{
        d.profilePhoto = "http://localhost:4000/uploads/" + d.profilePhoto;
      })
    })
    
  }


}
