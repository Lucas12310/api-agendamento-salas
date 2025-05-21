const reservaSchemas = {
    reservaFiltro: {
        type: 'object',
        properties: {
            id: { type: 'integer', description: 'ID da reserva' },
            id_sala: { type: 'integer', description: 'ID da sala reservada' },
            id_usuario: { type: 'integer', description: 'ID do usuário a quem a reserva pertence' },
            turma: { type: 'string', description: 'Nome ou identificação da turma' },
            hora_inicio: { type: 'string', format: 'date-time', description: 'Data e hora de início da reserva' },
            hora_fim: { type: 'string', format: 'date-time', description: 'Data e hora de fim da reserva' },
            descricao: { type: 'string', description: 'Descrição ou observação sobre a reserva' },
            id_reservante: { type: 'integer', description: 'ID do usuário que criou a reserva' },
            dia: { type: 'string', format: 'date', description: 'Dia da reserva no formato dd/MM/yyyy' },
        }
    },
    reservaListagemResposta: {
        type: 'object',
        example:{
            error: false,
            code: 200,
            message: 'Listado com sucesso!',
            data: {
            id: 1,
            id_sala: 101,
            id_usuario: 5,
            turma: 'Turma A',
            hora_inicio: '2024-10-22T08:00:00Z',
            hora_fim: '2024-10-22T09:00:00Z',
            descricao: 'Reserva para aula de Matemática',
            id_reservante: 3,
        }}
    },
    reservaDetalhes: {
        type: 'object',
        properties: {
            id_sala: { type: 'integer', description: 'ID da sala reservada' },
            id_usuario: { type: 'integer', description: 'ID do usuário que criou a reserva' },
            turma: { type: 'string', description: 'Nome ou identificação da turma' },
            hora_inicio: { type: 'string', format: 'date-time', description: 'Data e hora de início da reserva' },
            hora_fim: { type: 'string', format: 'date-time', description: 'Data e hora de fim da reserva' },
            descricao: { type: 'string', description: 'Descrição ou observação sobre a reserva' },
            id_reservante: { type: 'integer', description: 'ID do usuário que está reservando' },
        },
        example: {
            id_sala: 5,
            id_usuario: 4,
            turma: 'Turma A',
            hora_inicio: '2024-10-22T08:00:00Z',
            hora_fim: '2024-10-22T09:00:00Z',
            descricao: 'Reserva para aula de Matemática',
            id_reservante: 3,
        }
    },
    reservaPostResposta: {
        type: 'object',
        required: ['id_sala', 'id_usuario', 'turma', 'dia', 'hora_inicio', 'hora_fim'],
        properties: {
            id_sala: { type: 'integer', description: 'ID da sala reservada' },
            id_usuario: { type: 'integer', description: 'ID do usuário que criou a reserva' },
            turma: { type: 'string', description: 'Nome ou identificação da turma' },
            hora_inicio: { type: 'string', format: 'date-time', description: 'Data e hora de início da reserva' },
            hora_fim: { type: 'string', format: 'date-time', description: 'Data e hora de fim da reserva' },
            descricao: { type: 'string', description: 'Descrição ou observação sobre a reserva' },
            id_reservante: { type: 'integer', description: 'ID do usuário que está reservando' },
        },
        example: {
            error: false,
            code: 201,
            message: 'Reserva criada com sucesso!',
            data: {
            id_sala: 2,
            id_usuario: 2,
            turma: '2º A Eletromecânica',
            hora_inicio: '2024-10-22T08:00:00Z',
            hora_fim: '2024-10-22T09:00:00Z',
            descricao: 'Reserva para aula de Matemática',
            id_reservante: 3}
        }
    },
    reservaPutResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Reserva atualizada com sucesso!' },
          error: { type: 'boolean', example: false },
          code: { type: 'integer', example: 202 },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 4 },
              id_sala: { type: 'integer', example: 5 },
              id_usuario: { type: 'integer', example: 4 },
              turma: { type: 'string', example: 'Turma A' },
              hora_inicio: { type: 'string', format: 'date-time', example: '2026-10-22T08:00:00.000Z' },
              hora_fim: { type: 'string', format: 'date-time', example: '2026-10-22T09:00:00.000Z' },
              descricao: { type: 'string', example: 'ddddd' },
              id_reservante: { type: 'integer', example: 3 }
            }
          }
        },
        example: {
          message: 'Reserva atualizada com sucesso!',
          error: false,
          code: 202,
          data: {
            id: 4,
            id_sala: 5,
            id_usuario: 4,
            turma: 'Turma A',
            hora_inicio: '2026-10-22T08:00:00.000Z',
            hora_fim: '2026-10-22T09:00:00.000Z',
            descricao: 'Reserva para estudar',
            id_reservante: 3
          }
        }
      }
};
export default reservaSchemas;
