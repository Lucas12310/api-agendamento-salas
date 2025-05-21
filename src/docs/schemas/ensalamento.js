const ensalamentoSchema = {
    EnsalamentoPost: {
        type: 'object',
        properties: {
            ensalamento: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id_sala: { type: 'integer', description: 'ID da sala reservada', example: 1 },
                        id_usuario: { type: 'integer', description: 'ID do usuário que criou o ensalamento', example: 1 },
                        turma: { type: 'string', description: 'Nome ou identificação da turma', example: '2ºB Eletrônica' },
                        hora_inicio: { type: 'string', format: 'date-time', description: 'Data e hora de início', example: '2024-05-02T09:00:00.000Z' },
                        hora_fim: { type: 'string', format: 'date-time', description: 'Data e hora de fim', example: '2024-05-02T11:50:00.000Z' },
                        descricao: { type: 'string', description: 'Descrição da atividade ou observação', example: 'Prática de laboratório' },
                        id_reservante: { type: 'integer', description: 'ID do usuário que está reservando', example: 7 }
                    }
                }
            },
            dataInicio: { type: 'string', format: 'date-time', description: 'Data de início do período', example: '2024-01-04T14:00:00Z' },
            dataFim: { type: 'string', format: 'date-time', description: 'Data de fim do período', example: '2024-02-04T14:00:00Z' }
        },
        example: {
            ensalamento: [
                {
                    id_sala: 1,
                    id_usuario: 1,
                    turma: '2ºB Eletrônica',
                    hora_inicio: '2024-05-02T09:00:00.000Z',
                    hora_fim: '2024-05-02T11:50:00.000Z',
                    descricao: 'Prática de laboratório',
                    id_reservante: 7
                },
                {
                    id_sala: 1,
                    id_usuario: 1,
                    turma: '3ºC Mecatrônica',
                    hora_inicio: '2024-05-03T14:00:00.000Z',
                    hora_fim: '2024-05-03T16:50:00.000Z',
                    descricao: 'Aula teórica',
                    id_reservante: 8
                },
                {
                    id_sala: 1,
                    id_usuario: 1,
                    turma: '1ºD Informática',
                    hora_inicio: '2024-05-04T10:00:00.000Z',
                    hora_fim: '2024-05-04T12:50:00.000Z',
                    descricao: 'Exercícios práticos',
                    id_reservante: 6
                }
            ],
            dataInicio: '2024-01-04T14:00:00Z',
            dataFim: '2024-02-04T14:00:00Z'
        }
    },

    EnsalamentoPostResponse: {
        type: 'object',
        example: {
            code: 201,
            error: false,
            message: 'Ensalamento criado com sucesso!',
            data: {
                count: 18
            }
        }
    }
};

export default ensalamentoSchema;
