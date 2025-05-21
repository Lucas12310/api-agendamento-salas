import request from 'supertest';
import app from '../../app.js';

describe('UsuarioController - Testes de Integração', () => {
    let token;
    let userId;

    // Autentica e obtém o token antes de executar os testes
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send({ siape: '248613', senha: 'Senha123@' });

        if (loginResponse.status !== 200) {
            throw new Error('Falha ao obter o token de autenticação');
        }

        token = loginResponse.body.accessToken;
    });

    describe('GET /usuario - listar', () => {
        it('deve retornar 200 e listar usuários com sucesso', async () => {
            const response = await request(app)
                .get('/usuario')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).not.toBeNull();
            expect(Array.isArray(response.body.data)).toBe(true);

            if (response.body.data.length > 0) {
                const firstUser = response.body.data[0];
                userId = firstUser.id;
                expect(firstUser).toHaveProperty('id');
                expect(firstUser).toHaveProperty('nome');
                expect(firstUser).toHaveProperty('email');
                expect(firstUser).toHaveProperty('siape');
                expect(firstUser).toHaveProperty('foto');
            }

            expect(response.body).toHaveProperty('totalCount');
            expect(response.body).toHaveProperty('totalPages');
            expect(response.body).toHaveProperty('currentPage');
        });

        it('deve retornar 200 e listar usuários com sucesso, adicionando parâmetros', async () => {
            const queryParams = {
                id: 1,
                nome: 'João',
                email: 'joao.silva@example.com',
                siape: 357296,
                dape: 'true',
                ativo: 'false',
            };

            const response = await request(app)
                .get('/usuario')
                .query(queryParams) // Add query parameters
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).not.toBeNull();
            expect(Array.isArray(response.body.data)).toBe(true);

            if (response.body.data.length > 0) {
                const firstUser = response.body.data[0];
                userId = firstUser.id;
                expect(firstUser).toHaveProperty('id');
                expect(firstUser).toHaveProperty('nome');
                expect(firstUser).toHaveProperty('email');
                expect(firstUser).toHaveProperty('siape');
                expect(firstUser).toHaveProperty('foto');
            }

            expect(response.body).toHaveProperty('totalCount');
            expect(response.body).toHaveProperty('totalPages');
            expect(response.body).toHaveProperty('currentPage');
        });
        it('deve retornar 400 e listar usuários com id invalido', async () => {
            const queryParams = {
                id: "a"
            };
            const response = await request(app)
                .get('/usuario')
                .query(queryParams) // Add query parameters
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].message).toBe('Id deve ser um número positivo');
        });
    });

    describe('POST /usuario - inserir', () => {
        it('deve retornar 201 e criar um novo usuário com sucesso', async () => {
            const usuario = {
                nome: "João da Silva",
                email: "joao.silva@example.com",
                senha: "Senha123@",
                siape: 357296,
                foto: "https://exemplo.com/foto.jpg",
                dape: false,
                ativo:true
            };

            const response = await request(app)
                .post('/usuario')
                .set('Authorization', `Bearer ${token}`)
                .send(usuario);

            const { senha, ...expectedUser } = usuario;

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Usuario criado com sucesso!');
            expect(response.body.data).toMatchObject(expectedUser);
        });

        it('deve retornar 400 ao falhar na criação', async () => {
            const usuario = {
                nome: "João da Silva",
                email: "joao.silva@example.com",
                senha: "Senha123@",
                foto: "https://exemplo.com/foto.jpg",
            };

            const response = await request(app)
                .post('/usuario')
                .set('Authorization', `Bearer ${token}`)
                .send(usuario);

            expect(response.status).toBe(400);
            expect(response.body).toEqual(
                expect.objectContaining({
                    error: true,
                    code: 400,
                })
            );
        });
        it('deve retornar 500 ao tentar criar usuario com email ja usado', async () => {
            const usuario = {
                nome: "João da Silva",
                email: "rodrigo@example.com",
                senha: "Senha123@",
                siape: 123456,
                foto: "https://exemplo.com/foto.jpg",
                dape: true,
                ativo: true
            };

            const response = await request(app)
                .post('/usuario')
                .set('Authorization', `Bearer ${token}`)
                .send(usuario);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Este email já está em uso");
        });

    });

    describe('PATCH /usuario/:id - atualizar', () => {
        it('deve retornar 202 e atualizar um usuário com sucesso', async () => {
            const response = await request(app)
                .patch(`/usuario/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Carlos',
                    email: 'carlos@example.com',
                });

            expect(response.statusCode).toBe(202);
            expect(response.body).toHaveProperty('message', 'Usuario atualizado com sucesso!');
        });

        it('deve retornar 400 ao falhar na atualização', async () => {
            const response = await request(app)
                .patch(`/usuario/invalid`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Carlos',
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].message).toBe("ID deve ser um número inteiro positivo")
        });
    });

    describe('DELETE /usuario/:id - excluir', () => {
        it('deve retornar 204 e deletar um usuário com sucesso', async () => {
            const response = await request(app)
                .delete(`/usuario/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        });

        it('deve retornar 400 ao falhar na exclusão', async () => {
            const response = await request(app)
                .delete(`/usuario/invalid`)
                .set('Authorization', `Bearer ${token}`)

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].message).toBe("ID deve ser um número inteiro positivo")
        });
    });
});
