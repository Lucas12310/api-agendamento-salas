import express from "express";
import ReservaController from "../controllers/reservaController.js";
import authMiddleware from "../middlewares/authentication.js";
import errorHandler from "../middlewares/errorHandler.js";

const router = express.Router()

router.post('/reserva', authMiddleware,ReservaController.inserir, errorHandler);
router.patch('/reserva/:id',  authMiddleware,ReservaController.atualizar, errorHandler)
router.delete('/reserva/:id', authMiddleware,ReservaController.excluir, errorHandler);
router.get('/reserva', authMiddleware,ReservaController.listar, errorHandler);

export default router;
