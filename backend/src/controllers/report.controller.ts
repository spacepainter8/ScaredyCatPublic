import * as express from 'express';
import Report from "../models/report";
import Examination from "../models/examination";

export class ReportController {
    getMyReports = (req:express.Request, res: express.Response) => {
        let patientUsername = req.body.patientUsername;
        Report.find({patient:patientUsername}, (err, reports)=>{
            if (err) console.log(err);
            else res.json(reports);
        })
    }

    inputReport = (req:express.Request, res:express.Response) => {
        let exam = req.body.examination;
        let doctor = req.body.doctor;
        let symptoms = req.body.symptoms;
        let diagnosis = req.body.diagnosis;
        let therapy = req.body.therapy;
        let nextExamination = req.body.nextExamination;

       

        Report.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
            if (err) console.log(err);
            else {
                let id = 0;
                if (resp.length!=0) id = resp[0].id+1;
                 Report.collection.insertOne({id:id, doctor:doctor.username, patient:exam.patient, date:exam.date, time:exam.time, doctorName:doctor.name, doctorLastname:doctor.lastname, doctorSpecialty:doctor.specialty, symptoms:symptoms, diagnosis:diagnosis, therapy:therapy, nextExamination:nextExamination, examId:exam.id}, (err, resp)=>{
                    if (err) console.log(err);
                    else {
                        Examination.updateOne({id:exam.id}, {$set:{report:id}}, (err, resp)=>{
                            if (err) console.log(err);
                            else res.json({'msg':'ok'});
                        })
                    }
                })
            }
        })
    }
}