import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Notification = new Schema({
    id: {
        type: Number
    },
    text: {
        type: String
    },
    for: {
        type: Array
    },
    type: {
        type: String
    },
    read: {
        type: Array
    }
})

export default mongoose.model('Notification', Notification, 'notifications');