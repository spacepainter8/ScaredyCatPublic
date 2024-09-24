import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http:HttpClient) { }

 
  url = "http://localhost:4000/doctor";

  login(username, password, type){
    const data = {
      username:username,
      password:password,
      type:type
    }
    return this.http.post(`${this.url}/loginDoctor`, data);
  }

  changePassword(username, oldPass, newPass){
    const data = {
      username:username,
      oldPass:oldPass,
      newPass:newPass
    }
    return this.http.post(`${this.url}/changePassword`, data);
  }

  getAllDoctors(){
    return this.http.get(`${this.url}/getAllDoctors`);
  }

  getOneDoctor(username){
    const data = {
      username:username
    }
    return this.http.post(`${this.url}/getOneDoctor`, data);
  }

  scheduleExamination(drUsername, ptUsername, examId, examName, date, time, length, department, drName, drLastname){
    const data = {
      drUsername: drUsername,
      ptUsername: ptUsername,
      examId: examId,
      examName: examName,
      date: date,
      time: time,
      length: length,
      department: department,
      drName: drName,
      drLastname: drLastname
    }
    return this.http.post(`${this.url}/scheduleExamination`, data);
  }

  getAllExaminationsForDoctor(username){
    const data = {
      username:username
    }
    return this.http.post(`${this.url}/getAllExaminationsForDoctor`, data);
  }

  updateDoctor(username, name, lastname, address, phone, licence, specialty){
    const data = {
      username:username,
      name:name,
      lastname:lastname,
      address:address,
      phone:phone,
      licence:licence,
      specialty:specialty
    }
    return this.http.post(`${this.url}/updateDoctor`, data)
  }

  updateDoctorWPicture(fd:FormData){
    return this.http.post(`${this.url}/updateDoctorWPicture`, fd);
  }

  getPossibleExaminations(specialty){
    const data = {
      specialty: specialty
    }
    return this.http.post(`${this.url}/getPossibleExaminations`, data);
  }

  chooseExaminations(username, examinations){
    const data = {
      username:username,
      examinations:examinations
    }
    return this.http.post(`${this.url}/chooseExaminations`, data);
  }

  cancelAndExplain(exam, reason){
    const data = {
      exam:exam,
      reason:reason
    }
    return this.http.post(`${this.url}/cancelAndExplain`, data);
  }

  requestExamination(doctor, specialty, examination, length, price){
    const data = {
      doctor:doctor,
      specialty:specialty,
      examination:examination,
      length:length,
      price:price
    }
    return this.http.post(`${this.url}/requestExamination`, data);
  }

  insertFreeTime(doctor, start, end){
    const data = {
      doctor:doctor,
      start:start,
      end:end
    }
    return this.http.post(`${this.url}/insertFreeTime`, data);
  }

  getFreeTimeForDoctor(username){
    const data = {
      doctor:username
    }

    return this.http.post(`${this.url}/getFreeTimeForDoctor`, data);
  }

  deleteDoctor(username){
    const data = {
      username:username
    }
    return this.http.post(`${this.url}/deleteDoctor`, data);
  }

  register(fd:FormData){
    return this.http.post(`${this.url}/register`, fd);
  }

 
}
