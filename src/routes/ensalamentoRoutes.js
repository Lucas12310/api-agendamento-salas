import express from 'express';
import ensalamentoController from '../controllers/ensalamentoController.js';
import authMiddleware from '../middlewares/authentication.js';
import errorHandler from '../middlewares/errorHandler.js';

const router = express.Router();

router.post('/ensalamento', authMiddleware, ensalamentoController.inserir, errorHandler);
router.delete('/ensalamento', authMiddleware, ensalamentoController.deletar);
    
export default router;