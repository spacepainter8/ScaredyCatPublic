import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Report = new Schema({
    id: {
        type: Number
    },
    doctor: {
        type: String
    },
    patient: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    doctorName: {
        type: String
    },
    doctorLastname: {
        type: String
    },
    doctorSpecialty: {
        type: String
    },
    symptoms: {
        type: String
    },
    diagnosis: {
        type: String
    },
    therapy: {
        type: String
    },
    nextExamination: {
        type: String
    },
    examId: {
        type: Number
    }
})

export default mongoose.model('Report', Report, 'reports');