import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let FreeTime = new Schema({
   id: {
    type: Number
   },
   doctor: {
    type: String
   },
   start: {
    type: String
   },
   end: {
    type: String
   }
})

export default mongoose.model('FreeTime', FreeTime, 'freeTime');