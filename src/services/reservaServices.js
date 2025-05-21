import ReservaSchema from '../schema/reservaSchema.js';
import ReservaRepository from '../repository/reservaRepository.js';
import SalaRepository from '../repository/salaRepository.js';
import UsuarioRepository from '../repository/usuarioRepository.js';

class ReservaServices {

  static async listar(filtro, page = 1, limit = 10) {
    const filtroValidado = ReservaSchema.CamposReservaOptional.parse(filtro);
  
    // Verificar se o filtro contém o campo "dia"
    if (filtroValidado.dia) {
      const [dia, mes, ano] = filtroValidado.dia.split('-').map(Number); // Divide a data e converte para números
      const dataSelecionada = new Date(ano, mes - 1, dia); // Converte para um objeto Date
  
      // Calcula o início da semana (domingo)
      const diaDaSemana = dataSelecionada.getDay(); // Obtém o dia da semana (0 = domingo, 6 = sábado)
      const inicioSemana = new Date(dataSelecionada);
      inicioSemana.setDate(dataSelecionada.getDate() - diaDaSemana); // Subtrai os dias para chegar ao domingo
  
      // Calcula o fim da semana (sábado)
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6); // Adiciona 6 dias para chegar ao sábado
      fimSemana.setHours(23, 59, 59, 999); // Ajusta para o final do dia
  
      // Atualizar o filtro para buscar reservas dentro da semana
      filtroValidado.hora_inicio = { gte: inicioSemana }; // Reservas a partir do início da semana
      filtroValidado.hora_fim = { lte: fimSemana }; // Reservas até o fim da semana
      delete filtroValidado.dia;
    }
  
    // Consulta o repositório com o filtro atualizado
    const response = await ReservaRepository.lista(filtroValidado, page, limit);
    return response;
  }
  

  static async inserir(data) {
    console.log(data);
    const dataValidada = ReservaSchema.CamposReserva.parse(data);
    //verificar se ids de referencia existe
    const sala = await SalaRepository.findById(dataValidada.id_sala);
    if (!sala) {
      throw {
        error: true,
        message: `Não existe sala com este id: ${dataValidada.id_sala}`,
        code: 400
      };
    }
    const usuario = await UsuarioRepository.findById(dataValidada.id_usuario);
    if (!usuario) {
      throw {
        error: true,
        message: `Não existe um usuário com este id: ${dataValidada.id_usuario} em (id_usuario)`,
        code: 400
      };
    }
    const idReservante = await UsuarioRepository.findById(dataValidada.id_reservante);
    if (!idReservante) {
      throw {
        error: true,
        message: `Não existe um usuário com este id: ${dataValidada.id_reservante} em (id_reservante)`,
        code: 400
      };
    }


    // Buscar reservas onde o horário de início ou fim está dentro do intervalo de outra reserva
    const reservasConflitantes = await ReservaRepository.lista({
      AND: [
        { id_sala: dataValidada.id_sala }, // Filtra apenas as reservas da sala em questão
        {
          OR: [
            {
              hora_inicio: {
                lt: dataValidada.hora_fim // Agora é "lt" ao invés de "lte"
              },
              hora_fim: {
                gt: dataValidada.hora_inicio // Agora é "gt" ao invés de "gte"
              }
            },
            {
              hora_inicio: {
                gt: dataValidada.hora_inicio, // Agora é "gt" ao invés de "gte"
                lt: dataValidada.hora_fim // Agora é "lt" ao invés de "lte"
              }
            }
          ]
        }
      ]
    });
    

    // Verifica se existe algum conflito
    if (reservasConflitantes.data.length > 0) {
      console.log('tem conflito')
      throw {
        error: true,
        message: 'Conflito de horário: já existe uma reserva no período fornecido',
        code: 400
      };
    }



    const response = await ReservaRepository.create(dataValidada);
    return response;
  }
  static async atualizar(id, data, userLogado) {
    const idValidado = ReservaSchema.IdReserva.parse(id);
    const dataValidada = ReservaSchema.CamposReservaOptional.parse(data);

    //verificação se a reserva pertence ao usuário logado
    if (!userLogado.dape) {
      if(userLogado.id != dataValidada.id_usuario){
        throw {
          error: true,
          message: 'Você não tem permissão atualizar uma reserva que não te pertence',
          code: 403
        };
      }
    }

    const reserva = await ReservaRepository.findById(idValidado.id);
    if (!reserva) {
      throw {
        error: true,
        message: `Não existe nenhuma reserva com este id: ${idValidado.id}`,
        code: 400
      };
    }


    //verificar se ids de referencia existe
    if (dataValidada.id_sala) {
      const sala = await SalaRepository.findById(dataValidada.id_sala);
      if (!sala) {
        throw {
          error: true,
          message: `Não existe sala com este id: ${dataValidada.id_sala}`,
          code: 400
        };
      }
    }
    if (dataValidada.id_usuario) {
      const usuario = await UsuarioRepository.findById(dataValidada.id_usuario);
      if (!usuario) {
        throw {
          error: true,
          message: `Não existe um usuário com este id: ${dataValidada.id_usuario} em (id_usuario)`,
          code: 400
        };
      }
    }
    if (dataValidada.id_reservante) {
      const idReservante = await UsuarioRepository.findById(dataValidada.id_reservante);
      if (!idReservante) {
        throw {
          error: true,
          message: `Não existe um usuário com este id: ${dataValidada.id_reservante} em (id_reservante)`,
          code: 400
        };
      }
    }



    // Buscar reservas onde o horário de início ou fim está dentro do intervalo de outra reserva
    console.log('------------', dataValidada);
    const reservasConflitantes = await ReservaRepository.lista({
      AND: [
        { id_sala: dataValidada.id_sala }, // Filtra apenas as reservas da sala em questão
        {
          OR: [
            {
              hora_inicio: {
                lte: dataValidada.hora_fim
              },
              hora_fim: {
                gt: dataValidada.hora_inicio
              }
            },
            {
              hora_inicio: {
                gte: dataValidada.hora_inicio,
                lte: dataValidada.hora_fim
              }
            }
          ]
        }
      ]
    });

    // Verifica se existe algum conflito
    if (reservasConflitantes.data.length > 0) {
      console.log(reservasConflitantes.data);
      if (reservasConflitantes.data[0].id != idValidado.id) {//se for a mesma reserva que esta sendo atualizada, não é conflito
        throw {
          error: true,
          message: 'Conflito de horário: já existe uma reserva no período fornecido"',
          code: 400
        };
      }

    }
    const response = await ReservaRepository.update(idValidado.id, dataValidada);
    return response;
  }

  static async excluir(id, userLogado) {
    const idValidado = ReservaSchema.IdReserva.parse(id);

    const reserva = await ReservaRepository.findById(idValidado.id);
    if (!reserva) {
      throw {
        error: true,
        message: `Não existe nenhuma reserva com este id: ${idValidado.id}`,
        code: 400
      };
    }

    if (!userLogado.dape) {
      if(userLogado.id != reserva.id_usuario){
        throw {
          error: true,
          message: 'Você não tem permissão para deletar uma reserva que não te pertence',
          code: 403
        };
      }
    }
    const response = await ReservaRepository.delete(idValidado.id);
    return response;

  }
}

export default ReservaServices;