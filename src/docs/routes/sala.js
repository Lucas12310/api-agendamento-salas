

const salaRoutes = {
  '/sala': {
    get: {
      tags: ['Sala'],
      summary: 'Lista todas as salas cadastradas',
      parameters: [
        {
          name: 'id',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/salaFiltro/properties/id'
          },
          description: 'ID da sala'
        },
        {
          name: 'bloco',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/salaFiltro/properties/bloco'
          },
          description: 'Bloco onde a sala esta localizada'
        },
        {
          name: 'andar',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/salaFiltro/properties/andar'
          },
          description: 'Andar onde a sala esta localizada'
        },
        {
          name: 'nome',
          in: 'query',
          required: false,
          schema: {
            $ref: '#/components/schemas/salaFiltro/properties/nome'
          },
          description: "Nome da sala"
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
          content: { 'application/json': { schema: { $ref: '#/components/schemas/salaListagemResposta' } } }
        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ["O campo 'id' fornecido não é um número válido.", "O campo 'andar' fornecido não é um número válido.", "ID deve ser um número inteiro positivo"] } } } }
        }
      }
    },
    post: {
      tags: ['Sala'],
      summary: 'Cria uma nova sala',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/salaDetalhes'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Requisição bem sucedida',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/salaPostResposta' } } }
        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ["Andar deve ter no máximo 1 caracteres", "O campo 'andar' fornecido não é um número válido.", "Nome deve ter no máximo 50 caracteres"] } } } }
        }
      }
    }
  },
  '/sala/{id}': {
    patch: {
      tags: ['Sala'],
      summary: 'Atualiza uma sala',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da sala',
          example: 1
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/salaDetalhes'
            }
          }
        }
      },
      responses: {
        202: {
          description: "Requisição bem sucedida",
          content: { "application/json": { schema: { $ref: "#/components/schemas/salaPutResponse" } } }
        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ["Sala não encontrada!", "Andar deve ter no máximo 1 caracteres", "O campo 'andar' fornecido não é um número válido.", "Nome deve ter no máximo 50 caracteres"] } } } }
        }
      }
    },
    delete: {
      tags: ['Sala'],
      summary: 'Deleta uma sala',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          },
          description: 'ID da sala',
          example: 1
        }
      ],
      responses: {
        204: {

        },
        400: {
          description: "",
          content: { "application/json": { schema: { type: 'object', example: { error: true, code: 400, message: ["Sala não encontrada!", "ID deve ser um número inteiro positivo"] } } } }
        }
      }
    }
  }
};

export { salaRoutes };
