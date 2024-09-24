import * as express from 'express';
import Doctor from "../models/doctor";
import Examination from "../models/examination";
import Specialty from "../models/specialty";
import Notification from "../models/notification";
import ExaminationRequest from "../models/examinationRequest";
import FreeTime from "../models/freeTime";
import RegisterRequest from "../models/registerRequest";
import Patient from "../models/patient";
import Manager from "../models/manager";

const sharp = require('sharp');
const fs = require('fs');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');

async function checkSize(path){
    const image = await sharp(path);
    const metadata = await image.metadata();
    
    if (metadata.width<100 || metadata.width>300 || metadata.heigth<100 || metadata.height>300){
       
        return true;
    }
    else {
        
        return false;
    }
   
}



export class DoctorController {
    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        Doctor.findOne({username:username, password:password}, (err, doctor)=>{
            if (err) console.log(err);
            else res.json(doctor);
        })
    }

    changePassword = (req:express.Request, res:express.Response) => {
       
        let username = req.body.username;
        let oldPass = req.body.oldPass;
        let newPass = req.body.newPass;
        Doctor.findOneAndUpdate({username:username, password:oldPass},{$set:{password:newPass}}, (err, doctor)=>{
            if (err) console.log(err);
            else if (doctor){
                res.json({'msg':'ok'});
            }
            else res.json("bad");
            
        })
    }

    getAllDoctors = (req:express.Request, res:express.Response) => {
        Doctor.find({}, (err, doctors)=>{
            if (err) console.log(err);
            else res.json(doctors);
        })
    }

    getOneDoctor = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        Doctor.findOne({username:username}, (err, doctor)=>{
            if (err) console.log(err);
            else res.json(doctor);
        })
    }

    scheduleExamination = (req:express.Request, res:express.Response) => {
        let drUsername = req.body.drUsername;
        let ptUsername = req.body.ptUsername;
        let examId = req.body.examId;
        let date = req.body.date;
        let time = req.body.time;
        let length = req.body.length;
        let examName = req.body.examName;
        let department = req.body.department;
        let doctorName = req.body.drName;
        let doctorLastname = req.body.drLastname;

        //db.examinations.find().sort({id:-1}).limit(1)
        Examination.find().sort({id:-1}).limit(1).exec((err, exam)=>{
            if (err) console.log(err);
            else {
                let id = 0;
                if (exam.length!=0) id = exam[0].id+1;
                Examination.collection.insertOne({id:id, doctor:drUsername,idOfExam:examId,examName:examName,  patient:ptUsername, date:date, time:time, length:length, notified: "false", report:-1, department:department, doctorName:doctorName, doctorLastname:doctorLastname}, (err, resp)=>{
                    if (err) console.log(err);
                    else res.json({'msg':'ok'});
                })
            }
        })
    }

    getAllExaminationsForDoctor = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        Examination.find({doctor:username}, (err, exams)=>{
            if (err) console.log(err);
            else res.json(exams);
        })
    }

    updateDoctor = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        let name = req.body.name;
        let lastname = req.body.lastname;
        let address = req.body.address;
        let phone = req.body.phone;
        let licence:Number = JSON.parse(req.body.licence);
        let specialty = req.body.specialty;

        if (specialty==null){
            let exams = [];
            Doctor.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, phone:phone, licence:licence}}, (err, resp)=>{
                if (err) console.log(err);
                else {
                    res.json({
                        "msg":'ok'
                    })
                }
            })
        }
        else {
            let exams = [];
            Doctor.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, phone:phone, licence:licence, specialty:specialty, examinations:exams}}, (err, resp)=>{
                if (err) console.log(err);
                else {
                    res.json({
                        "msg":'ok'
                    })
                }
            })
        }

      
    }

    updateDoctorWPicture = (req:any, res:express.Response) => {
        let username = req.body.username;
        let name = req.body.name;
        let lastname = req.body.lastname;
        let address = req.body.address;
        let phone = req.body.phone;
        let licence:Number = JSON.parse(req.body.licence);
        let specialty = req.body.specialty;

        
        sharp("uploads/"+req.file.filename).resize(300, 300).toFile("uploads/"+"-r"+req.file.filename, (err)=>{
            if (err) console.log(err);
        });

        let profilePhoto = "-r"+req.file.filename;
        checkSize(req.file.path).then((val)=>{
            if (val==true){
                res.json({'msg':'badDim', path:req.file.path});
                return;
            }
            else {
                if (specialty==null){
                    Doctor.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, phone:phone, licence:licence, profilePhoto:profilePhoto}}, (err, resp)=>{

                        if (err) console.log(err);
                        else {
                            res.json({
                                "msg":'ok'
                            })
                        }
                    })
                }
                else {
                    console.log(specialty);
                    let exams = [];
                    Doctor.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, phone:phone, licence:licence, specialty:specialty, profilePhoto:profilePhoto, exminations:exams}}, (err, resp)=>{

                        if (err) console.log(err);
                        else {
                            res.json({
                                "msg":'ok'
                            })
                        }
                    })
                }
              
            }
        })
    }

    getPossibleExaminations = (req:express.Request, res:express.Response) => {
        let specialty = req.body.specialty;

        Specialty.findOne({name:specialty}, (err, s)=> {
            if (err) console.log(err);
            else if (s) res.json(s.examinations);
        })


    }

    chooseExaminations = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        let examinations = req.body.examinations;
        Doctor.findOneAndUpdate({username:username}, {$set:{examinations:examinations}}, (err, resp)=>{
            if (err) console.log(err);
            else res.json({'msg':'ok'});
        })
    }
    
    cancelAndExplain = (req:express.Request, res: express.Response) => {
        let exam = req.body.exam;
        let reason = req.body.reason;
        Examination.findOneAndRemove({id:exam.id}, (err, resp)=>{
            if (err) console.log(err);
            else {
                Notification.find().sort({id:-1}).limit(1).exec((err, resp)=>{
                    if (err) console.log(err);
                    else {
                        let id = 0;
                if (resp.length!=0) id = resp[0].id+1;
                let forArray: Array<String> = [];
                        forArray.push(exam.patient);

                        let arr: Array<Boolean> = [];
                        Notification.collection.insertOne({id:id, text:reason, for:forArray, type:"Cancellation", read:arr}, (err, resp)=>{
                            if (err) console.log(err);
                            else res.json({'msg':'ok'});
                        })
                    }
                })
            }
        })
    }

    requestExamination = (req:express.Request, res:express.Response) => {
        let doctor = req.body.doctor;
        let specialty = req.body.specialty;
        let examination = req.body.examination;
        let length = req.body.length;
        let price = req.body.price;

        ExaminationRequest.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
            if (err) console.log(err);
            else {
                let id = 0;
                if (resp.length!=0) id = resp[0].id+1;
                ExaminationRequest.collection.insertOne({id:id, doctor:doctor, specialty:specialty, examination:examination, length:length, price:price}, (err, resp)=>{
                    if (err) console.log(err);
                    else res.json({'msg':'ok'});
                })
            }
        })
    }

    insertFreeTime = (req:express.Request, res:express.Response) => {
        let doctor = req.body.doctor;
        let start = req.body.start;
        let end = req.body.end;

        FreeTime.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
            if (err) console.log(err);
            else {
                let id = 0;
                if (resp.length!=0) id = resp[0].id+1;
                FreeTime.collection.insertOne({id:id, doctor:doctor, start:start, end:end}, (err, resp)=>{
                    if (err) console.log(err);
                    else res.json({'msg':'ok'});
                })
            }
        })
    }

    getFreeTimeForDoctor = (req:express.Request, res:express.Response) => {
        let doctor = req.body.doctor;

        FreeTime.find({doctor:doctor}, (err, freetimes)=>{
            if (err) console.log(err);
            else res.json(freetimes);
        })
    }

    deleteDoctor = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        Doctor.findOneAndRemove({username:username}, (err, resp)=>{
            if (err) console.log(err);
            else {
                res.json({'msg':'ok'});
            }
        })
    }

    register = (req:any, res:express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        let name = req.body.name;
        let lastname = req.body.lastname;
        let address = req.body.address;
        let phone = req.body.phone;
        let email = req.body.email;
        let profilePhoto = "default-avi.png";
        let licence = JSON.parse(req.body.licence);
        let specialty = req.body.specialty;
        let department = req.body.department;

     

        RegisterRequest.find({status:"Denied", $or:[{username:username}, {email:email}]}, (err, resp)=>{
            
            if (err) console.log(err);
            else if (resp.length!=0){
               
                res.json({'msg':'denied'});
            }
            else {
                if (req.file){
                    sharp("uploads/"+req.file.filename).resize(300, 300).toFile("uploads/"+"-r"+req.file.filename, (err)=>{
                        if (err) console.log(err);
                    });
                    
                    profilePhoto = "-r"+req.file.filename;
                    checkSize(req.file.path).then((val)=>{
                        if (val==true){     
                            res.json({'msg':'badDim', path:req.file.path});
                            return;
                        }
                        else {
                            Patient.find({$or:[{username:username}, {email:email}]}, (err, resp)=>{
                              
                                if (err) console.log(err);
                                else if (resp.length!=0){
                                    console.log("Patient");
                                    res.json({'msg':'existing'});
                                    return;
                                }
                                else {
                                    Doctor.find({$or:[{username:username}, {email:email}]}, (err, resp)=>{
                                        
                                        if (err) console.log(err);
                                        else if (resp.length!=0) {
                                            console.log("Doctor");
                                            res.json({'msg':'existing'});
                                            return;
                                        }
                                        else {
                                            Manager.find({$or:[{username:username}, {email:email}]}, (err, resp)=>{
                                                if (err) console.log(err);
                                                else if (resp.length!=0) {
                                                    console.log("Manager");
                                                    res.json({'msg':'existing'});
                                                    return;
                                                }
                                                else {
                                                    Doctor.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
                                                        if (err) console.log(err);
                                                        else {
                                                            let id = 0;
                if (resp.length!=0) id = resp[0].id+1;
                Doctor.collection.insertOne({username:username, password:password, name:name, lastname:lastname, address:address, phone:phone, email:email, licence:licence, id:id, profilePhoto:profilePhoto, specialty:specialty, department:department, examinations:[]}, (err, resp)=>{
                                                                if (err) console.log(err);
                                                                else res.json({'msg':'ok'});
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    Patient.find({$or:[{username:username}, {email:email}]}, (err, resp)=>{
                     
                        if (err) console.log(err);
                        else if (resp.length!=0){
                            res.json({'msg':'existing'});
                            return;
                        }
                        else {
                            Doctor.find({$or:[{username:username}, {email:email}]}, (err, resp)=>{
                                
                                if (err) console.log(err);
                                else if (resp.length!=0) {
                                    res.json({'msg':'existing'});
                                    return;
                                }
                                else {
                                    Manager.find({$or:[{username:username}, {email:email}]}, (err, resp)=>{
                                        if (err) console.log(err);
                                        else if (resp.length!=0) {
                                            res.json({'msg':'existing'});
                                            return;
                                        }
                                        else {
                                            Doctor.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
                                                if (err) console.log(err);
                                                else {
                                                    let id = 0;
                if (resp.length!=0) id = resp[0].id+1;
                Doctor.collection.insertOne({username:username, password:password, name:name, lastname:lastname, address:address, phone:phone, email:email, licence:licence, id:id, profilePhoto:profilePhoto, specialty:specialty, department:department, examinations:[]}, (err, resp)=>{
                                                        if (err) console.log(err);
                                                        else res.json({'msg':'ok'});
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })

    }


}