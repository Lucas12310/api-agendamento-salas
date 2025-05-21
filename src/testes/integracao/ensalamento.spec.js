import request from 'supertest';
import app from '../../app';

describe('Teste de Integração Reserva', () => {

  const reservas = [
    {
      "id_sala": 1,
      "id_usuario": 9,
      "turma": "2ºB Eletrônica",
      "hora_inicio": "2024-05-02T09:00:00.000Z",
      "hora_fim": "2024-05-02T11:50:00.000Z",
      "descricao": "Prática de laboratório",
      "id_reservante": 8
    },
    {
      "id_sala": 1,
      "id_usuario": 9,
      "turma": "3ºC Mecatrônica",
      "hora_inicio": "2024-05-03T14:00:00.000Z",
      "hora_fim": "2024-05-03T16:50:00.000Z",
      "descricao": "Aula teórica",
      "id_reservante": 8
    },
    {
      "id_sala": 1,
      "id_usuario": 9,
      "turma": "1ºD Informática",
      "hora_inicio": "2024-05-04T10:00:00.000Z",
      "hora_fim": "2024-05-04T12:50:00.000Z",
      "descricao": "Exercícios práticos",
      "id_reservante": 8
    }
  ];

  let token;
  let tokenDocente;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ siape: '169875', senha: 'Senha123@' });
    
    token = loginResponse.body.accessToken;
  });
  //token de um usuario que não tem permissao de fazer ensalamento
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ siape: '248613', senha: 'Senha123@' });
    
      tokenDocente = loginResponse.body.accessToken;
  });
  describe('POST /ensalamento', () => {
    it('Deve criar múltiplas reservas com sucesso', async () => {
      const body = {
        ensalamento: reservas,
        sala: 4,
        dataInicio: "2025-02-07T13:00:00.000Z",
        dataFim: "2025-05-03T08:50:00.000Z"
      };

      const response = await request(app)
        .post('/ensalamento')
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      // expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Ensalamento criado com sucesso!');
      expect(response.body).toMatchObject({
        code: 201,
        error: false,
        message: 'Ensalamento criado com sucesso!',
        data: { count: 39 }
      });
    });

    it('Deve retornar erro 400 se faltar campo obrigatório', async () => {
      const bodyIncompleto = {
        ensalamento: {tipo_invalido: 'deve ser um array'},
        dataInicio: "2025-02-07T13:00:00.000Z",
        dataFim: "2025-05-03T08:50:00.000Z"
      };

      const response = await request(app)
        .post('/ensalamento')
        .set('Authorization', `Bearer ${token}`)
        .send(bodyIncompleto);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'O campo Ensalamento deve ser do tipo array e não pode estar vazio');
    });
    it('Deve retornar erro 403 se o usuario cadastrado não for dape', async () => {
      const bodyIncompleto = {
        ensalamento: {tipo_invalido: 'deve ser um array'},
        dataInicio: "2025-02-07T13:00:00.000Z",
        dataFim: "2025-05-03T08:50:00.000Z"
      };

      const response = await request(app)
        .post('/ensalamento')
        .set('Authorization', `Bearer ${tokenDocente}`)
        .send(bodyIncompleto);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('message', 'Você não tem permissão para inserir múltiplas reservas');
    });
    it('Deve retornar erro 400 se a sala não existir', async () => {
      const ensalamento = {
        ensalamento: [
          {
            id_sala: 1000000,
            id_usuario: 8,
            turma: '1ºA Edificações',
            hora_inicio: '2024-01-08T14:00:00.000Z',
            hora_fim: '2024-01-08T14:50:00.000Z',
            descricao: 'Aula',
            id_reservante: 8
          }
        ]
      }
      const response = await request(app)
        .post('/ensalamento')
        .set('Authorization', `Bearer ${token}`)
        .send(ensalamento);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Não existe sala com este id: 1000000');
    });
    it('Deve retornar erro 400 se o id do reservante não existir', async () => {
      const ensalamento = {
        ensalamento: [
          {
            id_sala: 2,
            id_usuario: 8,
            turma: '1ºA Edificações',
            hora_inicio: '2024-01-08T14:00:00.000Z',
            hora_fim: '2024-01-08T14:50:00.000Z',
            descricao: 'Aula',
            id_reservante: 100000
          }
        ]
      }
      const response = await request(app)
        .post('/ensalamento')
        .set('Authorization', `Bearer ${token}`)
        .send(ensalamento);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Não existe um usuário com este id: 100000 em (id_reservante)');
    });
    it('Deve retornar erro 400 se houver conflito com o ensalamento de reservas', async () => {
      const ensalamento = {
        ensalamento: [
          {
            id_sala: 1,
            id_usuario: 2,
            turma: "2ºB Eletrônica",
            hora_inicio: "2024-01-01T13:00:00.000Z",
            hora_fim: "2024-01-01T13:50:00.000Z",
            descricao: "Prática de laboratório",
            id_reservante: 8
          },
          {
            id_sala: 1,
            id_usuario:2,
            turma: "3ºC Mecatrônica",
            hora_inicio: "2024-01-01T13:00:00.000Z",
            hora_fim: "2024-01-01T13:50:00.000Z",
            descricao: "Aula teórica",
            id_reservante: 8
          },
          {
            id_sala: 1,
            id_usuario: 2,
            turma: "1ºD Informática",
            hora_inicio: "2024-05-04T10:00:00.000Z",
            hora_fim: "2024-05-04T12:50:00.000Z",
            descricao: "Exercícios práticos",
            id_reservante: 6
          }
        ],
          dataInicio: "2024-01-04T14:00:00Z",
          dataFim: "2024-02-04T14:00:00Z"
      }
      const response = await request(app)
        .post('/ensalamento')
        .set('Authorization', `Bearer ${token}`)
        .send(ensalamento);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Conflito de horário entre as reservas');
    });
    it('Deve retornar erro 400 se houver conflito com o ensalamento de reservas', async () => {
      const body = {
        ensalamento: reservas,
        sala: 4,
        dataInicio: "2025-02-07T13:00:00.000Z",
        dataFim: "2025-05-03T08:50:00.000Z"
      };

      const response = await request(app)
        .post('/ensalamento')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Conflito de horário: já existe uma reserva no período fornecido');
    });
  });


  describe("Excluir ensalamento", () => {
    it('Deve excluir o ensalamento', async () => {
      const ensalamento = {
        ensalamento: [
          {
            id: 8,
            id_sala: 8,
            id_usuario: 8,
            turma: "1ºA Edificações",
            hora_inicio: "2024-01-08T14:00:00.000Z",
            hora_fim: "2024-01-08T14:50:00.000Z",
            descricao: "Aula",
            id_reservante: 8
        },
        {
            id: 9,
            id_sala: 9,
            id_usuario: 9,
            turma: "2ºA Edificações",
            hora_inicio: "2024-01-09T13:00:00.000Z",
            hora_fim: "2024-01-09T13:50:00.000Z",
            descricao: "Aula",
            id_reservante: 9
        }
        ]
      }
        const response = await request(app)
            .delete(`/ensalamento`)
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send(ensalamento)
        expect(response.status).toBe(204);
    });
    it('Deve retornar erro ao tentar excluir ensalamento com id de reserva não existente', async () => {
      const ensalamento = {
        ensalamento: [
          {
            id: 10000000,
            id_sala: 8,
            id_usuario: 8,
            turma: '1ºA Edificações',
            hora_inicio: '2024-01-08T14:00:00.000Z',
            hora_fim: '2024-01-08T14:50:00.000Z',
            descricao: 'Aula',
            id_reservante: 8
          }
        ]
      }
        const response = await request(app)
            .delete(`/ensalamento`)
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send(ensalamento)
        expect(response.status).toBe(400);
    });
    it('Deve retornar erro 403 se o usuario cadastrado não for dape e tentar deletar ensalamento', async () => {
      const bodyIncompleto = {
        ensalamento: {tipo_invalido: 'deve ser um array'},
        dataInicio: "2025-02-07T13:00:00.000Z",
        dataFim: "2025-05-03T08:50:00.000Z"
      };

      const response = await request(app)
        .delete('/ensalamento')
        .set('Authorization', `Bearer ${tokenDocente}`)
        .send(bodyIncompleto);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('message', 'Você não tem permissão para deletar múltiplas reservas');
    });
    it('Deve retornar erro 400 se não for enviado nenhum parametro para deletar', async () => {
      const response = await request(app)
        .delete('/ensalamento')
        .set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'O campo Ensalamento deve ser do tipo array e não pode estar vazio');
    });
});
});
