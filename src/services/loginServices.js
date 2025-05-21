import LoginSchema from '../schema/loginSchema.js';
import UsuarioRepository from '../repository/usuarioRepository.js';
import jwt from 'jsonwebtoken';
import Hash from '../utils/hash.js';
import dotenv from 'dotenv';

dotenv.config();

class AutenticacaoServices {
    static async login(data) {
        // valida os campos siape e senha estão dentro do padrão
        const loginValidated = LoginSchema.loginSchema.parse(data);
        //realiza a busca do usuario pelo seu numero de siape
        const resposta = await UsuarioRepository.findAll({ siape: loginValidated.siape });
        //verifica se retornou o usuario
        if (resposta.data.length == 0) {
            throw {
                message: 'Usuário não encontrado!',
                code: 400
            };
        }

        const usuario = resposta.data[0];
        const secretKey = process.env.JWT_SECRET;

        //verifica se o usuario esta ativo
        if (usuario.ativo == false) {
            throw {
                message: 'Usuário inativo!',
                code: 400
            };
        }
        //comparar o hash
        const ValidatedHash = await Hash.compararSenha(data.senha, usuario.senha);

        if (ValidatedHash == false) {
            throw {
                message: 'Senha inválida!',
                code: 400
            };
        }

        // Remover senha do usuário ao enviar resposta
        delete usuario.senha;

        // criando o token 
        const accessToken = jwt.sign({ usuario }, secretKey, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION  });
        const refreshToken = jwt.sign({ usuario }, secretKey, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION  });

        return { usuario, accessToken, refreshToken };
    }
}

export default AutenticacaoServices;
