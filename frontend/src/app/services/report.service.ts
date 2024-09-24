import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }

 
  url = "http://localhost:4000/report";

  getMyReports(patientUsername){
    const data = {
      patientUsername: patientUsername
    }
    return this.http.post(`${this.url}/getMyReports`, data);
  }

  

  inputReport(examination, doctor, symptoms, diagnosis, therapy, nextE){
    const data = {
      examination: examination,
      doctor:doctor,
      symptoms:symptoms,
      diagnosis:diagnosis,
      therapy:therapy,
      nextExamination:nextE
    }

    return this.http.post(`${this.url}/inputReport`, data);
  }
}
