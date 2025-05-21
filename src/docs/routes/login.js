

const loginRouter = {
  '/login': {
    post: {
      tags: ['Login'],
      summary: 'Realiza login',
      requestBody: {
        content: {
          'application/json': {
            schema: {
                type: 'object',
                properties: {
                    siape: { type: 'string', example: '169875' },
                    senha: { type: 'string', example: 'Senha123@' }
                },
                required: ['siape', 'senha']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Requisição bem sucedida',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RespostaLogin' } } }
        },
        400: {
          description: "",
          content: { "application/json": { schema: {type: 'object', example:{ error: true, code: 400, message: ["Usuario não encontrado!","Usuario inativo!","Senha invalida!","O campo 'siape' fornecido não é um número válido.",'Campo senha é obrigatório!','Formato da senha invalido, deve ser string!',"A senha deve possuir no minimo 8 caracteres!","A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um símbolo."]}} } }
        }
      }
    }
  }
};

export { loginRouter };
