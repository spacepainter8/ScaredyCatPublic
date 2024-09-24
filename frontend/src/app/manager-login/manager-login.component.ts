import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerService } from '../services/manager.service';
import Manager from '../models/manager';

@Component({
  selector: 'app-manager-login',
  templateUrl: './manager-login.component.html',
  styleUrls: ['./manager-login.component.css']
})
export class ManagerLoginComponent implements OnInit {

  constructor(private router:Router, private managerService:ManagerService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('loggedIn')!=null){
      this.router.navigate(['']);
    }
  }

  username:string = "";
  password: string = "";
  type: string = "";
  message:string = "";

  login(){
    if (this.username==""){
      this.message = "Please input your username!";
      return;
    }
    else if (this.password==""){
      this.message = "Please input your password!";
      return;
    }
    else {
      this.managerService.login(this.username, this.password).subscribe((manager:Manager)=>{
        if (manager){
          sessionStorage.setItem('loggedIn', this.username);
          sessionStorage.setItem('type', 'manager');
          this.router.navigate(['manager']);
        }
        else {
          this.message="Wrong credentials!";
          return;
        }
      })
    }
  }

}
