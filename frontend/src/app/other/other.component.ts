import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ExaminationRequest from '../models/examinationRequests';
import { ManagerService } from '../services/manager.service';
import Specialty from '../models/specialty';
import Examination from '../models/examinations';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {

  constructor(private router:Router, private managerService:ManagerService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('loggedIn')==null || sessionStorage.getItem('type')!="manager"){
      this.router.navigate(['']);
    }
    this.getExaminationRequests();
  }

  examinationRequests:ExaminationRequest[] = [];
  specialties: Specialty[] = [];

  specialty: string = "";
  chosenSpec: Specialty = null;
  chosenExam: number = null;
  exam: Examination = null;

  chosenExamDelete: number = null;
  examDelete: Examination = null;

  promotion:string = "";

  specID:number = null;
  examName:string = "";
  length: number = null;
  price: number = null;

  updateLength = null;
  updatePrice = null;

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  getExaminationRequests(){
    this.managerService.getAllExaminationRequests().subscribe((examReqs:ExaminationRequest[])=>{
      if (examReqs) this.examinationRequests = examReqs;
      this.getAllSpecalites();
    })
  }

  getAllSpecalites(){
    this.managerService.getAllSpecialties().subscribe((specs:Specialty[])=>{
      if (specs) this.specialties = specs;
    })
  }

  accept(id){
    this.managerService.acceptExaminationRequest(id).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("You have successfully accepted the request");
        this.ngOnInit();
      }
      else {
        alert("Error!");
      }
    })
  }

  deny(id){
    this.managerService.denyExaminationRequest(id).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("You have successfully denied the request");
        this.ngOnInit();
      }
      else {
        alert("Error!");
      }
    })
  }

  newSpecialty(){
    if (this.specialty=="") {
      alert("Input the specialty first!");
      return;
    }
    this.specialty = this.specialty.toLowerCase();
    this.managerService.addNewSpecialty(this.specialty).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("You have successfully added a new specialty");
        this.ngOnInit();
        this.specialty = "";
      }
      else if (resp['msg']=='existing'){
        alert ("This specialty already exists");
        return;
      }
      else {
        alert("Error!");
      }
    })
  }

  newExam(){
    if (this.examName=="" || this.price==null){
      alert("Please input all of the data!");
      return;
    }
    if (this.length==null) this.length = 30;

    this.managerService.addNewExam(this.specID, this.examName, this.length, this.price).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("You have successfully added a new examination");
        this.specID = null;
        this.examName = "";
        this.length = null;
        this.price = null;
      }
      else {
        alert("Error!");
      }
    })
  }

  getSpec(){

    this.managerService.getSpecialty(this.specID).subscribe((s:Specialty)=>{
      this.chosenSpec = s;
      console.log(this.chosenSpec);

    })
  }

  updateExam(){
    if (this.updateLength==null) this.updateLength = this.exam.length;
    if (this.updatePrice==null) this.updatePrice = this.exam.price;
    this.managerService.updateExam(this.specID, this.chosenExam, this.updatePrice, this.updateLength).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("Successfully updated the examination");
        this.updateLength = null;this.updatePrice = null;this.chosenExam = null;this.exam = null;
        
      }
      else {
        alert("Error!");
      }
    })
  }

  getExam(){
    this.managerService.getExam(this.specID, this.chosenExam).subscribe((e:Examination)=>{
      this.exam=e;
    })
  }

  getExamDelete(){
    this.managerService.getExam(this.specID, this.chosenExamDelete).subscribe((e:Examination)=>{
      this.examDelete = e;
    })
   
  }

  deleteExam(){
    this.managerService.deleteExam(this.specID, this.chosenExamDelete).subscribe((resp)=>{
      if (resp['msg']=='ok') {
        alert("You have successfully delete that examination");
        this.chosenExamDelete = null;
        this.examDelete = null;
      }
      else alert("Error");
    })
  }

  confirmPromotion(){
    if (this.promotion==""){
      alert("You must insert the promotion first!");
      return;
    }
    else {
      this.managerService.addPromotion(this.promotion).subscribe((resp)=>{
        if (resp['msg']=='ok'){
          alert("You have successfully added a new promotion!");
          this.promotion = "";
        }
        else alert("Error");
      })
    }
  }

 

}
