const salaSchemas = {
    salaFiltro: {
        type: 'object',
        properties: {
            id:     {type: 'integer',   description: 'ID da sala'                       },
            bloco:  {type: 'string',    description: 'Bloco onde a sala esta localizada'},
            andar:  {type: 'integer',   description: 'Andar onde a sala esta localizada'},
            nome:   {type: 'string',    description: 'Nome da sala'                     }
        }
    },
    salaListagemResposta: {
        type: 'object',
        example:{
            message: 'Listado com sucesso!',
            error: false,
            code: 200,
            data: {
                id: 1,
                bloco: 'A',
                andar: 1,
                nome: 'SALA 1'
        }}
    },
    salaDetalhes: {
        type: 'object',
        properties: {
            bloco:  {type: 'string',    description: 'Bloco onde a sala esta localizada'},
            andar:  {type: 'integer',   description: 'Andar onde a sala esta localizada'},
            nome:   {type: 'string',    description: 'Nome da sala'                     }
        },
        example: {
            bloco: 'A',
            andar: 1,
            nome: 'SALA 1'
        }
    },
    salaPostResposta: {
        type: 'object',
        required: ['bloco', 'andar', 'nome'],
        properties: {
            bloco:  {type: 'string',    description: 'Bloco onde a sala esta localizada'},
            andar:  {type: 'integer',   description: 'Andar onde a sala esta localizada'},
            nome:   {type: 'string',    description: 'Nome da sala'                     }
        },
        example: {
            message: 'Sala criada com sucesso!',
            error: false,
            code: 200,
            data: {
                id: 1,
                bloco: 'A',
                andar: 1,
                nome: 'SALA 1'
            }
        }
    },
    salaPutResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Sala atualizada com sucesso!' },
          error: { type: 'boolean', example: false },
          code: { type: 'integer', example: 202 },
          data: {
            type: 'object',
            properties: {
                bloco:  {type: 'string',    description: 'Bloco onde a sala esta localizada',example:'A'          },
                andar:  {type: 'integer',   description: 'Andar onde a sala esta localizada',example: 1           },
                nome:   {type: 'string',    description: 'Nome da sala'                     ,example: 'Sala de TI'}
            }
          }
        },
        example: {
          message: 'Sala atualizada com sucesso!',
          error: false,
          code: 202,
          data: {
            id: 1,
            bloco: 'A',
            andar: 1,
            nome: 'SALA 1'
          }
        }
      }
};
export default salaSchemas;
