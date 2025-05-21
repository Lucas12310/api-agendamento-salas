const ensalamentoRouter = {
  '/ensalamento': {
    post: {
      tags: ['Ensalamento'],
      summary: 'Cria múltiplas reservas ao longo de um período definido',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/EnsalamentoPost'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Requisição bem sucedida',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/EnsalamentoPostResponse' } } }
        },
        400: {
          description: 'Erro de validação ou conflito',
          content: {
            "application/json": {
              schema: {
                type: 'object', example: {
                  error: true,
                  code: 400,
                  message: [
                    'O campo Ensalamento deve ser do tipo array e não pode estar vazio',
                    'Campo dataInicio é obrigatório',
                    'dataInicio deve ser uma data válida',
                    'Campo dataFim é obrigatório',
                    'dataFim deve ser uma data válida',
                    'dataFim deve ser posterior a dataInicio',
                    'Conflito de horário entre as reservas',
                    'Conflito de horário: já existe uma reserva no período fornecido',
                    'O campo \'id\' fornecido não é um número válido.',
                    'O campo \'id_sala\' fornecido não é um número válido.',
                    'O campo \'id_usuario\' fornecido não é um número válido.',
                    'O campo hora_inicio deve ser do tipo dateTime',
                    'O campo hora_fim deve ser do tipo ISO dateTime',
                    'O campo id_reservante precisa ser um número inteiro',
                    'O campo \'Dia\' deve estar no formato \'DD-MM-YYYY\'.'
                  ]
                }
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Ensalamento'],
      summary: 'Deleta múltiplas reservas baseadas nos dados fornecidos',
      description: 'Exclui múltiplas reservas, fornecendo os dados das reservas que precisam ser deletadas',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ensalamento: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      id_sala: { type: 'integer' },
                      id_usuario: { type: 'integer' },
                      turma: { type: 'string' },
                      hora_inicio: { type: 'string', format: 'date-time' },
                      hora_fim: { type: 'string', format: 'date-time' },
                      descricao: { type: 'string' },
                      id_reservante: { type: 'integer' }
                    },
                    required: ['id', 'id_sala', 'id_usuario', 'turma', 'hora_inicio', 'hora_fim', 'descricao', 'id_reservante']
                  },
                  example: [
                    {
                      "id": 2,
                      "id_sala": 2,
                      "id_usuario": 2,
                      "turma": "1ºB Informatica",
                      "hora_inicio": "2024-01-01T13:00:00.000Z",
                      "hora_fim": "2024-01-01T13:50:00.000Z",
                      "descricao": "Aula",
                      "id_reservante": 2
                    },
                    {
                      "id": 3,
                      "id_sala": 3,
                      "id_usuario": 3,
                      "turma": "1ºC Informatica",
                      "hora_inicio": "2024-01-03T08:00:00.000Z",
                      "hora_fim": "2024-01-03T08:50:00.000Z",
                      "descricao": "Reforço",
                      "id_reservante": 3
                    }
                  ]
                }
              },
              required: ['ensalamento']
            }
          }
        }
      },
      responses: {
        204: {
          description: 'Reservas deletadas com sucesso',
          content: {

          }
        },
        400: {
          description: 'Erro de validação',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                example: {
                  error: true,
                  code: 400,
                  message: [
                    "O campo 'id' fornecido não é um número válido.",
                    "O campo 'id_sala' fornecido não é um número válido.",
                    "O campo 'id_usuario' fornecido não é um número válido.",
                    "O campo hora_inicio deve ser do tipo dateTime",
                    "O campo hora_fim deve ser do tipo ISO dateTime",
                    "O campo id_reservante presisa ser um numero inteiro",
                    "O campo 'Dia' deve estar no formato 'DD-MM-YYYY'."
                  ]
                }
              }
            }
          }
        },
        403: {
          description: 'Erro de validação',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                example: {
                  error: true,
                  code: 403,
                  message: 'Você não tem permissão para deletar multiplas reservas'
                }
              }
            }
          }
        },
        404: {
          description: 'Não encontrado',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                example: {
                  error: true,
                  code: 404,
                  message: 'Não existe reserva com este id: 99'
                }
              }
            }
          }
        }
      }
    }
  },
};

export { ensalamentoRouter };
