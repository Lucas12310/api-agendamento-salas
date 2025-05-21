import loginServices from '../services/loginServices.js';
import jwt from 'jsonwebtoken';
import "dotenv/config";

class loginController {

  static login = async (req, res, next) => {
    try {
      const { usuario, accessToken, refreshToken } = await loginServices.login(req.body);

      if (!accessToken || !refreshToken) {
        throw new Error('Falha ao gerar token de acesso');
      }

      // Remover senha do usuário ao enviar resposta
      delete usuario.senha

      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.status(200).json({
        usuario: usuario,
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    } catch (error) {
      next(error);
    }
  };

  static refresh = async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Acesso negado. Refresh token não fornecido' });
      }

      const secretKey = process.env.JWT_SECRET;

      // Verify refresh token
      const decodedToken = jwt.verify(refreshToken, secretKey);

      // Remover senha do usuário ao enviar resposta
      delete decodedToken.usuario.senha

      // Generate new access token
      const accessToken = jwt.sign({ user: decodedToken.usuario }, secretKey, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });

      if (!accessToken) {
        return res.status(403).json({ error: 'Falha ao gerar token' });
      }

      res.status(200).json({
        usuario: decodedToken.usuario,
        accessToken: accessToken});
    } catch (error) {
      res.status(500).json(error);
    }
  };
}
export default loginController;
