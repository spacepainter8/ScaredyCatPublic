import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Manager = new Schema({
    username: {
        type:String
    },
    password: {
        type:String
    },
    id: {
        type:Number
    },
    email: {
        type:String
    }
})

export default mongoose.model('Manager', Manager, 'managers');