import AutenticacaoServices from "../../services/loginServices.js";
import loginController from '../../controllers/loginController.js';  // Importe o controller
import { mockRequest, mockResponse } from 'mock-req-res';

jest.mock('../../services/loginServices.js', () => ({
  login: jest.fn()  // Mocka a função login
}));

describe('tokens nulos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('deve lançar erro quando accessToken ou refreshToken forem nulos', async () => {
    // Mocka o retorno do método login para simular accessToken e refreshToken nulos
    AutenticacaoServices.login.mockResolvedValue({
      usuario: { nome: 'Usuário Teste', siape: '123456' },
      accessToken: null,  // Simula que o accessToken é nulo
      refreshToken: null, // Simula que o refreshToken é nulo
    });

    const req = mockRequest({
      body: { siape: '123456', senha: 'senhaValida' }
    });

    const res = mockResponse();
    const next = jest.fn();  // Mocka a função next

    // Chama o controller de login
    await loginController.login(req, res, next);

    // Verifica se o next foi chamado com o erro esperado
    expect(next).toHaveBeenCalledWith(new Error('Falha ao gerar token de acesso'));
  });
});