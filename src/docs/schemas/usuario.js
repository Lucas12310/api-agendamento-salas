const usuarioSchemas = {
    usuarioFiltro: {
        type: "object",
        properties: {
            id: { type: "integer", description: "ID do usuário" },
            nome: { type: "string", description: "Nome do usuário" },
            email: { type: "string", description: "Email do usuário" },
            siape: { type: "integer", description: "Número SIAPE do usuário" },
            foto: { type: "string", description: "URL da foto do usuário", nullable: true },
            dape: { type: "boolean", description: "Indica se o usuário é DAPE" },
            ativo: { type: "boolean", description: "Indica se o usuário está ativo" },
        }
    },
    usuarioListagemResposta: {
        type: "object",
        example: {
            error: false,
            code: 200,
            message: "Listado com sucesso!",
            data: [
                {
                    id: 1,
                    nome: "João da Silva",
                    email: "joao.silva@example.com",
                    siape: 123456,
                    foto: "https://exemplo.com/foto.jpg",
                    dape: true,
                    ativo: true,
                },
                {
                    id: 2,
                    nome: "Maria Souza",
                    email: "maria.souza@example.com",
                    siape: 654321,
                    foto: null,
                    dape: false,
                    ativo: true,
                }
            ]
        }
    },
    usuarioDetalhes: {
        type: "object",
        properties: {
            id: { type: "integer", description: "ID do usuário" },
            nome: { type: "string", description: "Nome do usuário" },
            email: { type: "string", description: "Email do usuário" },
            siape: { type: "integer", description: "Número SIAPE do usuário" },
            foto: { type: "string", description: "URL da foto do usuário", nullable: true },
            dape: { type: "boolean", description: "Indica se o usuário é DAPE" },
            ativo: { type: "boolean", description: "Indica se o usuário está ativo" },
        },
        example: {
            id: 1,
            nome: "João da Silva",
            email: "joao.silva@example.com",
            siape: 123456,
            foto: "https://exemplo.com/foto.jpg",
            dape: true,
            ativo: true,
        }
    },
    usuarioPostResposta: {
        type: "object",
        required: ["nome", "email", "siape", "dape", "ativo"],
        properties: {
            id: { type: "integer", description: "ID do usuário" },
            nome: { type: "string", description: "Nome do usuário" },
            email: { type: "string", description: "Email do usuário" },
            senha: { type: "string", description: "Senha do usuário" },
            siape: { type: "integer", description: "Número SIAPE do usuário" },
            foto: { type: "string", description: "URL da foto do usuário", nullable: true },
            dape: { type: "boolean", description: "Indica se o usuário é DAPE" },
            ativo: { type: "boolean", description: "Indica se o usuário está ativo" },
        },
        example: {
            error: false,
            code: 201,
            message: "Usuário criado com sucesso!",
            data: {
                id: 1,
                nome: "João da Silva",
                email: "joao.silva@example.com",
                siape: 123456,
                foto: "https://exemplo.com/foto.jpg",
                dape: true,
                ativo: true,
            }
        }
    },
    usuarioPutResponse: {
        type: "object",
        properties: {
            message: { type: "string", example: "Usuário atualizado com sucesso!" },
            error: { type: "boolean", example: false },
            code: { type: "integer", example: 202 },
            data: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    nome: { type: "string", example: "João da Silva" },
                    email: { type: "string", example: "joao.silva@example.com" },
                    siape: { type: "integer", example: 123456 },
                    foto: { type: "string", example: "https://exemplo.com/foto.jpg" },
                    dape: { type: "boolean", example: true },
                    ativo: { type: "boolean", example: true },
                }
            }
        },
        example: {
            message: "Usuário atualizado com sucesso!",
            error: false,
            code: 202,
            data: {
                id: 1,
                nome: "João da Silva",
                email: "joao.silva@example.com",
                siape: 123456,
                foto: "https://exemplo.com/foto.jpg",
                dape: true,
                ativo: true,
            }
        }
    }
};

export default usuarioSchemas;
