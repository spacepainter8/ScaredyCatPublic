import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Doctor from '../models/doctor';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  constructor(private router:Router, private doctorService:DoctorService) { }

  ngOnInit(): void {
    this.getAllDoctors();
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='patient'){
      this.router.navigate(['']);
    }
    
  }

  allDoctors: Doctor[] = [];
  sortOption: string = "";
  name: string = "";
  lastname: string = "";
  specialty: string = "";
  department: string = "";




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

  search(){
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
      if (this.department!=""){
        this.department = this.department.toLowerCase();
        doctors = doctors.filter((d)=>{
          return d.department.toLowerCase().includes(this.department, 0);
        })
      }
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
      case "DA":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.department>d2.department) return 1;
          else if (d1.department==d2.department) return 0;
          else return -1;
        })
        break;
      }
      case "DD":{
        this.allDoctors = this.allDoctors.sort((d1, d2)=>{
          if (d1.department<d2.department) return 1;
          else if (d1.department==d2.department) return 0;
          else return -1;
        })
        break;
      }
    }
  }

  doctor(username){
    sessionStorage.removeItem('chosenDr');
    sessionStorage.setItem('chosenDr', username);
    
  }

}
