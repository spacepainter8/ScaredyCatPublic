import express from 'express';
import { PatientController } from '../controllers/patient.controller';

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



const patientRouter = express.Router();

patientRouter.route('/loginPatient').post(
    (req, res) => new PatientController().login(req, res)
)

patientRouter.route('/register').post(
    upload.single('chosenImage'), (req, res)=>{

        new PatientController().register(req, res)
    }
)

patientRouter.route('/getOne').post(
    (req, res) => new PatientController().getOne(req, res)
)

patientRouter.route('/deleteProfileImage').post(
    (req, res) => new PatientController().deleteProfileImage(req, res)
)

patientRouter.route('/changePassword').post(
    (req, res) => new PatientController().changePassword(req, res)
)

patientRouter.route('/updatePatient').post(
    (req, res) => new PatientController().updatePatient(req, res)
)

patientRouter.route('/updatePatientWPicture').post(
    upload.single('chosenImage'), (req, res) => {
        new PatientController().updatePatientWPicture(req, res)
    }
)

patientRouter.route('/test').post(
    (req, res) => new PatientController().test(req, res)
)
patientRouter.route('/testOne').post(
    (req, res) => new PatientController().testOne(req, res)
)

patientRouter.route('/getExamsForPatient').post(
    (req, res) => new PatientController().getExamsForPatient(req, res)
)

patientRouter.route('/cancelExamination').post(
    (req, res) => new PatientController().cancelExamination(req, res)
)

patientRouter.route('/getAllNotificationsForPatient').post(
    (req, res) => new PatientController().getAllNotificationsForPatient(req, res)
)

patientRouter.route('/setNotifAsRead').post(
    (req, res) => new PatientController().setNotifAsRead(req, res)
)

patientRouter.route('/getAllPatients').get(
    (req, res) => new  PatientController().getAllPatients(req, res)
)

patientRouter.route('/deletePatient').post(
    (req, res) => new PatientController().deletePatient(req, res)
)


export default patientRouter;