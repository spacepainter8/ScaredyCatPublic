import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Patient from '../models/patient';
import { PatientService } from '../services/patient.service';
import Doctor from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { RegisterRequestService } from '../services/register-request.service';
import RegisterRequest from '../models/registerRequest';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  constructor(private registerRequestService:RegisterRequestService, private router:Router, private patientService:PatientService, private doctorService:DoctorService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('loggedIn')==null || sessionStorage.getItem('type')!="manager"){
      this.router.navigate(['']);
    }
    this.getAllPatients();
  }

  allPatients: Patient[] = [];
  allDoctors: Doctor[] = [];
  pendingRequests: RegisterRequest[] = [];

  chosenImage: File = null;
  patientName: string = "";
  patientLastname: string = "";
  patientAddress: string = "";
  patientEmail: string = "";
  patientPhone: string = "";

  doctorName: string = "";
  doctorLastname: string = "";
  doctorAddress: string = "";
  doctorPhone: string = "";
  doctorLicence: Number = null;
  doctorSpecialty: string = "";

  message: string = "";

  username: string = "";
  password: string = "";
  passwordAgain: string = "";
  name: string = "";
  lastname: string = "";
  address: string = "";
  phone: string = "";
  email: string = "";
  licence: number = null;
  specialty: string = "";
  department: string = "";


  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  getAllPatients(){
    this.patientService.getAllPatients().subscribe((patients:Patient[])=>{
      this.allPatients = patients;
      this.allPatients.forEach((p)=>{
        p.profilePhoto = "http://localhost:4000/uploads/" + p.profilePhoto;
        p.gettingUpdated = false;
      })
      this.getAllDoctors();
    })
  }

  getAllDoctors(){
    this.doctorService.getAllDoctors().subscribe((doctors:Doctor[])=>{
      this.allDoctors = doctors;
      this.allDoctors.forEach((d)=>{
        d.profilePhoto = "http://localhost:4000/uploads/" + d.profilePhoto;
        d.gettingUpdated = false;
      })
      this.getPendingRequests();
    })
  }

update(id){
  this.allPatients.forEach((p)=>{
    if (p.id==id) p.gettingUpdated = true;
  })
  
}

save(id){
  let patient: Patient = null;

  this.allPatients.forEach((p)=>{
    if (p.id==id) patient = p;
  })


  if (this.patientEmail!=""){
    const regex = new RegExp("^.+@[^.@]+(\\.[^.@]+)+$");
    if (!regex.test(this.patientEmail)){
      alert("Email must be like example@name.com");
      return;
    }
  }

  if (this.patientPhone!="" && !this.patientPhone.match('^[0-9]{10}$')){
   alert("Phone number needs to be a set of exactly 10 numbers!");
    return;
  }


  if (this.patientName=="") this.patientName=patient.name;
  if (this.patientLastname=="") this.patientLastname=patient.lastname;
  if (this.patientAddress=="") this.patientAddress = patient.address;
  if (this.patientEmail=="") this.patientEmail = null;
  if (this.patientPhone=="") this.patientPhone = patient.phone;

  if (this.chosenImage==null){
    this.patientService.updatePatient(patient.username, this.patientName, this.patientLastname, this.patientAddress, this.patientEmail, this.patientPhone).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("Congratulations! You have successfully updated your profile!");
        this.patientName="";this.patientLastname="";this.patientAddress="";
        this.patientEmail="";this.patientPhone="";
        this.allPatients.forEach((p)=>{
          if (p.id==id) p.gettingUpdated = false;
        })
        this.ngOnInit();
      }
      else if (resp['msg']=='existingEmail'){
        alert("Email already in use!");
      }
      else if (resp['msg']=='denied'){
        alert("Email used in denied register request!");
      }
    })
  }
  else {
    let fd = new FormData();
    fd.append('username', patient.username);
    fd.append('name', this.patientName);
    fd.append('lastname', this.patientLastname);
    fd.append('address', this.patientAddress);
    if (this.patientEmail!=null)fd.append('email', this.patientEmail);
    fd.append('phone', this.patientPhone);

    if (!this.chosenImage.name.match(/\.(jpg|jpeg|png)$/)){
      alert("Improper file extension! Only jpg, jpeg, png and gif are allowed.");
      return;
    }
    // sta ako nije ubacena slika
    fd.append('chosenImage', this.chosenImage, this.chosenImage.name)
 

    this.patientService.updatePatientWPicture(fd).subscribe((resp)=>{
      if (resp['msg']=='badDim'){
        alert("Image needs to be between 100x100 and 300x300");
      }
      else if (resp['msg']=='ok'){
        alert("Congratulations! You have successfully updated your profile!");
        this.patientName="";this.patientLastname="";this.patientAddress="";
        this.patientEmail="";this.patientPhone="";
        this.chosenImage = null;
        this.allPatients.forEach((p)=>{
          if (p.id==id) p.gettingUpdated = false;
        })
        this.ngOnInit();
      }
      else if (resp['msg']=='existingEmail'){
        alert("Email already in use!");
      }
      else if (resp['msg']=='denied'){
        alert("Email used in denied register request!");
      }
 

    })

  }



  
}


fileChosen(event:any){
  if (event.target.value){
    this.chosenImage = <File> event.target.files[0];
  }
}

delete(username){
  this.patientService.deletePatient(username).subscribe((resp)=>{
    if (resp['msg']=='ok'){
      alert("You have successfully deleted the patient");
      this.ngOnInit();
    }
    else {
      alert("Error");
    }
  })
}

updateD(id){
  this.allDoctors.forEach((d)=>{
    if (d.id==id) d.gettingUpdated = true;
  })
}

saveD(id){
  let doctor: Doctor = null;
  this.allDoctors.forEach((d)=>{
    if (d.id==id) doctor=d;
  })


  if (this.doctorPhone!="" && !this.doctorPhone.match('^[0-9]{10}$')){
    alert("Phone number needs to be a set of exactly 10 numbers!");
    return;
  }


  if (this.doctorName=="") this.doctorName=doctor.name;
  if (this.doctorLastname=="") this.doctorLastname=doctor.lastname;
  if (this.doctorAddress=="") this.doctorAddress = doctor.address;
  if (this.doctorPhone=="") this.doctorPhone = doctor.phone;
  if (this.doctorLicence==null) this.doctorLicence = doctor.licence;
  if (this.doctorSpecialty=="") this.doctorSpecialty = null;
  else this.doctorSpecialty = this.doctorSpecialty.toLowerCase();

  if (this.chosenImage==null){
    this.doctorService.updateDoctor(doctor.username, this.doctorName, this.doctorLastname, this.doctorAddress, this.doctorPhone, this.doctorLicence, this.doctorSpecialty).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        alert("Congratulations! You have successfully updated your profile!");
        this.doctorName="";this.doctorLastname="";this.doctorAddress="";
        this.doctorPhone="";this.doctorLicence=null;this.doctorSpecialty="";this.message="";
        this.chosenImage = null;
        this.allDoctors.forEach((p)=>{
          if (p.id==id) p.gettingUpdated = false;
        })
        this.ngOnInit();
      }
      else alert("Error");
    })
  }
  else {
    let fd = new FormData();
    fd.append('username', doctor.username);
    fd.append('name', this.doctorName);
    fd.append('lastname', this.doctorLastname);
    fd.append('address', this.doctorAddress);
    fd.append('phone', this.doctorPhone);
    fd.append('licence', JSON.stringify(this.doctorLicence));
    if(this.doctorSpecialty!=null)fd.append('specialty', this.doctorSpecialty);


    if (!this.chosenImage.name.match(/\.(jpg|jpeg|png)$/)){
     alert("Improper file extension! Only jpg, jpeg, png and gif are allowed.");
      return;
    }
    // sta ako nije ubacena slika
    fd.append('chosenImage', this.chosenImage, this.chosenImage.name)
 

    this.doctorService.updateDoctorWPicture(fd).subscribe((resp)=>{
      if (resp['msg']=='badDim'){
        alert("Image needs to be between 100x100 and 300x300");
      }
      else if (resp['msg']=='ok'){
        alert("Congratulations! You have successfully updated your profile!");
        this.message = "";
        this.doctorName="";this.doctorLastname="";this.doctorAddress="";
        this.doctorPhone="";this.doctorLicence=null;this.doctorSpecialty="";
        this.chosenImage = null;
        this.allDoctors.forEach((p)=>{
          if (p.id==id) p.gettingUpdated = false;
        })
        this.ngOnInit();

      }
      else alert("Error");

    })





  }
}

deleteD(doctor){
  this.doctorService.deleteDoctor(doctor).subscribe((resp)=>{
    if (resp['msg']=='ok'){
      alert("You have successfully deleted the doctor");
      this.ngOnInit();
    }
    else {
      alert("Error");
    }
  })
}

getPendingRequests(){
  this.registerRequestService.getPendingRequests().subscribe((rs:RegisterRequest[])=>{
    this.pendingRequests = rs;
    this.pendingRequests.forEach((r)=>{
      r.profilePhoto = "http://localhost:4000/uploads/" + r.profilePhoto;
    })
  })
}

accept(id){
  let request:RegisterRequest = null;
  this.pendingRequests.forEach((r)=>{
    if (r.id==id) {
      request = r;
      request.profilePhoto = request.profilePhoto.substring(30, request.profilePhoto.length);

    }
  })
  this.registerRequestService.acceptRequest(request).subscribe((resp)=>{
    if (resp['msg']=='ok'){
      alert("You have successfully accepted this request!");
      this.ngOnInit();
    }
    else {
      alert ("Error");
    }
  })
}

deny(id){
  let request:RegisterRequest = null;
  this.pendingRequests.forEach((r)=>{
    if (r.id==id) {
      request = r;
    }
  })
  this.registerRequestService.denyRequest(request).subscribe((resp)=>{
    if (resp['msg']=='ok'){
      alert("You have successfully denied the request");
      this.ngOnInit();
    }
    else alert("Error!");
  })
}

register(){
  if (this.username=="" || this.password=="" || this.name=="" || this.lastname=="" || this.address=="" 
    || this.phone=="" || this.email=="" || this.passwordAgain=="" || this.licence==null || this.specialty=="" || this.department==""){
      this.message="All fields except for image are required!";
      return;
  }
  else if (this.password!=this.passwordAgain){
    this.message = "Password and Verify Password are different!";
    return;
  }
  else if (this.password.length<8 || this.password.length>14){
    this.message = "Password needs to be between 8 and 14 characters long!";
    return;
  }
  else if (!this.password.match('[A-Z]')){
    this.message = "Password needs to contain an uppercase character!";
    return;
  }
  else if (!this.password.match('[0-9]')){
    this.message = "Password needs to contain a number!";
    return;
  }
  else if (!this.password.match('[^a-zA-Z0-9]')){
    this.message = "Password needs to contain a special character!";
    return;
  }
  else if (!this.password.match('^[a-zA-Z]')){
    this.message = "Password needs to start with a letter!";
    return
  }
  else if (!this.phone.match('^[0-9]{10}$')){
    this.message = "Phone number needs to be a set of exactly 10 numbers!";
    return;
  }

  else {
    const regex = new RegExp("^.+@[^.@]+(\\.[^.@]+)+$");
    if (!regex.test(this.email)){
      this.message = "Email must be like example@name.com";
      return;
    }
    for (let i=0;i<this.password.length;i++){
      if (i!=this.password.length-1 && this.password[i]==this.password[i+1]){
        this.message = "Password can't contain two identical characters in a row!";
        return;
      }
    }
    this.specialty = this.specialty.toLowerCase();
    let fd = new FormData();
    fd.append('username', this.username);
    fd.append('password', this.password);
    fd.append('name', this.name);
    fd.append('lastname', this.lastname);
    fd.append('address', this.address);
    fd.append('phone', this.phone);
    fd.append('email', this.email);
    fd.append('licence', JSON.stringify(this.licence));
    fd.append('specialty', this.specialty);
    fd.append('department', this.department);
    if (this.chosenImage!=null){
      if (!this.chosenImage.name.match(/\.(jpg|jpeg|png)$/)){
        this.message = "Improper file extension! Only jpg, jpeg, png and gif are allowed.";
        return;
      }
      // sta ako nije ubacena slika
      fd.append('chosenImage', this.chosenImage, this.chosenImage.name)
    }

    this.doctorService.register(fd).subscribe((resp)=>{
      if (resp['msg']=='ok'){
        this.username = "";this.password = "";this.passwordAgain="";this.name="";this.lastname="";this.email="";this.address="";
        this.phone = "";this.chosenImage=null;this.licence=null;this.specialty = "";this.department = "";this.message="";
        alert("Congratulations! Your have successfully added a new doctor");
        this.ngOnInit();
      }
      else if (resp['msg']=='denied'){
        this.message = "Email or username already used in register request but denied."
      }
      else if (resp['msg']=='existing'){
        this.message = "Username or email already in use! Try a different one.";
      }
      else if (resp['msg']=='badDim'){
        this.message = "Image needs to be between 100x100 and 300x300";
        
      }
    })
  }




}



}
