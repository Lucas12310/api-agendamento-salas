import ReservaRepository from '../repository/reservaRepository.js';
import ReservaSchema from '../schema/reservaSchema.js';
import { z } from 'zod';
import { addWeeks, eachWeekOfInterval } from 'date-fns';
import SalaRepository from '../repository/salaRepository.js';
import UsuarioRepository from '../repository/usuarioRepository.js';

class EnsalamentoServices {

  static async inserir(data, dataInicio, dataFim, userLogado) {
    // Verifica se o usuário tem permissão para inserir múltiplas reservas (dape)
    if (!userLogado.dape) {
      throw {
        error: true,
        message: 'Você não tem permissão para inserir múltiplas reservas',
        code: 403
      };
    }

    // Validação dos dados
    if (!Array.isArray(data) || data == '') {
      throw {
        error: true,
        message: 'O campo Ensalamento deve ser do tipo array e não pode estar vazio',
        code: 400
      };
    }
    data.forEach(reserva => {
      ReservaSchema.CamposReserva.parse(reserva);
    });

    // Verificar se os ids de referência existem
    for (const reserva of data) {
      const usuario = await UsuarioRepository.findById(reserva.id_usuario);
      const sala = await SalaRepository.findById(reserva.id_sala);
      const usuarioReservante = await UsuarioRepository.findById(reserva.id_reservante);
      if (!usuario) {
        throw {
          error: true,
          message: `Não existe um usuário com este id: ${reserva.id_usuario} em (id_usuario)`,
          code: 400
        };
      }
      if (!sala) {
        throw {
          error: true,
          message: `Não existe sala com este id: ${reserva.id_sala}`,
          code: 400
        };
      }
      if (!usuarioReservante) {
        throw {
          error: true,
          message: `Não existe um usuário com este id: ${reserva.id_reservante} em (id_reservante)`,
          code: 400
        };
      }
    }

    // Validação de datas
    const validacaoData = z.object({
      dataInicio: z.preprocess((arg) => {
        return typeof arg === 'string' ? new Date(arg) : arg;
      }, z.date({
        required_error: 'Campo dataInicio é obrigatório',
        invalid_type_error: 'dataInicio deve ser uma data válida'
      })),
      dataFim: z.preprocess((arg) => {
        return typeof arg === 'string' ? new Date(arg) : arg;
      }, z.date({
        required_error: 'Campo dataFim é obrigatório',
        invalid_type_error: 'dataFim deve ser uma data válida'
      }))
    }).refine((data) => data.dataFim > data.dataInicio, {
      message: 'dataFim deve ser posterior a dataInicio',
      path: ['dataFim']
    });
    validacaoData.parse({ dataInicio: dataInicio, dataFim: dataFim });

    // Função para ajustar o dia da semana
    function ajustarDiaSemana(dataReferencia, diaSemana) {
      const data = new Date(dataReferencia); // Cria uma nova instância para não modificar a original
      const diasDeDiferenca = (diaSemana - data.getDay() + 7) % 7; // Calcula a diferença para o dia da semana desejado
      data.setDate(data.getDate() + diasDeDiferenca); // Ajusta a data para o dia correto
      return data;
    }

    // Criação das novas reservas repetitivas
    const novasReservas = [];
    for (const reserva of data) {
      const diaSemana = new Date(reserva.hora_inicio).getDay();
      const horas = {
        inicio: new Date(reserva.hora_inicio).getHours(),
        fim: new Date(reserva.hora_fim).getHours(),
        minutosInicio: new Date(reserva.hora_inicio).getMinutes(),
        minutosFim: new Date(reserva.hora_fim).getMinutes(),
      };

      // Gera reservas para o mesmo dia da semana entre dataInicio e dataFim
      const semanas = eachWeekOfInterval({ start: dataInicio, end: dataFim });
      for (const semana of semanas) {
        const dataReserva = ajustarDiaSemana(semana, diaSemana); // Ajusta para o dia da semana correto
        const horaInicio = new Date(dataReserva);
        horaInicio.setHours(horas.inicio, horas.minutosInicio, 0, 0);

        const horaFim = new Date(dataReserva);
        horaFim.setHours(horas.fim, horas.minutosFim, 0, 0);

        novasReservas.push({
          ...reserva,
          hora_inicio: horaInicio,
          hora_fim: horaFim,
        });
      }
    }

    // Verifica se há conflito de horários entre as reservas inseridas
    const conflitos = [];
    for (let i = 0; i < data.length; i++) {
      const reservaAtual = data[i];

      for (let j = i + 1; j < data.length; j++) {
        const outraReserva = data[j];

        // Verifica se há sobreposição de horários entre reservaAtual e outraReserva
        if (
          (reservaAtual.hora_inicio < outraReserva.hora_fim) &&
          (reservaAtual.hora_fim > outraReserva.hora_inicio)
        ) {
          // Adiciona as reservas em conflito para análise
          conflitos.push({
            reserva1: reservaAtual,
            reserva2: outraReserva
          });
        }
      }
      if (conflitos.length > 0) {
        throw {
          error: true,
          message: 'Conflito de horário entre as reservas',
          code: 400
        };
      }

      // Buscar reservas onde o horário de início ou fim está dentro do intervalo de outra reserva
      for (const element of novasReservas) {
        const reservasConflitantes = await ReservaRepository.lista({
          AND: [
            { id_sala: element.id_sala }, // Filtra apenas as reservas da sala em questão
            {
              OR: [
                {
                  hora_inicio: {
                    lt: element.hora_fim
                  },
                  hora_fim: {
                    gt: element.hora_inicio
                  }
                },
                {
                  hora_inicio: {
                    gt: element.hora_inicio,
                    lt: element.hora_fim
                  }
                }
              ]
            }
          ]
        });
        if (reservasConflitantes.data.length > 0) {
          throw {
            error: true,
            message: 'Conflito de horário: já existe uma reserva no período fornecido',
            code: 400
          };
        }
      }
    }

    // Criação das novas reservas
    const response = await ReservaRepository.createMany(novasReservas);
    return response;
  }

  static async deletar(userLogado, reservas) {
    if (!userLogado.dape) {
      throw {
        error: true,
        message: 'Você não tem permissão para deletar múltiplas reservas',
        code: 403
      };
    }
    // Validação dos dados
    if (!Array.isArray(reservas.ensalamento) || reservas.ensalamento == '') {
      throw {
        error: true,
        message: 'O campo Ensalamento deve ser do tipo array e não pode estar vazio',
        code: 400
      };
    }
    reservas.ensalamento.forEach(reserva => {
      ReservaSchema.CamposReserva.parse(reserva);
    });

    const ids = [];
    // Validação se as reservas existem
    for (const reserva of reservas.ensalamento) {
      const reservaExistente = await ReservaRepository.findById(reserva.id);
      if (!reservaExistente) {
        throw {
          error: true,
          message: `Não existe reserva com este id: ${reserva.id}`,
          code: 400
        };
      }
      ids.push(reserva.id);
    }
    return await ReservaRepository.deleteMany(ids);
  }
}

export default EnsalamentoServices;
