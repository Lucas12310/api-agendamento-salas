import AutenticacaoServices from "../../services/loginServices.js";
import Jwt from "jsonwebtoken";
import UsuarioRepository from "../../repository/usuarioRepository.js";
import Hash from "../../utils/hash.js";
import LoginSchema from "../../schema/loginSchema.js";

// Mock das dependências
jest.mock('../../repository/usuarioRepository.js');
jest.mock('../../utils/hash.js');
jest.mock('jsonwebtoken');
jest.mock('../../schema/loginSchema.js');


describe('AutenticacaoServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro quando o usuário não for encontrado', async () => {
    const data = { siape: '1234', senha: 'senhaValida' };

    // Mock do LoginSchema
    LoginSchema.loginSchema.parse.mockReturnValue(data);

    // Mock do UsuarioRepository (usuário não encontrado)
    UsuarioRepository.findAll.mockResolvedValue({ data: [] }); // Retorno com a chave 'data' e array vazio

    // Esperar que o erro seja lançado
    await expect(AutenticacaoServices.login(data)).rejects.toEqual({
      message: 'Usuário não encontrado!',
      code: 400,
    });
  });

  it('deve lançar erro quando o usuário estiver inativo', async () => {
    const data = { siape: '12345', senha: 'senhaValida' };

    // Mock do LoginSchema
    LoginSchema.loginSchema.parse.mockReturnValue(data);

    // Mock do UsuarioRepository (usuário inativo)
    const usuarioMock = [{ id: 1, siape: '12345', ativo: false, senha: 'hashedPassword' }];
    UsuarioRepository.findAll.mockResolvedValue({ data: usuarioMock }); // Retorno com a chave 'data'

    // Esperar que o erro seja lançado
    await expect(AutenticacaoServices.login(data)).rejects.toEqual({
      message: 'Usuário inativo!',
      code: 400,
    });
  });

  it('deve lançar erro quando a senha for inválida', async () => {
    const data = { siape: '12345', senha: 'senhaErrada' };

    // Mock do LoginSchema
    LoginSchema.loginSchema.parse.mockReturnValue(data);

    // Mock do UsuarioRepository (usuário encontrado)
    const usuarioMock = [{ id: 1, siape: '12345', ativo: true, senha: 'hashedPassword' }];
    UsuarioRepository.findAll.mockResolvedValue({ data: usuarioMock }); // Retorno com a chave 'data'

    // Mock do Hash (senha inválida)
    Hash.compararSenha.mockResolvedValue(false);

    // Esperar que o erro seja lançado
    await expect(AutenticacaoServices.login(data)).rejects.toEqual({
      message: 'Senha inválida!',
      code: 400,
    });
  });
});
