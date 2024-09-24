import * as express from 'express';

import RegisterRequest from "../models/registerRequest";
import Patient from "../models/patient";


export class RegisterRequestController{

    getPendingRequests = (req:express.Request, res:express.Response) => {
        RegisterRequest.find({status:"Pending"}, (err, reqs)=>{
            if (err) console.log(err);
            else res.json(reqs);
        })
    }

    acceptRequest = (req:express.Request, res: express.Response) => {
        let request = req.body.request;

        RegisterRequest.findOneAndUpdate({id:request.id}, {$set:{status:"Accepted"}}, (err, resp)=>{
            if (err) console.log(err);
            else {
                Patient.find({}).sort({id:-1}).limit(1).exec((err, resp)=>{
                    if (err) console.log(err);
                    else {
                        let id = 0;
                        if (resp.length!=0) id = resp[0].id+1;
                         Patient.collection.insertOne({username:request.username, password:request.password, name:request.name,lastname:request.lastname, address:request.address, phone:request.phone, email:request.email, id:id, profilePhoto:request.profilePhoto }, (err, resp)=>{
                            if (err) console.log(err);
                            else res.json({'msg':'ok'});
                        })
                    }
                })
            }
        })
    }

    denyRequest = (req:express.Request, res:express.Response) => {
        let request = req.body.request;

        RegisterRequest.findOneAndUpdate({id:request.id}, {$set:{status:"Denied"}}, (err, resp)=>{
            if (err) console.log(err);
            else res.json({'msg':'ok'});
        })
    }
}