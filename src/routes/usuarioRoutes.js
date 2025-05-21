import express from "express";
import UsuarioController from "../controllers/usuarioController.js";
import authMiddleware from "../middlewares/authentication.js";
import errorHandler from "../middlewares/errorHandler.js";

const router = express.Router();

router.get('/usuario', authMiddleware, UsuarioController.listar, errorHandler);
router.post('/usuario',UsuarioController.inserir, errorHandler);
router.patch('/usuario/:id', authMiddleware,UsuarioController.atualizar, errorHandler);
router.delete('/usuario/:id', authMiddleware,UsuarioController.excluir, errorHandler);

export default router;