import express from 'express';
import { DoctorController } from '../controllers/doctor.controller';

const sharp = require('sharp');
const multer = require('multer');
const SharpMulter = require('sharp-multer');

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {cb(null, 'uploads');},
    imageOptions:{
        fileFormat:'jpg',
        resize: { 
            width:300, height:300
        }
    },
    filename: (req, file, cb) => {cb(null, Date.now() + ' - ' + file.originalname)}
})

const upload = multer({
    storage:imageStorage
})



const doctorRouter = express.Router();

doctorRouter.route('/loginDoctor').post(
    (req, res) => new DoctorController().login(req, res)
)

doctorRouter.route('/changePassword').post(
    (req, res) => new DoctorController().changePassword(req, res)
)

doctorRouter.route('/getAllDoctors').get(
    (req, res) => new DoctorController().getAllDoctors(req, res)
)

doctorRouter.route('/getOneDoctor').post(
    (req,  res) => new DoctorController().getOneDoctor(req, res)
)

doctorRouter.route('/scheduleExamination').post(
    (req, res) => new DoctorController().scheduleExamination(req, res)
)

doctorRouter.route('/getAllExaminationsForDoctor').post(
    (req, res) => new DoctorController().getAllExaminationsForDoctor(req, res)
)

doctorRouter.route('/updateDoctor').post(
    (req, res) => new DoctorController().updateDoctor(req, res)
)

doctorRouter.route('/updateDoctorWPicture').post(
 upload.single('chosenImage'), (req, res) => {
        new DoctorController().updateDoctorWPicture(req, res)
    }
)

doctorRouter.route('/getPossibleExaminations').post(
    (req, res) => new DoctorController().getPossibleExaminations(req, res)
)

doctorRouter.route('/chooseExaminations').post(
    (req, res) => new DoctorController().chooseExaminations(req, res)
)

doctorRouter.route('/cancelAndExplain').post(
    (req, res) => new DoctorController().cancelAndExplain(req, res)
)

doctorRouter.route('/requestExamination').post(
    (req, res) => new DoctorController().requestExamination(req, res)
)

doctorRouter.route('/insertFreeTime').post(
    (req, res) => new DoctorController().insertFreeTime(req, res)
)

doctorRouter.route('/getFreeTimeForDoctor').post(
    (req, res) => new DoctorController().getFreeTimeForDoctor(req, res)
)

doctorRouter.route('/deleteDoctor').post(
    (req, res) => new DoctorController().deleteDoctor(req, res)
)

doctorRouter.route('/register').post(
    upload.single('chosenImage'), (req, res)=>{
        new DoctorController().register(req, res)
    }
)

export default doctorRouter;