import * as express from 'express';
import Patient from "../models/patient";
import RegisterRequest from '../models/registerRequest';
import { bool } from 'sharp';
import Doctor from "../models/doctor";
import Manager from "../models/manager";
import Examination from "../models/examination";
import * as path from 'path';
import Report from "../models/report";
import Notification from "../models/notification";

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

async function pdf (reports) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(reports);
    const pdfBuffer = await page.pdf();

    let date = Date.now();
    let fileName = path.resolve()+"\\pdfs\\" + "test-" + date + ".pdf";

    fs.writeFileSync(fileName, pdfBuffer );
    await browser.close();
    return "test-"+date+".pdf";
}


export class PatientController {
    login = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        Patient.findOne({username:username, password:password}, (err, patient)=>{
            if (err) console.log(err);
            else res.json(patient);
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

        RegisterRequest.find({status:"Denied", $or:[{username:username},{email:email}]}, (err, resp)=>{
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
                            Patient.findOne({username:username}, (err, patient)=>{
                                
                                if (err) console.log(err);
                                else if (patient){
                                    res.json({'msg':'existingUsername'});
                                    return;
                                }
                                else {
                                    Patient.findOne({email:email}, (err, patient)=>{
                                        if (err) console.log(err);
                                        else if (patient){
                                            res.json({'msg':'existingEmail'});
                                            return;
                                        }
                                        else {
                                            Doctor.findOne({username:username}, (err, doctor)=>{
                                                
                                                if (err) console.log(err);
                                                else if (doctor){
                                                    res.json({'msg':'existingUsername'});
                                                    return;
                                                }
                                                else {
                                                    Doctor.findOne({email:email}, (err, doctor)=>{
                                                        if (err) console.log(err);
                                                        else if (doctor){
                                                            res.json({'msg':'existingEmail'});
                                                        }
                                                        else {
                                                            Manager.findOne({username:username}, (err, manage)=>{
                                                                if (err) console.log(err);
                                                                else if (manage){
                                                                    res.json({'msg':'existingUsername'});
                                                                    return;
                                                                }
                                                                else {
                                                                    Manager.findOne({email:email}, (err, manager)=>{
                                                                        if (err) console.log(err);
                                                                        else if (manager){
                                                                            res.json({'msg':'existingEmail'});
                                                                            return;
                                                                        }
                                                                        else {
                                                                            RegisterRequest.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
                                                                                if (err) console.log(err);
                                                                                else {
                                                                                    let id = 0;
                                                                                    if (resp.length!=0) id = resp[0].id+1;
                                                                                     RegisterRequest.collection.insertOne({id:id, username:username, password:password, name:name, lastname:lastname, address:address,
                                                                                        phone:phone, email:email, profilePhoto:profilePhoto, status:'Pending'}, (err, resp)=>{
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
                                       
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    Patient.findOne({username:username}, (err, patient)=>{
                        
                        if (err) console.log(err);
                        else if (patient){
                            res.json({'msg':'existingUsername'});
                            return;
                        }
                        else {
                            Patient.findOne({email:email}, (err, patient)=>{
                                if (err) console.log(err);
                                else if (patient){
                                    res.json({'msg':'existingEmail'});
                                    return;
                                }
                                else {
                                    Doctor.findOne({username:username}, (err, doctor)=>{
                                        
                                        if (err) console.log(err);
                                        else if (doctor){
                                            res.json({'msg':'existingUsername'});
                                            return;
                                        }
                                        else {
                                            Doctor.findOne({email:email}, (err, doctor)=>{
                                                if (err) console.log(err);
                                                else if (doctor){
                                                    res.json({'msg':'existingEmail'});
                                                }
                                                else {
                                                    Manager.findOne({username:username}, (err, manage)=>{
                                                        if (err) console.log(err);
                                                        else if (manage){
                                                            res.json({'msg':'existingUsername'});
                                                            return;
                                                        }
                                                        else {
                                                            Manager.findOne({email:email}, (err, manager)=>{
                                                                if (err) console.log(err);
                                                                else if (manager){
                                                                    res.json({'msg':'existingEmail'});
                                                                    return;
                                                                }
                                                                else {
                                                                    RegisterRequest.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
                                                                        if (err) console.log(err);
                                                                        else {
                                                                            let id = 0;
                if (resp.length!=0) id = resp[0].id+1;
                RegisterRequest.collection.insertOne({id:id, username:username, password:password, name:name, lastname:lastname, address:address,
                                                                                phone:phone, email:email, profilePhoto:profilePhoto, status:'Pending'}, (err, resp)=>{
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
                               
                            })
                        }
                    })
                }
            }
        })


     
       
       
        
        
    }

  

    test = (req:express.Request, res:express.Response) => {
        let reports = req.body.table;   
        let email  = req.body.email;     
        let table = "";
        reports.forEach((r)=>{
            table+="Date: " + r.date;
            table+="<br>Time: " + r.time;
            table+="<br>Doctor: " + r.doctorName + " " + r.doctorLastname+", " + r.doctorSpecialty;
            table+="<br>Symptoms: " + r.symptoms;
            table+="<br>Diagnosis: " + r.diagnosis;
            table+="<br>Therapy: " + r.therapy;
            table+="<br>Date of next examination: " + r.nextExamination;
            table+="<br>========<br><br>";
        })

        let link = "";
       
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: "8klinika8@gmail.com",
                pass: "cxizgtgpkwpkfxfe"
            },
            tls: {
                rejectUnauthorized: false
            }
        });

      


       (async () => {
        let hm = (await pdf(table));
        hm = "http://localhost:4000/pdfs/" + hm;
        
        let img = await qrcode.toDataURL(hm);
        let html = "<img src='"+img+"'>";
        const mailOptions = {
            from: "8klinika8@gmail.com",
            to: email,
            subject: "Report from the Clinic",
            text:"You can find your pdf here -> " + hm,
            attachments: [
                {
                    filename:'QRcode.jpg',
                    content: img.split("base64,")[1],
                    encoding:'base64'
                }
            ]
            
        };
      
        console.log(mailOptions);

        transporter.sendMail(mailOptions, (error, info)=>{
            if (error) console.log(error);
            else res.json("haha");
        })

        

         })()


         
       

      

       
       
       
    }

    testOne = (req:express.Request, res:express.Response) => {
        let r = req.body.report;
        let email = req.body.email;
        let table = "";
        table+="Date: " + r.date;
        table+="<br>Time: " + r.time;
        table+="<br>Doctor: " + r.doctorName + " " + r.doctorLastname+", " + r.doctorSpecialty;
        table+="<br>Symptoms: " + r.symptoms;
        table+="<br>Diagnosis: " + r.diagnosis;
        table+="<br>Therapy: " + r.therapy;
        table+="<br>Date of next examination: " + r.nextExamination;
        table+="<br>========<br><br>";
        
       const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: "8klinika8@gmail.com",
                pass: "cxizgtgpkwpkfxfe"
            },
            tls: {
                rejectUnauthorized: false
            }
        });

      


       (async () => {
        let hm = (await pdf(table));
        hm = "http://localhost:4000/pdfs/" + hm;
        
        let img = await qrcode.toDataURL(hm);
        let html = "<img src='"+img+"'>";
        const mailOptions = {
            from: "8klinika8@gmail.com",
            to: email,
            subject: "Report from the Clinic",
            text:"You can find your pdf here -> " + hm,
            attachments: [
                {
                    filename:'QRcode.jpg',
                    content: img.split("base64,")[1],
                    encoding:'base64'
                }
            ]
            
        };
      
        console.log(mailOptions);

        transporter.sendMail(mailOptions, (error, info)=>{
            if (error) console.log(error);
            else res.json("haha");
        })

        

         })()
    }


    getOne = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        Patient.findOne({username:username}, (err, patient)=>{
            if (err) console.log(err);
            else res.json(patient);
        })
    }

    deleteProfileImage = (req:express.Request, res:express.Response) => {

       let path = req.body.path;
       fs.unlink(path, (err)=>{
            if (err) console.log(err);
            else (res.json("ok"));
        })
       
    }

    changePassword = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        let oldPass = req.body.oldPass;
        let newPass = req.body.newPass;
        Patient.findOneAndUpdate({username:username, password:oldPass},{$set:{password:newPass}}, (err, doctor)=>{
            if (err) console.log(err);
            else if (doctor){
                res.json({'msg':'ok'});
            }
            else res.json("bad");
            
        })
    }

    updatePatient = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        let name = req.body.name;
        let lastname = req.body.lastname;
        let address = req.body.address;
        let email = req.body.email;
        let phone = req.body.phone;
        if (email!=null){
            
        RegisterRequest.find({status:"Denied", $or:[{username:username}, {email:email}]}, (err, resp)=>{
            if (err) console.log(err);
            else if (resp.length!=0){
                res.json({'msg':'denied'});
                return;
            }
            else {
                Patient.findOne({email:email}, (err, patient)=>{
                    if (err) console.log(err);
                    else if (patient){
                        res.json({'msg':'existingEmail'});
                    }
                    else {
                        Doctor.findOne({email:email}, (err, doctor)=>{
                            if (err) console.log(err);
                            else if (doctor){
                                res.json({'msg':'existingEmail'});
                            }
                            else {
                                Manager.findOne({email:email}, (err, manager)=>{
                                    if (err) console.log(err);
                                    else if (manager){
                                        res.json({'msg':'existingEmail'});
                                    }
                                    else {
                                        Patient.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, email:email, phone:phone}}, (err, resp)=>{
                                            if (err) console.log(err);
                                            else {
                                                res.json({
                                                    "msg":'ok'
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
            Patient.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, phone:phone}}, (err, resp)=>{
                if (err) console.log(err);
                else {
                    res.json({
                        "msg":'ok'
                    })
                }
            })
        }

        
      

    }

    updatePatientWPicture = (req:any, res:express.Response) => {
        let username = req.body.username;
        let name = req.body.name;
        let lastname = req.body.lastname;
        let address = req.body.address;
        let email = req.body.email;
        let phone = req.body.phone;

        if (email!=null){
        RegisterRequest.find({status:"Denied", $or:[{username:username}, {email:email}]}, (err, resp)=>{
            if (err) console.log(err);
            else if (resp.length!=0){
                res.json({'msg':'denied'});
                return;
            }
            else {
                Patient.findOne({email:email}, (err, patient)=>{
                    if (err) console.log(err);
                    else if (patient){
                        res.json({'msg':'existingEmail'});
                    }
                    else {
                        Doctor.findOne({email:email}, (err, doctor)=>{
                            if (err) console.log(err);
                            else if (doctor){
                                res.json({'msg':'existingEmail'});
                            }
                            else {
                                Manager.findOne({email:email}, (err, manager)=>{
                                    if (err) console.log(err);
                                    else if (manager){
                                        res.json({'msg':'existingEmail'});
                                    }
                                    else {
                                        
        
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
                    Patient.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, email:email, phone:phone, profilePhoto:profilePhoto}}, (err, resp)=>{
        
                        if (err) console.log(err);
                        else {
                            res.json({
                                "msg":'ok'
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
        })
        
        }
    else {
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
                
                Patient.findOneAndUpdate({username:username}, {$set:{name:name, lastname:lastname, address:address, phone:phone, profilePhoto:profilePhoto}}, (err, resp)=>{
    
                    if (err) console.log(err);
                    else {
                        res.json({
                            "msg":'ok'
                        })
                    }
                })
            }
        })
    }



    }

    getExamsForPatient = (req:express.Request, res:express.Response) => {
 
        let username = req.body.username;
        Examination.find({patient:username}, (err, exams)=>{
            if (err) console.log(err);
            else res.json(exams);
        })
    }

    cancelExamination = (req:express.Request, res:express.Response) => {
        let id = req.body.id;
        Examination.deleteOne({id:id}, (err, resp)=>{
            if (err) console.log(err);
            else res.json({'msg':'ok'});
        })
    }

    getAllNotificationsForPatient = (req:express.Request, res:express.Response) => {
        let patient = req.body.patient;
        Notification.find({$or:[{for:patient}, {for:{$size:0}}]}, (err, resp)=>{
            if (err) console.log(err);
            else res.json(resp);
        })
    }

    setNotifAsRead = (req:express.Request, res:express.Response) => {
        let id = req.body.id;
        let username = req.body.username;

        Notification.findOneAndUpdate({id:id}, {$push:{read:username}}, (err, resp)=> {
            if (err) console.log(err);
            else res.json({'msg':'ok'});
        })
    }

    getAllPatients = (req:express.Request, res:express.Response) => {
        Patient.find({}, (err, patients)=>{
            if (err) console.log(err);
            else res.json(patients);
        })
    }

    deletePatient = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        Patient.findOneAndRemove({username:username}, (err, resp)=>{
            if (err) console.log(err);
            else {
                res.json({'msg':'ok'});
            }
        })
    }


}
