import express from 'express';
import { RegisterRequestController } from '../controllers/registerRequest.controller';

const registerRequestRouter = express.Router();


registerRequestRouter.route('/getPendingRequests').get(
    (req, res) => new RegisterRequestController().getPendingRequests(req, res)
)

registerRequestRouter.route('/acceptRequest').post(
    (req, res) => new RegisterRequestController().acceptRequest(req, res)
)

registerRequestRouter.route('/denyRequest').post(
    (req, res) => new RegisterRequestController().denyRequest(req, res)
)

export default registerRequestRouter;





