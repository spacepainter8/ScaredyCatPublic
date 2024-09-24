import { Time } from "@angular/common";
import Doctor from "./doctor";

export default class examinationsDB {
    id: number;
    doctor: string;
    idOfExam: number;
    examName: string;
    patient: string;
    date: string;
    time: string;
    length: number;
    notified: string;
    report: number;
    department: string;
    doctorLastname: string;
    doctorName: string;
    doctorObj: Doctor; // this is for examination stuff
    reason: string; // this is for the part where the doctor cancels
    // this is for examinations tab for doctor
    patientName: string;
    patientLastname: string;
}