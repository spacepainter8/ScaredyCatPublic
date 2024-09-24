import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Specialty = new Schema({
   id: {
    type: Number
   },
   name: {
    type: String
   },
   examinations: {
    type: Array
   }
})

export default mongoose.model('Specialty', Specialty, 'specialty');