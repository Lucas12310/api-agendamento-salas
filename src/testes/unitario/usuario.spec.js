import UsuarioService from '../../services/usuarioService.js';
import UsuarioRepository from '../../repository/usuarioRepository.js';
import Hash from '../../utils/hash.js';
import UsuarioSchema from '../../schema/usuarioSchema.js';
import { expect, it, describe, jest } from '@jest/globals';

jest.mock('../../repository/usuarioRepository.js');
jest.mock('../../utils/hash.js');
jest.mock('../../schema/usuarioSchema.js');

describe('UsuarioService', () => {
    describe('listar', () => {
        it('Deve chamar UsuarioRepository.findAll com o filtro validado, página e limite', async () => {
            const filtro = { siape: '123456' };
            const page = 1;
            const limit = 10;
            const validatedFilter = { siape: 123456 };
            const mockedResponse = [{ id: 1, nome: 'Teste', email: 'test@example.com', siape: 123456 }];

            UsuarioSchema.usuarioFilterSchema.parse.mockReturnValue(validatedFilter);
            UsuarioRepository.findAll.mockResolvedValue(mockedResponse);

            await UsuarioService.listar(filtro, page, limit);

            expect(UsuarioSchema.usuarioFilterSchema.parse).toHaveBeenCalledWith(filtro);
            expect(UsuarioRepository.findAll).toHaveBeenCalledWith(validatedFilter, page, limit);
        });
    });

    describe('inserir', () => {
        it('Deve chamar UsuarioRepository.findByEmail e UsuarioRepository.create com os dados validados', async () => {
            const data = { nome: 'Teste', email: 'test@example.com', senha: 'password123', siape: 123456 };
            const validatedData = { ...data, senha: 'hashedPassword' };
            const emailExists = false;
            const hashedPassword = 'hashedPassword';

            UsuarioSchema.usuarioCreateSchema.parse.mockReturnValue(validatedData);
            UsuarioRepository.findByEmail.mockResolvedValue(emailExists);
            Hash.gerarHashSenha.mockResolvedValue(hashedPassword);
            UsuarioRepository.create.mockResolvedValue({ id: 1, ...validatedData });

            await UsuarioService.inserir(data);

            expect(UsuarioSchema.usuarioCreateSchema.parse).toHaveBeenCalledWith(data);
            expect(UsuarioRepository.findByEmail).toHaveBeenCalledWith(data.email);
            expect(Hash.gerarHashSenha).toHaveBeenCalledWith(data.senha);
            expect(UsuarioRepository.create).toHaveBeenCalledWith(validatedData);
        });
    });

    describe('atualizar', () => {
        it('Deve chamar UsuarioRepository.findById, UsuarioSchema.usuarioUpdateSchema.parse, Hash.gerarHashSenha e UsuarioRepository.update com o ID e os dados validados', async () => {
            const id = 123;
            const data = { senha: 'newPassword123' };
            const validatedId = { id };
            const validatedUser = { id };
            const validatedData = { senha: 'hashedPassword' };
            const hashedPassword = 'hashedPassword';

            UsuarioSchema.usuarioIdSchema.parse.mockReturnValue(validatedId);
            UsuarioRepository.findById.mockResolvedValue(validatedUser);
            UsuarioSchema.usuarioUpdateSchema.parse.mockReturnValue(validatedData);
            Hash.gerarHashSenha.mockResolvedValue(hashedPassword);
            UsuarioRepository.update.mockResolvedValue({ id, ...validatedData });

            await UsuarioService.atualizar(id, data);

            expect(UsuarioSchema.usuarioIdSchema.parse).toHaveBeenCalledWith(id);
            expect(UsuarioRepository.findById).toHaveBeenCalledWith(validatedId.id);
            expect(UsuarioSchema.usuarioUpdateSchema.parse).toHaveBeenCalledWith(data);
            if (data.senha) {
                expect(Hash.gerarHashSenha).toHaveBeenCalledWith(data.senha);
            }
            expect(UsuarioRepository.update).toHaveBeenCalledWith(validatedUser.id, validatedData);
        });
    });

    describe('excluir', () => {
        it('Deve chamar UsuarioRepository.findById e UsuarioRepository.delete com o ID validado', async () => {
            const id = 123;
            const validatedId = { id };
            const user = { id };

            UsuarioSchema.usuarioIdSchema.parse.mockReturnValue(validatedId);
            UsuarioRepository.findById.mockResolvedValue(user);
            UsuarioRepository.delete.mockResolvedValue(user);

            await UsuarioService.excluir(id);

            expect(UsuarioSchema.usuarioIdSchema.parse).toHaveBeenCalledWith(id);
            expect(UsuarioRepository.findById).toHaveBeenCalledWith(validatedId.id);
            expect(UsuarioRepository.delete).toHaveBeenCalledWith(user.id);
        });
    });
});
