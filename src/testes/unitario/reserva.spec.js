import ReservaServices from '../../services/reservaServices.js';
import ReservaRepository from '../../repository/reservaRepository.js';
import SalaRepository from '../../repository/salaRepository.js';
import UsuarioRepository from '../../repository/usuarioRepository.js';
import { id } from 'date-fns/locale';

jest.mock('../../repository/reservaRepository.js');
jest.mock('../../repository/salaRepository.js');
jest.mock('../../repository/usuarioRepository.js');

describe('ReservaServices', () => {
  describe('listar', () => {
    it('Deve chamar ReservaRepository.lista com os filtros corretos', async () => {
      const filtro = {
        id: 1,
        turma: '1ºA Informatica',
      };
      const page = 1;
      const limit = 10;
      const response = [{
        "id": 1,
        "id_sala": 1,
        "id_usuario": 1,
        "turma": "1ºA Informatica",
        "hora_inicio": "2024-01-02T14:00:00.000Z",
        "hora_fim": "2024-01-02T14:50:00.000Z",
        "descricao": "Reforço",
        "id_reservante": 1
      }];

      ReservaRepository.lista.mockResolvedValue(response);

      const result = await ReservaServices.listar(filtro, page, limit);
      expect(ReservaRepository.lista).toHaveBeenCalledWith(filtro, page, limit);
      expect(result).toEqual(response);
    });

    it('Deve chamar ReservaRepository.lista com os filtros invalidos', async () => {
      const filtro = {
        id: 'id invalido',
        turma: '1ºA Informatica',
      };
      const page = 1;
      const limit = 10;

      await expect(ReservaServices.listar(filtro, page, limit)).rejects.toMatchObject({
        message: 'O campo "id" fornecido não é um número válido.'
      });
      

    });
  });

  describe('inserir', () => {
    it('Deve lançar um erro se a sala não existir', async () => {
      const data = {
        id_sala: 1,
        turma: '1ºA Informatica',
        id_usuario: 2,
        id_reservante: 3,
        hora_inicio: '2024-01-02T14:50:00.000Z',
        hora_fim: '2024-01-02T14:50:00.000Z',
      };
      const salaExists = false;

      SalaRepository.findById.mockResolvedValue(salaExists);

      await expect(ReservaServices.inserir(data)).rejects.toEqual({
        error: true,
        message: `Não existe sala com este id: ${data.id_sala}`,
        code: 400,
      });

      expect(SalaRepository.findById).toHaveBeenCalledWith(data.id_sala);
    });

    it('Deve lançar um erro se o usuário não existir', async () => {
      const data = {
        id_sala: 1,
        id_usuario: 2,
        turma: '1ºA Informatica',
        id_reservante: 3,
        hora_inicio: `${new Date()}`,
        hora_fim: `${new Date()}`,
      };
      const salaExists = true;
      const usuarioExists = false;

      SalaRepository.findById.mockResolvedValue(salaExists);
      UsuarioRepository.findById.mockResolvedValue(usuarioExists);

      await expect(ReservaServices.inserir(data)).rejects.toEqual({
        error: true,
        message: `Não existe um usuário com este id: ${data.id_usuario} em (id_usuario)`,
        code: 400,
      });

      expect(SalaRepository.findById).toHaveBeenCalledWith(data.id_sala);
      expect(UsuarioRepository.findById).toHaveBeenCalledWith(data.id_usuario);
    });

    it('Deve lançar um erro se o reservante não existir', async () => {
      const data = {
        id_sala: 1,
        id_usuario: 2,
        turma: '1ºA Informatica',
        id_reservante: 3,
        hora_inicio: `${new Date()}`,
        hora_fim: `${new Date()}`,
      };
      const salaExists = true;
      const usuarioExists = true;
      const reservanteExists = false;
    
      SalaRepository.findById.mockResolvedValue(salaExists);
    
      // Use uma função mock para retornar diferentes valores com base no ID fornecido
      UsuarioRepository.findById.mockImplementation((id) => {
        if (id === data.id_usuario) return Promise.resolve(usuarioExists);
        if (id === data.id_reservante) return Promise.resolve(reservanteExists);
      });
    
      await expect(ReservaServices.inserir(data)).rejects.toEqual({
        error: true,
        message: `Não existe um usuário com este id: ${data.id_reservante} em (id_reservante)`,
        code: 400,
      });
    
      expect(SalaRepository.findById).toHaveBeenCalledWith(data.id_sala);
      expect(UsuarioRepository.findById).toHaveBeenCalledWith(data.id_usuario);
      expect(UsuarioRepository.findById).toHaveBeenCalledWith(data.id_reservante);
    });
    

    it('Deve lançar um erro se houver conflito de horário', async () => {
      const data = {
        id_sala: 1,
        id_usuario: 2,
        id_reservante: 3,
        turma: '1ºA Informatica',
        hora_inicio: `${new Date()}`,
        hora_fim: `${new Date()}`,
      };
      const salaExists = true;
      const usuarioExists = true;
      const reservanteExists = true;
      const reservasConflitantes = [{ id: 1 }];

      SalaRepository.findById.mockResolvedValue(salaExists);
      UsuarioRepository.findById.mockResolvedValue(usuarioExists);
      UsuarioRepository.findById.mockResolvedValue(reservanteExists);
      ReservaRepository.lista.mockResolvedValue({ data: reservasConflitantes });

      await expect(ReservaServices.inserir(data)).rejects.toEqual({
        error: true,
        message: 'Conflito de horário: já existe uma reserva no período fornecido',
        code: 400,
      });
    });

    it('Deve criar uma nova reserva', async () => {
      const data = {
        id_sala: 1,
        id_usuario: 2,
        id_reservante: 3,
        turma: '1ºA Informatica',
        hora_inicio: `2024-10-22T09:00:00Z`,
        hora_fim: `2024-10-22T09:00:00Z`,
      };
      const salaExists = true;
      const usuarioExists = true;
      const reservanteExists = true;
      const reservasConflitantes = [];

      SalaRepository.findById.mockResolvedValue(salaExists);
      UsuarioRepository.findById.mockResolvedValue(usuarioExists);
      UsuarioRepository.findById.mockResolvedValue(reservanteExists);
      ReservaRepository.lista.mockResolvedValue({data: reservasConflitantes});
      ReservaRepository.create.mockResolvedValue({ id: 1, ...data });

      const response = await ReservaServices.inserir(data);
      expect(response).toEqual({ id: 1, ...data });
    });
  });

  describe('atualizar', () => {
    it('Deve lançar um erro se a reserva não existir', async () => {
      const id = {id: 1};
      const data = {
        turma: '1ºA Informatica',
      };
      const reservaExists = false;

      ReservaRepository.findById.mockResolvedValue(reservaExists);

      await expect(ReservaServices.atualizar(id, data, {data: true})).rejects.toEqual({
        error: true,
        message: `Não existe nenhuma reserva com este id: ${id.id}`,
        code: 400,
      });

      expect(ReservaRepository.findById).toHaveBeenCalledWith(id.id);
    });
    it('Deve lançar um erro se houver conflito de horário', async () => {
      const id = {id: 1};
      const data = {
        turma: '1ºA Informatica',
      };
      const reservaExists = true;
      const reservasConflitantes = {data:[{ id: 2 }]};

      ReservaRepository.findById.mockResolvedValue(reservaExists);
      ReservaRepository.lista.mockResolvedValue(reservasConflitantes);

      await expect(ReservaServices.atualizar(id, data, {dape: true})).rejects.toEqual({
        error: true,
        message: 'Conflito de horário: já existe uma reserva no período fornecido',
        code: 400,
      });

      expect(ReservaRepository.findById).toHaveBeenCalledWith(id.id);
      expect(ReservaRepository.lista).toHaveBeenCalledWith({
        AND: [
          { id_sala: data.id_sala }, // Filtra apenas as reservas da sala em questão
          {
            OR: [
              {
                hora_inicio: {
                  lte: data.hora_fim
                },
                hora_fim: {
                  gte: data.hora_inicio
                }
              },
              {
                hora_inicio: {
                  gte: data.hora_inicio,
                  lte: data.hora_fim
                }
              }
            ]
          }
        ]
      });
    });

    it('Deve atualizar a reserva', async () => {
      const id = {id: 1};
      const data = {
        id_sala: 3,
      };
      const reservaExists = true;
      const reservasConflitantes = {data:[]};

      ReservaRepository.findById.mockResolvedValue(reservaExists);
      ReservaRepository.lista.mockResolvedValue(reservasConflitantes);
      ReservaRepository.update.mockResolvedValue({ id, ...data });

      const response = await ReservaServices.atualizar(id, data, {data: true});

      expect(ReservaRepository.findById).toHaveBeenCalledWith(id.id);
      expect(ReservaRepository.lista).toHaveBeenCalledWith({
        AND: [
          { id_sala: data.id_sala }, // Filtra apenas as reservas da sala em questão
          {
            OR: [
              {
                hora_inicio: {
                  lte: data.hora_fim
                },
                hora_fim: {
                  gte: data.hora_inicio
                }
              },
              {
                hora_inicio: {
                  gte: data.hora_inicio,
                  lte: data.hora_fim
                }
              }
            ]
          }
        ]
      });
      expect(ReservaRepository.update).toHaveBeenCalledWith(id.id, data);
      expect(response).toEqual({ id, ...data });
    });
  });

  describe('excluir', () => {
    it('Deve lançar um erro se a reserva não existir', async () => {
      const id = {id: 1};
      const reservaExists = false;

      ReservaRepository.findById.mockResolvedValue(reservaExists);

      await expect(ReservaServices.excluir(id)).rejects.toEqual({
        error: true,
        message: `Não existe nenhuma reserva com este id: ${id.id}`,
        code: 400,
      });

      expect(ReservaRepository.findById).toHaveBeenCalledWith(id.id);
    });

    it('Deve excluir a reserva', async () => {
      const id = {id: 1};
      const reservaExists = true;

      ReservaRepository.findById.mockResolvedValue(reservaExists);
      ReservaRepository.delete.mockResolvedValue(id);

      const response = await ReservaServices.excluir(id, {data: true});

      expect(ReservaRepository.findById).toHaveBeenCalledWith(id.id);
      expect(ReservaRepository.delete).toHaveBeenCalledWith(id.id);
      expect(response).toEqual(id);
    });
  });
});