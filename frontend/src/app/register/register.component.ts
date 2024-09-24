import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})




export class RegisterComponent implements OnInit {

  constructor(private patientService:PatientService, private router:Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('loggedIn')!=null){
      this.router.navigate(['']);
    }
  }

  username: string = "";
  password: string = "";
  passwordAgain: string = "";
  name: string = "";
  lastname: string = "";
  address: string = "";
  phone: string = "";
  email: string = "";
  message:string = "";

  chosenImage: File = null;
  imgWidth: number;
  imgHeight: number;

  img: any = new Image();


  fileChosen(event:any){

    if (event.target.value){
     
      this.chosenImage = <File> event.target.files[0];
    
    }
  }

  

  register(){
    if (this.username=="" || this.password=="" || this.name=="" || this.lastname=="" || this.address=="" 
    || this.phone=="" || this.email=="" || this.passwordAgain==""){
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
      let fd = new FormData();
      fd.append('username', this.username);
      fd.append('password', this.password);
      fd.append('name', this.name);
      fd.append('lastname', this.lastname);
      fd.append('address', this.address);
      fd.append('phone', this.phone);
      fd.append('email', this.email);
      if (this.chosenImage!=null){
        if (!this.chosenImage.name.match(/\.(jpg|jpeg|png)$/)){
          this.message = "Improper file extension! Only jpg, jpeg, png and gif are allowed.";
          return;
        }
        // sta ako nije ubacena slika
        fd.append('chosenImage', this.chosenImage, this.chosenImage.name)
      }
      this.patientService.register(fd).subscribe((resp)=>{
        if (resp['msg']=='ok'){
          this.username = "";this.password = "";this.passwordAgain="";this.name="";this.lastname="";this.email="";this.address="";
          this.phone = "";this.chosenImage=null;
          this.message = "Congratulations! Your register request has been submitted.";
        }
        else if (resp['msg']=='denied'){
          this.message = "Email or username already used in register request but denied."
        }
        else if (resp['msg']=='existingUsername'){
          this.message = "Username already in use! Try a different one.";
        }
        else if (resp['msg']=='existingEmail'){
          this.message = "Email already in use! Try a different one.";
        }
        else if (resp['msg']=='badDim'){
          this.message = "Image needs to be between 100x100 and 300x300";
          
        }
      })

    }
  }
}
