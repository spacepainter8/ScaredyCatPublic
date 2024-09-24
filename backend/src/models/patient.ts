import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Patient = new Schema({
    username: {
        type:String
    },
    password: {
        type:String
    },
    name: {
        type:String
    },
    lastname: {
        type:String
    },
    address: {
        type:String
    },
    phone: {
        type: String
    },
    email: {
        type:String
    },
    id: {
        type: Number
    },
    profilePhoto:{
        type:String
    }
})

export default mongoose.model('Patient', Patient, 'patients');