import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http:HttpClient) { }

 
  url = "http://localhost:4000/patient";
  

  login(username, password, type){
    const data = {
      username:username,
      password:password,
      type:type
    }
    return this.http.post(`${this.url}/loginPatient`, data);
  }

  register(fd:FormData){
    return this.http.post(`${this.url}/register`, fd);
  }

  getOnePatient(username){
    const data = {
      username:username
    }
    return this.http.post(`${this.url}/getOne`, data);
  }

  deleteProfileImage(path){
    const data = {
      path:path
    }

    return this.http.post(`${this.url}/deleteProfileImage`, data);
  }

  changePassword(username, oldPass, newPass){
    const data = {
      username:username,
      oldPass:oldPass,
      newPass:newPass
    }
    return this.http.post(`${this.url}/changePassword`, data);
  }

  updatePatient (username, name, lastname, address, email, phone){
    const data = {
      username:username,
      name:name,
      lastname:lastname,
      address:address,
      email:email,
      phone:phone
    }
    return this.http.post(`${this.url}/updatePatient`, data);
  }

  updatePatientWPicture(fd:FormData){
    return this.http.post(`${this.url}/updatePatientWPicture`, fd);
  }

  test(reports, email){
    const data =  {
      table:reports,
      email:email
    }
    return this.http.post(`${this.url}/test`, data);
  }

  testOne(report, email){
    const data =  {
      report:report,
      email:email
    }
    return this.http.post(`${this.url}/testOne`, data);
  }

  getExamsForPatient(username){
    const data = {
      username:username
    }
    return this.http.post(`${this.url}/getExamsForPatient`, data);
  }

  cancelExamination (id){
    const data = {
      id:id
    }
    return this.http.post(`${this.url}/cancelExamination`, data);
  }

  getAllNotificationsForPatient(patient){
    const data = {
      patient:patient
    }
    return this.http.post(`${this.url}/getAllNotificationsForPatient`, data);
  }

  setNotifAsRead(id, username){
    const data = {
      id:id,
      username: username
    }
    return this.http.post(`${this.url}/setNotifAsRead`, data);
  }

  getAllPatients(){
    return this.http.get(`${this.url}/getAllPatients`)
  }

  deletePatient(username){
    const data = {
      username:username
    }
    return this.http.post(`${this.url}/deletePatient`, data);
  }
}
