import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterRequestService {

  constructor(private http:HttpClient) { }

  url = "http://localhost:4000/registerRequest";


  getPendingRequests(){
    return this.http.get((`${this.url}/getPendingRequests`));
  }

  acceptRequest(request){
    const data = {
      request:request
    }

    return this.http.post(`${this.url}/acceptRequest`, data);
  }

  denyRequest(request){
    const data = {
      request:request
    }

    return this.http.post(`${this.url}/denyRequest`, data);
  }

}
