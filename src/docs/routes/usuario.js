import usuarioSchemas from "../schemas/usuario.js";

const usuarioRoutes = {
    "/usuario": {
        get: {
            tags: ["Usuário"],
            summary: "Lista todos os usuários cadastrados",
            parameters: [
                {
                    name: "id",
                    in: "query",
                    required: false,
                    schema: {
                        $ref: "#/components/schemas/usuarioFiltro/properties/id"
                    },
                    description: "ID do usuário"
                },
                {
                    name: "nome",
                    in: "query",
                    required: false,
                    schema: {
                        $ref: "#/components/schemas/usuarioFiltro/properties/nome"
                    },
                    description: "Nome do usuário"
                },
                {
                    name: "email",
                    in: "query",
                    required: false,
                    schema: {
                        $ref: "#/components/schemas/usuarioFiltro/properties/email"
                    },
                    description: "Email do usuário"
                },
                {
                    name: "ativo",
                    in: "query",
                    required: false,
                    schema: {
                        $ref: "#/components/schemas/usuarioFiltro/properties/ativo"
                    },
                    description: "Status de atividade do usuário"
                }
            ],
            responses: {
                200: {
                    description: "Requisição bem sucedida",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/usuarioListagemResposta" } } }
                },
                400: {
                    description: "Parâmetros inválidos",
                    content: { "application/json": { schema: { type: "object", example: { error: true, code: 400, message: ["ID deve ser um número inteiro positivo", "Email inválido"] } } } }
                }
            }
        },
        post: {
            tags: ["Usuário"],
            summary: "Cria um novo usuário",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/usuarioDetalhes"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Usuário criado com sucesso",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/usuarioPostResposta" } } }
                },
                400: {
                    description: "Dados inválidos",
                    content: { "application/json": { schema: { type: "object", example: { error: true, code: 400, message: ["Nome é obrigatório", "Email já cadastrado"] } } } }
                }
            }
        }
    },
    "/usuario/{id}": {
        patch: {
            tags: ["Usuário"],
            summary: "Atualiza dados de um usuário",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "ID do usuário",
                    example: 1
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/usuarioDetalhes"
                        }
                    }
                }
            },
            responses: {
                202: {
                    description: "Usuário atualizado com sucesso",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/usuarioPutResponse" } } }
                },
                400: {
                    description: "Dados inválidos",
                    content: { "application/json": { schema: { type: "object", example: { error: true, code: 400, message: ["Usuário não encontrado", "Email inválido"] } } } }
                }
            }
        },
        delete: {
            tags: ["Usuário"],
            summary: "Deleta um usuário",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "ID do usuário",
                    example: 1
                }
            ],
            responses: {
                204: {
                    description: "Usuário deletado com sucesso"
                },
                400: {
                    description: "Erro ao deletar usuário",
                    content: { "application/json": { schema: { type: "object", example: { error: true, code: 400, message: ["Usuário não encontrado", "ID deve ser um número inteiro positivo"] } } } }
                }
            }
        }
    }
};

export { usuarioRoutes };