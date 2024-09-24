import express from 'express';
import { ManagerController } from '../controllers/manager.controller';


const managerRouter = express.Router();

managerRouter.route('/login').post(
    (req, res) => new ManagerController().login(req, res)
)


managerRouter.route('/changePassword').post(
    (req, res) => new ManagerController().changePassword(req, res)
)

managerRouter.route('/getAllExaminationRequests').get(
    (req, res) => new ManagerController().getAllExaminationRequests(req, res)
)

managerRouter.route('/acceptExaminationRequest').post(
    (req, res) => new ManagerController().acceptExaminationRequest(req, res)
)

managerRouter.route('/denyExaminationRequest').post(
    (req, res) => new ManagerController().denyExaminationRequest(req, res)
)

managerRouter.route('/addNewSpecialty').post(
    (req, res) => new ManagerController().addNewSpecialty(req, res)
)

managerRouter.route('/getAllSpecialties').get(
    (req, res) => new ManagerController().getAllSpecialties(req, res)
)

managerRouter.route('/addNewExam').post(
    (req, res) => new ManagerController().addNewExam(req, res)
)

managerRouter.route('/getSpecialty').post(
    (req, res) => new ManagerController().getSpecialty(req, res)
)

managerRouter.route('/getExam').post(
    (req, res) => new ManagerController().getExam(req, res)
)

managerRouter.route('/updateExam').post(
    (req, res) => new ManagerController().updateExam(req, res)
)

managerRouter.route('/deleteExam').post(
    (req, res) => new ManagerController().deleteExam(req, res)
)

managerRouter.route('/addPromotion').post(
    (req, res) => new ManagerController().addPromotion(req, res)
)

export default managerRouter;