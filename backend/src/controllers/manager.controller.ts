import * as express from 'express';
import Manager from "../models/manager";
import ExaminationRequest from "../models/examinationRequest";
import Specialty from "../models/specialty";
import Examination from '../models/temp';
import Doctor from "../models/doctor";
import Notification from "../models/notification";

export class ManagerController{
    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        Manager.findOne({username:username, password:password}, (err, manager)=>{
            if (err) console.log(err);
            else res.json(manager);
        })
    }

    changePassword = (req:express.Request, res:express.Response) => {
        let username = req.body.username;
        let oldPass = req.body.oldPass;
        let newPass = req.body.newPass;
        Manager.findOneAndUpdate({username:username, password:oldPass},{$set:{password:newPass}}, (err, doctor)=>{
            if (err) console.log(err);
            else if (doctor){
                res.json({'msg':'ok'});
            }
            else res.json("bad");
            
        })
    }

    getAllExaminationRequests = (req:express.Request, res:express.Response) => {
        ExaminationRequest.find({}, (err, resp)=>{
            if (err) console.log(err);
            else res.json(resp);
        })
    }

    acceptExaminationRequest = (req:express.Request, res:express.Response) => {
        let id = req.body.id;
        ExaminationRequest.findOneAndDelete({id:id}, (err, resp)=>{
            if (err) console.log(err);
            else {
                let specialty = resp.specialty;
                let name = resp.examination;
                let length = resp.length;
                let price = resp.price;

                let  e = new Examination();
                e.name = name;
                e.length = length;
                e.price = price;
                let idMAX = -1;
                Specialty.findOne({name:specialty}, (err, resp)=>{
                    if (err) console.log(err);
                    else {
                        resp.examinations.forEach((r)=>{
                            if (r.id>idMAX) idMAX = r.id;
                        })
                        e.id = idMAX+1;
                        Specialty.findOneAndUpdate({name:specialty}, {$push:{examinations:e}}, (err, resp)=>{
                            if (err) console.log(err);
                            else res.json({'msg':'ok'});
                        })
                    }
                })
            }
        })
    }

    denyExaminationRequest = (req:express.Request, res:express.Response) => {
        let id = req.body.id;
        ExaminationRequest.findOneAndDelete({id:id}, (err, resp) => {
            if (err) console.log(err);
            else res.json({'msg':'ok'});
        })
    }

    addNewSpecialty = (req:express.Request, res: express.Response) => {
        let name = req.body.name;

        Specialty.findOne({name:name}, (err, resp)=>{
            if (err) console.log(err);
            else if (resp){
                res.json({'msg':'existing'});
                return;
            }
            else {
                Specialty.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
                    if (err) console.log(err);
                    else {
                        let id = 0;
                        if (resp.length!=0) id = resp[0].id+1;
                        Specialty.collection.insertOne({id:id, name:name, examinations:[]}, (err, resp)=>{
                            if (err) console.log(err);
                            else res.json({'msg':'ok'});
                        })
                    }
                })
            }
        })

        
    }

    getAllSpecialties = (req:express.Request, res:express.Response) => {
        Specialty.find({}, (err, resp)=>{
            if (err) console.log(err);
            else res.json(resp);
        })
    }

    addNewExam = (req:express.Request, res:express.Response) => {
        let specID = req.body.specID;
        let examName = req.body.examName;
        let length = req.body.length;
        let price = req.body.price;
        
         let  e = new Examination();
                e.name = examName;
                e.length = length;
                e.price = price;
                let idMAX = 0;
     
        Specialty.findOne({id:specID}, (err, resp)=>{
                    if (err) console.log(err);
                    else {
                        resp.examinations.forEach((r)=>{
                            if (r.id>idMAX) idMAX = r.id;
                        })
                        e.id = idMAX+1;
                        Specialty.findOneAndUpdate({id:specID}, {$push:{examinations:e}}, (err, resp)=>{
                            if (err) console.log(err);
                            else res.json({'msg':'ok'});
                        })
                    }
                })
        
    }

    getSpecialty = (req:express.Request, res:express.Response) => {
        let specid = req.body.specid;
        Specialty.findOne({id:specid}, (err, resp)=>{
            if (err) console.log(err);
            else res.json(resp);
        })
    }

    getExam = (req:express.Request, res:express.Response) => {
        let specId = req.body.specId;
        let examId = req.body.examId;
        
        Specialty.findOne({id:specId}, (err, resp)=>{
            if (err) console.log(err);
            else {
                let exam = new Examination();
                resp.examinations.forEach((e)=>{
                    if (e.id==examId) exam = e;
                })
                res.json(exam);
            }
        })
    }

    updateExam = (req:express.Request, res:express.Response) => {
        let specId = req.body.specId;
        let examId = req.body.examId;
        let length = req.body.length;
        let price = req.body.price;

        Specialty.findOne({id:specId}, (err, resp)=>{
            if (err) console.log(err);
            else {
                resp.examinations.forEach((e)=>{
                    if (e.id==examId){
                        e.length = length;
                        e.price = price;
                    }
                })
                Specialty.findOneAndUpdate({id:specId}, ({$set:{examinations:resp.examinations}}), (err, resp)=>{
                    if (err) console.log(err);
                    else res.json({'msg':'ok'});
                })
            }
        })
    }

    deleteExam = (req:express.Request, res:express.Response) => {
        let specId = req.body.specId;
        let examId = req.body.examId;

        Specialty.findOne({id:specId}, (err, spec)=>{
            if (err) console.log(err);
            else {
                let newExams = [];
                let examData;
                spec.examinations.forEach((e)=>{
                    if (e.id!=examId) newExams.push(e);
                    else examData = e;
                })
                let specName = spec.name;
                Specialty.findOneAndUpdate({id:specId}, {$set:{examinations:newExams}}, (err, resp)=>{
                    if (err) console.log(err);
                    else {
                        Doctor.find({specialty:specName}, (err, doctors)=>{
                            if (err) console.log(err);
                            else {
                                doctors.forEach((d)=>{
                                    let drExams = [];
                                    d.examinations.forEach((e)=>{
                                        if (e.id!=examId) drExams.push(e);
                                    })
                                    Doctor.findOneAndUpdate({id:d.id}, {$set:{examinations:drExams}}, (err, resp)=>{
                                        if (err) console.log(err);
                                    })
                                })
                                res.json({'msg':'ok'});
                            }
                        })
                    }
                })
            }
        })
    }

    addPromotion = (req:express.Request, res:express.Response) => {
        let text = req.body.text;
        
        Notification.find({}).sort({id:-1}).limit(1).exec((err, notifs)=>{
            if (err) console.log(err);
            else {
                let id = 0;
                if (notifs.length!=0) id=notifs[0].id+1;
                Notification.collection.insertOne({id:id, text:text, for:[], type:"Promotion", read:[]}, (err, resp)=>{
                    if (err) console.log(err);
                    else res.json({'msg':'ok'});
                })
            }
        })
    }


}