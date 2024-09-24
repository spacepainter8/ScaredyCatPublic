import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Doctor = new Schema({
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
    licence: {
        type: Number
    },
    specialty: {
        type:String
    },
    department: {
        type:String
    },
    id: {
        type: Number
    },
    profilePhoto: {
        type: String
    },
    examinations:{
        type:Array
    }
})

export default mongoose.model('Doctor', Doctor, 'doctors');