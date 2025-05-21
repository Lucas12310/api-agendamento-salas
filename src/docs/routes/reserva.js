

const reservaRoutes = {
  '/reserva': {
    get: {
      tags: ['Reserva'],
      summary: 'Lista todos os dados de reservas cadastrados',
      parameters: [
        {
          name: 'id',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/id'
          },
          description: 'ID da reserva'
        },
        {
          name: 'id_sala',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/id_sala'
          },
          description: 'ID da sala reservada'
        },
        {
          name: 'id_usuario',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/id_usuario'
          },
          description: 'ID do usuário que criou a reserva'
        },
        {
          name: 'turma',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/turma'
          },
          description: 'Nome ou identificação da turma'
        },
        {
          name: 'hora_inicio',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/hora_inicio'
          },
          description: 'Hora de início da reserva no formato date-time'
        },
        {
          name: 'hora_fim',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/hora_fim'
          },
          description: 'Hora de fim da reserva no formato date-time'
        },
        {
          name: 'descricao',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/descricao'
          },
          description: 'Descrição ou observação sobre a reserva'
        },
        {
          name: 'id_reservante',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/id_reservante'
          },
          description: 'ID do usuário que criou a reserva'
        },
        {
          name: 'dia',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/reservaFiltro/properties/dia'
          },
          description: "Dia da reserva"
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 1,
            minimum: 1
          },
          description: "ID da reserva"
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 10,
            minimum: 1
          },
          description: "ID da reserva"
        },
      ],
      responses: {
        200: {
          description: 'Requisição bem sucedida',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/reservaListagemResposta' } } }
        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ["O campo 'id' fornecido não é um número válido.", "O campo 'id_sala' fornecido não é um número válido.", "O campo 'id_usuario' fornecido não é um número válido.", "O campo hora_inicio deve ser do tipo dateTime", "O campo hora_fim deve ser do tipo ISO dateTime", "O campo id_reservante presisa ser um numero inteiro", "O campo 'Dia' deve estar no formato 'DD-MM-YYYY'."] } } } }
        }
      }
    },
    post: {
      tags: ['Reserva'],
      summary: 'Cria uma nova reserva',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/reservaDetalhes'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Requisição bem sucedida',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/reservaPostResposta' } } }
        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ["Não existe sala com este id:", "Não existe um usuário com este id: 20  em (id_usuario)", "Não existe um usuário com este id: 20 em (id_reservante)", "Conflito de horário: já existe uma reserva no período fornecido", "O campo 'id' fornecido não é um número válido.", "O campo 'id_sala' fornecido não é um número válido.", "O campo 'id_usuario' fornecido não é um número válido.", "O campo hora_inicio deve ser do tipo dateTime", "O campo hora_fim deve ser do tipo ISO dateTime", "O campo id_reservante presisa ser um numero inteiro"] } } } }
        }
      }
    }
  },
  '/reserva/{id}': {
    patch: {
      tags: ['Reserva'],
      summary: 'Atualiza uma reserva',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da reserva',
          example: 1
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/reservaDetalhes'
            }
          }
        }
      },
      responses: {
        202: {
          description: "Requisição bem sucedida",
          content: { "application/json": { schema: { $ref: "#/components/schemas/reservaPutResponse" } } }
        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ['Não existe nenhuma reeserva com este id: 5', 'Conflito de horário: já existe uma reserva no período fornecido`', "O campo 'id' fornecido não é um número válido.", "O campo 'id_sala' fornecido não é um número válido.", "O campo 'id_usuario' fornecido não é um número válido.", "O campo hora_inicio deve ser do tipo dateTime", "O campo hora_fim deve ser do tipo ISO dateTime", "O campo id_reservante presisa ser um numero inteiro"] } } } }
        }
      }
    },
    delete: {
      tags: ['Reserva'],
      summary: 'Deleta uma reserva',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da reserva',
          example: 1
        }
      ],
      responses: {
        204: {

        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ['Não existe nenhuma reeserva com este id: 1', 'O campo id fornecido não é um número válido.'] } } } }
        }
      }
    }
  }
};

export { reservaRoutes };
