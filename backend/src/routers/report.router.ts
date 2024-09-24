import express from 'express';
import { ManagerController } from '../controllers/manager.controller';
import { ReportController } from '../controllers/report.controller';


const reportRouter = express.Router();

reportRouter.route('/getMyReports').post(
    (req, res) => new ReportController().getMyReports(req, res)
)

reportRouter.route('/inputReport').post(
    (req, res) => new ReportController().inputReport(req, res)
)

export default reportRouter;