import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let RegisterRequest = new Schema({
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
    profilePhoto:{
        type:String
    },
    status:{
        type:String
    },
    id: {
        type: Number
    }
})

export default mongoose.model('RegisterRequest', RegisterRequest, 'registerRequests');