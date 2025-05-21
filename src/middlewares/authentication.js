import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()

const secretKey = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        return res.status(401).send('Acesso negado, token não fornecido.');
    }

    const [, token] = accessToken.split(' ');

    try {
      const decoded = jwt.verify(token, secretKey);  // Verifica e decodifica o token
      req.user = decoded.usuario;  // Atribui o payload do token ao req.user
      return next();  // Continua para o próximo middleware
  } catch (error) {
      return res.status(498).send('Acesso negado devido o token ser inválido.');
  }
};

export default authMiddleware;
