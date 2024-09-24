import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private http:HttpClient) { }

  url = "http://localhost:4000/manager";

  login(username, password){
    const data = {
      username:username,
      password:password
    };

    return this.http.post(`${this.url}/login`, data);
  
  }

  changePassword(username, oldPass, newPass){
    const data = {
      username:username,
      oldPass:oldPass,
      newPass:newPass
    }
    return this.http.post(`${this.url}/changePassword`, data);
  }

  getAllExaminationRequests(){
    return this.http.get(`${this.url}/getAllExaminationRequests`);
  }

  acceptExaminationRequest(id){
    const data = {
      id:id
    }
    return this.http.post(`${this.url}/acceptExaminationRequest`, data);
  }

  denyExaminationRequest(id){
    const data = {
      id:id
    }
    return this.http.post(`${this.url}/denyExaminationRequest`, data);
  }

  addNewSpecialty(name){
    const data = {
      name:name
    }
    return this.http.post(`${this.url}/addNewSpecialty`, data);
  }

  getAllSpecialties(){
    return this.http.get(`${this.url}/getAllSpecialties`);
  }

  addNewExam(specId, examName, length, price) {
    const data = {
      specID:specId,
      examName:examName,
      length:length,
      price:price
    }

    return this.http.post(`${this.url}/addNewExam`, data);
  }

  getSpecialty(specid){
    const data = {
      specid:specid
    }

    return this.http.post(`${this.url}/getSpecialty`, data);
  }

  getExam(specId, examId){
    const data = {
      specId:specId,
      examId:examId
    }

    return this.http.post(`${this.url}/getExam`, data);
  }

  updateExam(specId, examId, price, length){
    const data = {
      specId:specId,
      examId:examId,
      price:price,
      length:length
    }

    return this.http.post(`${this.url}/updateExam`, data);
  }

  deleteExam(specId, examId){
    const data = {
      specId:specId,
      examId:examId
    }
    return this.http.post(`${this.url}/deleteExam`, data);
  }

  addPromotion(text){
    const data = {
      text:text
    }
    return this.http.post(`${this.url}/addPromotion`, data);
  }
}
