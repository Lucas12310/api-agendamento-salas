import UsuarioRepository from '../repository/usuarioRepository.js';
import UsuarioSchema from '../schema/usuarioSchema.js';
import Hash from '../utils/hash.js';

class UsuarioService {
    static async listar(filtro, page = 1, limit = 10) {
        const validatedFilter = UsuarioSchema.usuarioFilterSchema.parse(filtro);
        const response = await UsuarioRepository.findAll(validatedFilter, page, limit);
        return response;
    }

    static async inserir(data) {
        const validatedData = UsuarioSchema.usuarioCreateSchema.parse(data);
        const emailExists = await UsuarioRepository.findByEmail(data.email);
        if (emailExists) throw new Error('Este email já está em uso');
        const hashedPassword = await Hash.gerarHashSenha(data.senha);
        validatedData.senha = hashedPassword;
        const response = await UsuarioRepository.create(validatedData);
        return response;
    }

    static async atualizar(id, data) {
        const validatedId = UsuarioSchema.usuarioIdSchema.parse(id);
        const validatedUser = await UsuarioRepository.findById(validatedId.id);
        const validatedData = UsuarioSchema.usuarioUpdateSchema.parse(data);
        
        if (validatedData.senha != null) {
            const hashedPassword = await Hash.gerarHashSenha(data.senha);
            validatedData.senha = hashedPassword
        }
        const response = await UsuarioRepository.update(validatedUser.id, validatedData);
        return response;
    }

    static async excluir(id) {
        const validatedId = UsuarioSchema.usuarioIdSchema.parse(id);
        const user = await UsuarioRepository.findById(validatedId.id);
        const response = await UsuarioRepository.delete(user.id);
        return response;
    }
}

export default UsuarioService;