import request from 'supertest';
import app from '../../app';
import { expect, it, describe } from '@jest/globals';

describe('Teste de Integração Reserva', () => {

  let token;
  let idvalido;
  let tokenDocente;
  // Autentica e obtém o token antes de executar os testes
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ siape: '169875', senha: 'Senha123@' });
    
    token = loginResponse.body.accessToken;
  });
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ siape: '369874', senha: 'Senha123@' });
    
      tokenDocente = loginResponse.body.accessToken;
  });


  describe('GET /reserva', () => {
    it('Deve listar as reservas com sucesso', async () => {
      const response = await request(app)
        .get('/reserva')
        .set('Authorization', `Bearer ${token}`); // Adiciona o token aqui

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Listado com sucesso!');
      expect(response.body).toHaveProperty('data'); // Verifica que há dados
      expect(response.body.data.length).toBeGreaterThan(0); // Verifica que há dados
    });

    it('Deve retornar dados com base nos filtros', async () => {
      const response = await request(app)
        .get('/reserva?id=2&id_sala=2&id_usuario=2&turma=1ºB Informatica&hora_inicio=2024-01-01T13:00:00.000Z&hora_fim=2024-01-01T13:50:00.000Z&descricao=Aula&id_reservante=2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Listado com sucesso!');
    });
    it('Deve retornar dados com base na data informada', async () => {
      const filtro = { dia: '30-10-2024' };
      const response = await request(app)
        .get('/reserva')
        .query(filtro)
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Listado com sucesso!');
    });
    it('Deve retornar erro 400 com filtros invalidos', async () => {
      const response = await request(app)
        .get('/reserva?id=aaa')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'O campo "id" fornecido não é um número válido.');
    });
    it('Deve retornar erro ao tentar listar reservas pelo id da sala invalido', async () => {
      const response = await request(app)
        .get('/reserva?id_sala=a')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'O campo "id_sala" fornecido não é um número válido.');
    });
    it('Deve retornar erro ao tentar listar reservas pelo id do usuario invalido', async () => {
      const response = await request(app)
        .get('/reserva?id_usuario=a')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'O campo "id_usuario" fornecido não é um número válido.');
    });
    it('Deve retornar erro ao tentar listar reservas pelo id do reservante invalido', async () => {
      const response = await request(app)
        .get('/reserva?id_reservante=a')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'O campo "id_reservante" precisa ser um número inteiro.');
    });
    it('Deve retornar erro ao tentar listar reservas pelo dia invalido', async () => {
      const response = await request(app)
        .get('/reserva?dia=3504-2024')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].message).toBe("O campo 'Dia' deve estar no formato 'DD-MM-YYYY'.");
      
    });

  });

  describe('POST /reserva', () => {
    it('Deve criar uma reserva com sucesso', async () => {
      const reserva = {
        id_sala: 1,
        id_usuario: 1,
        turma: 'Turma A',
        hora_inicio: '2026-10-30T10:00:00.000Z',
        hora_fim: '2026-10-30T14:00:00.000Z',
        descricao: 'Aula de teste',
        id_reservante: 2,
      };

      const response = await request(app)
        .post('/reserva')
        .set('Authorization', `Bearer ${token}`)
        .send(reserva);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Reserva criada com sucesso!');
      expect(response.body.data).toMatchObject(reserva); // Valida os dados criados
      expect(response.headers['content-type']).toMatch(/application\/json/);
      idvalido = response.body.data.id; //pegando o id da reserva criada para usar nos outros testes
    });

    it('Deve retornar erro 400 se faltar campo obrigatório', async () => {
      const reservaIncompleta = {
        id_sala: 1,
        turma: 'Turma B',
      };

      const response = await request(app)
        .post('/reserva')
        .set('Authorization', `Bearer ${token}`)
        .send(reservaIncompleta);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /reserva/:id', () => {
    it('Deve atualizar uma reserva com sucesso', async () => {
      const id = 2; // Assumindo que já exista uma reserva com ID 2 para o teste
      const dadosAtualizacao = {
        turma: 'Turma Atualizada',
        hora_inicio: '2024-10-30T12:00:00.000Z',
        hora_fim: '2024-10-30T13:00:00.000Z',
        id_usuario: 3,
        id_reservante: 3,
      };

      const response = await request(app)
        .patch(`/reserva/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dadosAtualizacao);

        
      expect(response.statusCode).toBe(202);
      expect(response.body).toHaveProperty('message', 'Reserva atualizada com sucesso!');
      expect(response.body.data).toMatchObject(dadosAtualizacao);
    });

    it('Deve retornar erro 400 se a reserva não existir', async () => {
      const response = await request(app)
        .patch('/reserva/9999')
        .set('Authorization', `Bearer ${token}`)
        .send({ turma: 'Turma Inexistente' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Não existe nenhuma reserva com este id: 9999');
    });
    it('Deve retornar que não existe a sala que da alteração da reserva', async () => {
      const id = 2;
      const dadosAtualizacao = {
        id_sala: 1000000,
      };
      const response = await request(app)
        .patch(`/reserva/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dadosAtualizacao);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Não existe sala com este id: 1000000');
    });
    it('Deve retornar que não existe o usuario da alteração da reserva', async () => {
      const id = 2;
      const dadosAtualizacao = {
        id_usuario: 1000000,
      };
      const response = await request(app)
        .patch(`/reserva/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dadosAtualizacao);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe('Não existe um usuário com este id: 1000000 em (id_usuario)');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    }); 
    it('Deve retornar erro ao tentar alterar a reserva com um id que nao existe do reservante', async () => {
      const id = 2;
      const dadosAtualizacao = {
        id_reservante: 1000000,
      };
      const response = await request(app)
        .patch(`/reserva/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dadosAtualizacao);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Não existe um usuário com este id: 1000000 em (id_reservante)');
    });
    it('Deve retornar erro ao tentar alterar a reserva para um horario de outra reserva (conflito)', async () => {
      const id = 3;
      const dadosAtualizacao = {
        hora_inicio: '2024-01-01T13:00:00.000Z',
      };
      const response = await request(app)
        .patch(`/reserva/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dadosAtualizacao);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Conflito de horário: já existe uma reserva no período fornecido');
    });
    it('Deve retornar erro ao tentar alterar a reserva de outro docente', async () => {
      const id = 7;
      const dadosAtualizacao = {
        hora_inicio: '2024-01-01T13:00:00.000Z',
      };
      const response = await request(app)
        .patch(`/reserva/${id}`)
        .set('Authorization', `Bearer ${tokenDocente}`)
        .send(dadosAtualizacao);
      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('message', 'Você não tem permissão atualizar uma reserva que não te pertence');
    });
    it('Deve atualizar uma reserva com sucesso validando a mesma data', async () => {
      const id = 2; // Assumindo que já exista uma reserva com ID 2 para o teste
      const dadosAtualizacao = {
        turma: '1ºB Informatica',
        hora_inicio: '2024-10-30T12:00:00Z',
        hora_fim: '2024-10-30T13:00:00Z',
        id_usuario: 3,
        id_reservante: 3,
      };
      const response = await request(app)
        .patch(`/reserva/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dadosAtualizacao);
        expect(response.statusCode).toBe(202); 
    });
  });

  describe('DELETE /reserva/:id', () => {
    it('Deve excluir uma reserva com sucesso', async () => {
      const id = 10; // Assumindo que exista uma reserva com ID 10 para excluir
      const response = await request(app)
        .delete(`/reserva/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);
    });

    it('Deve retornar erro 400 se a reserva não existir', async () => {
      const response = await request(app)
        .delete('/reserva/9999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
    it('Deve retornar erro 400 se o id da reserva for invalido', async () => {
      const response = await request(app)
        .delete('/reserva/a')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message','O campo "id" fornecido não é um número válido.');
    });
    it('Deve retornar erro ao tentar alterar a reserva de outro docente', async () => {
      const id = 7;
      const dadosAtualizacao = {
        hora_inicio: '2024-01-01T13:00:00.000Z',
      };
      const response = await request(app)
        .delete(`/reserva/${id}`)
        .set('Authorization', `Bearer ${tokenDocente}`)
        .send(dadosAtualizacao);
      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('message', 'Você não tem permissão para deletar uma reserva que não te pertence');
    });
  });
});
