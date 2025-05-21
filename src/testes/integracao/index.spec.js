import request from 'supertest';
import app from '../../app';
import { expect, it, describe, jest } from '@jest/globals';
import * as dotenv from 'dotenv';
dotenv.config();
import errorHandler from '../../middlewares/errorHandler.js';
import getServersInCorrectOrder from '../../docs/config/head.js';

//teste unidade erro 500
import SalaServices from '../../services/salaServices.js';
jest.mock('../../services/salaServices.js')
let token;
it('Login com autenticação jwt', async () => {
  const response = await request(app)
      .post("/login")
      .send({
          siape: 248613,
          senha: "Senha123@"
      })
      .expect(200);
  token = response.body.accessToken;
});

//fim testes unidade erro 500

describe('index.js', () => {
  it('testando se na raiz esta retornando o swagger',async () =>{
    const response = await request(app)
            .get('/');
    expect(response.header['content-type']).toMatch('text/html; charset=utf-8');
  });
  it('testando a função que verifica a url do swagger',async () =>{
    process.env.NODE_ENV = 'production';
    process.env.SWAGGER_DEV_URL = 'http://localhost:7002';
    process.env.SWAGGER_PROD_URL = 'http://localhost:8000';
    const servers = getServersInCorrectOrder();
    expect(servers.swaggerDefinition.servers[0].url).toBe('http://localhost:8000');
    expect(servers.swaggerDefinition.servers[1].url).toBe('http://localhost:7002');
  });
});


describe('authentication.js', () => {
  it('testando erro Acesso negado, token não fornecido.', async () => {
    const response = await request(app)
      .get(`/sala`)
      .set("Content-Type", "application/json");
      //console.log(response.text)
    expect(response.text).toBe("Acesso negado, token não fornecido.")
  });
  it('testando erro Token não encontrado', async () => {
    let tokeninvalid =  123
    const response = await request(app)
      .get('/sala')
      .set('Authorization', `Bearer ${tokeninvalid}`)
      .set('Content-Type', 'application/json');
    expect(response.text).toBe('Acesso negado devido o token ser inválido.');
  });
});

describe('testando erroHandler', () => {
  it('testando o erro 500', async () => {
    const err = new Error('Ocorreu um erro interno no servidor.');
    err.code = 500;  // Simulando um código de erro
    const res = {
      status: jest.fn().mockReturnThis(),  // Mockando o método 'status' e retornando o próprio objeto 'res'
      json: jest.fn()  // Mockando o método 'json'
    };
    const next = jest.fn();
    errorHandler(err, null, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      code: 500,
      message: 'Ocorreu um erro interno no servidor.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});

  



