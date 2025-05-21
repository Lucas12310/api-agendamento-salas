import express from "express";
import SalaController from "../controllers/salacontroller.js";
import authMiddleware from "../middlewares/authentication.js";
import errorHandler from "../middlewares/errorHandler.js";

const router = express.Router();

router.get('/sala', authMiddleware, SalaController.listar, errorHandler);
router.post('/sala', authMiddleware, SalaController.inserir, errorHandler);
router.patch('/sala/:id', authMiddleware, SalaController.atualizar, errorHandler);
router.delete('/sala/:id', authMiddleware, SalaController.excluir, errorHandler);

export default router;
