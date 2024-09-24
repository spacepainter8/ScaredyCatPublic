import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import userRouter from './routers/doctor.router';
import doctorRouter from './routers/doctor.router';
import patientRouter from './routers/patient.doctor';
import managerRouter from './routers/manager.router';
import exp from 'constants';
import reportRouter from './routers/report.router';
import { DoctorController } from './controllers/doctor.controller';
import FreeTime from "./models/freeTime";
import Examination from "./models/examination";
import Notification from "./models/notification";
import registerRequestRouter from './routers/registerRequest.router';

const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/theclinic');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('db connection ok')
    
})

const router = express.Router();
router.use('/doctor', doctorRouter);
router.use('/patient', patientRouter);
router.use('/manager', managerRouter);
router.use('/report', reportRouter);
router.use('/registerRequest', registerRequestRouter);

app.use('/', router)
app.use("/uploads", express.static('uploads'));
app.use("/pdfs", express.static('pdfs'));


app.listen(4000, () => console.log(`Express server running on port 4000`));



cron.schedule('0 * * * *', ()=>{
    Examination.find({notified:"false"}, (err, exams)=>{
        if (err) console.log(err);
        else {
            Notification.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
                if (err) console.log(err);
                else {
                    let id = 0;
                    if (resp.length!=0) id = resp[0].id;
                    exams.forEach((e)=>{
                        let date = Date.parse(e.date)-2*60*60*1000;
                        let hours = Number.parseInt(e.time[0]+e.time[1]);
                        let minutes = Number.parseInt(e.time[3]+e.time[4]);
                        let all  = date+(hours*60+minutes)*60*1000;
                        let left = all - Date.now();
                        if (left>=0 && left<=24*60*60*1000){
                            let text = "You have an examination on " + e.date + " at " + e.time;
                            let forAr:Array<String> = [];
                            forAr.push(e.patient);
                            let examId = e.id;
                            id = id+1;
                                    let arr: Array<Boolean> = [];
                                    Notification.collection.insertOne({id:id, text:text, for:forAr, type:"Reminder", read:arr}, (err, resp)=>{
                                        if (err) console.log(err);
                                        else {
                                            Examination.findOneAndUpdate({id:examId}, {$set:{notified:"true"}}, (err, resp)=>{
                                                if (err) console.log(err);
                                            })
                                        }
                                    })
                        }
                    })
                }
            })
            
        }
    })
});

Examination.find({notified:"false"}, (err, exams)=>{
    if (err) console.log(err);
    else {
        Notification.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
            if (err) console.log(err);
            else {
                let id = 0;
                if (resp.length!=0) id = resp[0].id;
                exams.forEach((e)=>{
                    let date = Date.parse(e.date)-2*60*60*1000;
                    let hours = Number.parseInt(e.time[0]+e.time[1]);
                    let minutes = Number.parseInt(e.time[3]+e.time[4]);
                    let all  = date+(hours*60+minutes)*60*1000;
                    let left = all - Date.now();
                    if (left<=24*60*60*1000){
                        let text = "You have an examination on " + e.date + " at " + e.time;
                        let forAr:Array<String> = [];
                        forAr.push(e.patient);
                        let examId = e.id;
                        id = id+1;
                                let arr: Array<Boolean> = [];
                                Notification.collection.insertOne({id:id, text:text, for:forAr, type:"Reminder", read:arr}, (err, resp)=>{
                                    if (err) console.log(err);
                                    else {
                                        Examination.findOneAndUpdate({id:examId}, {$set:{notified:"true"}}, (err, resp)=>{
                                            if (err) console.log(err);
                                        })
                                    }
                                })
                    }
                })
            }
        })
        
    }
})







  