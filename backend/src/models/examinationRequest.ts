import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let ExaminationRequest = new Schema({
   id: {
    type: Number
   },
   doctor: {
    type: String
   },
   specialty: {
    type: String
   },
   examination: {
    type: String
   },
   length: {
    type: Number
   },
   price: {
    type: Number
   }
})

export default mongoose.model('ExaminationRequest', ExaminationRequest, 'examinationRequests');