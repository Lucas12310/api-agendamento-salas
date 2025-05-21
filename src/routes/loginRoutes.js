import express from 'express';
import loginController from '../controllers/loginController.js';
import errorHandler from '../middlewares/errorHandler.js';

const router = express.Router();

router.post('/login', loginController.login, errorHandler);
router.post('/refresh', loginController.refresh, errorHandler);


export default router;