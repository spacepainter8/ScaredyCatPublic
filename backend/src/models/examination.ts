import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Examination = new Schema({
    id:{
        type: Number
    },
    doctor: {
        type: String
    },
    idOfExam: {
        type: Number
    },
    patient: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type:String
    },
    length: {
        type: Number
    },
    notified: {
        type: String
    },
    report: {
        type:Number 
    },
    department: {
        type: String
    },
    doctorLastname: {
        type: String
    },
    doctorName: {
        type: String
    }
})

export default mongoose.model('Examination', Examination, 'examinations');