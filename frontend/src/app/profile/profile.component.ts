import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Patient from '../models/patient';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router:Router, private patientService:PatientService) { }

  ngOnInit(): void {
    let loggedIn = sessionStorage.getItem('loggedIn');
    let type = sessionStorage.getItem('type');
    if (loggedIn==null || type!='patient'){
      this.router.navigate(['']);
    }

    this.getLoggedIn();

  }

  loggedIn: Patient = null;
  primary:boolean = true;
  chosenImage: File = null;
  message: string = "";

  name: string = "";
  lastname: string = "";
  address: string = "";
  email: string = "";
  phone: string = "";

  fileChosen(event:any){
    if (event.target.value){
      this.chosenImage = <File> event.target.files[0];
    }
  }


  getLoggedIn(){
    this.patientService.getOnePatient(sessionStorage.getItem('loggedIn')).subscribe((p:Patient)=>{
      this.loggedIn = p;
      this.loggedIn.profilePhoto = "http://localhost:4000/uploads/" + this.loggedIn.profilePhoto;
    })
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  change(){
    this.primary = false;
    this.ngOnInit();
  }

  save(){

    if (this.email!=""){
      const regex = new RegExp("^.+@[^.@]+(\\.[^.@]+)+$");
      if (!regex.test(this.email)){
        this.message = "Email must be like example@name.com";
        return;
      }
    }

    if (this.phone!="" && !this.phone.match('^[0-9]{10}$')){
      this.message = "Phone number needs to be a set of exactly 10 numbers!";
      return;
    }


    if (this.name=="") this.name=this.loggedIn.name;
    if (this.lastname=="") this.lastname=this.loggedIn.lastname;
    if (this.address=="") this.address = this.loggedIn.address;
    if (this.email=="") this.email = null;
    if (this.phone=="") this.phone = this.loggedIn.phone;
  
    if (this.chosenImage==null){
      this.patientService.updatePatient(this.loggedIn.username, this.name, this.lastname, this.address, this.email, this.phone).subscribe((resp)=>{
        if (resp['msg']=='ok'){
          alert("Congratulations! You have successfully updated your profile!");
          this.message = "";
        }
        else if (resp['msg']=='existingEmail'){
          this.message="Email already in use!";
        }
        else if (resp['msg']=='denied'){
          this.message = "Email or username used in a denied register request";
        }
        
        if (this.message==""){
          this.name="";this.lastname="";this.address="";
          this.email="";this.phone="";
          this.primary = true;
          this.ngOnInit();
        }
      })
    }
    else {
      let fd = new FormData();
      fd.append('username', this.loggedIn.username);
      fd.append('name', this.name);
      fd.append('lastname', this.lastname);
      fd.append('address', this.address);
      if (this.email!=null)fd.append('email', this.email);
      fd.append('phone', this.phone);

      if (!this.chosenImage.name.match(/\.(jpg|jpeg|png)$/)){
        this.message = "Improper file extension! Only jpg, jpeg, png and gif are allowed.";
        return;
      }
      // sta ako nije ubacena slika
      fd.append('chosenImage', this.chosenImage, this.chosenImage.name)
   

      this.patientService.updatePatientWPicture(fd).subscribe((resp)=>{
        if (resp['msg']=='badDim'){
          this.message = "Image needs to be between 100x100 and 300x300";
        }
        else if (resp['msg']=='ok'){
          alert("Congratulations! You have successfully updated your profile!");
          this.message = "";
        }
        else if (resp['msg']=='existingEmail'){
          this.message = "Email already in use!";
        }
        else if (resp['msg']=='denied'){
          this.message = "Email or username used in a denied register request";
        }
        if (this.message==""){
          this.name="";this.lastname="";this.address="";
          this.email="";this.phone="";
          this.primary = true;
          this.chosenImage = null;
          this.ngOnInit();
        }

      })





    }

  



    
   
  }

}
