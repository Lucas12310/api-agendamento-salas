import request from "supertest";
import { expect, describe } from "@jest/globals";
import { prisma } from "../../configs/prismaClient.js";
import app from "../../app.js";

// ---------------- Login ----------------
let token;
let idvalido;
let dadosvalidos
it('Login com autenticação jwt', async () => {
    const response = await request(app)
        .post("/login")
        .send({
            siape: 248613,
            senha: "Senha123@"
        })
        .expect(200)
    token = response.body.accessToken;
})

// ----------- Cadastrar Sala ---------

describe("Cadastrar Sala", () => {
    it('Deve cadastrar uma sala com dados válidos', async () => {
        const response = await request(app)
            .post('/sala')
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send({
                bloco:"A",
                andar:1,
                nome:"Sala de TI",
            });
        expect(response.status).toBe(201);
        idvalido = response.body.data.id
        dadosvalidos = response.body.data
    });
     it('Deve retornar erro ao tentar cadastra sala com parametros invalidos', async () => {
         const response = await request(app)
             .post('/sala')
             .set("Authorization", `Bearer ${token}`)
             .set("Content-Type", "application/json")
             .send({
                 bloco:1,
                 andar:"1",
                 nome:1
             });
         expect(response.status).toBe(400);
     });
     it('Deve retornar erro ao tentar cadastra sala com andar invalidos', async () => {
        const response = await request(app)
            .post('/sala')
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send({
                bloco:"E",
                andar:"a",
                nome:"teste de sala"
            });
        expect(response.status).toBe(400);
    });
 });
 // ----------- listar Sala ---------
 describe("Listar Sala", () => {
     it('Deve listar a sala conforme parametros passados', async () => {
         const response = await request(app)
             .get(`/sala?id=${idvalido}&bloco=${dadosvalidos.bloco}&andar=${dadosvalidos.andar}&nome=${dadosvalidos.nome}`)
             .set("Authorization", `Bearer ${token}`)
             .set("Content-Type", "application/json")
         const body = response.body;
         expect(response.status).toBe(200);
         expect(body.data).toBeInstanceOf(Array);
         expect(response.body.message).toBe("Listado com sucesso!")
         expect(response.body.error).toBe(false) 
     });
     it('Deve retornar erro ao tentar listar sala com id invalido', async () => {
         const response = await request(app)
             .get(`/sala?id=10000000`)
             .set("Authorization", `Bearer ${token}`)
             .set("Content-Type", "application/json")
         expect(response.status).toBe(400);
     });
     it('Deve retornar erro ao tentar listar sala com id invalido', async () => {
        const response = await request(app)
            .get(`/sala?id=a`)
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
        expect(response.status).toBe(400);
    });
    it('Deve retornar erro ao tentar listar sala com andar invalido', async () => {
        const response = await request(app)
            .get(`/sala?andar=a`)
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
        expect(response.status).toBe(400);
    });

 })
 // ----------- atualizar Sala ---------
 describe("Atualizar sala", () => {
     it('Atualização dos dados de uma sala', async () => {
         const updatedData = {
             bloco:"Z",
             andar:6,
             nome:"Sala de Engenharia"
         }
         const sala = await prisma.sala.findFirst({
             where: {
                 id: idvalido
             }
         });
         const response = await request(app)
             .patch(`/sala/${idvalido}`)
             .set("Authorization", `Bearer ${token}`)
             .set("Content-Type", "application/json")
             .send(updatedData);
         expect(response.status).toBe(202);
         expect(response.body.message).toMatch("Sala atualizada com sucesso!");
         expect(response.body.data).toHaveProperty('bloco', updatedData.bloco);
         expect(response.body.data).toHaveProperty('andar', updatedData.andar);
         expect(response.body.data).toHaveProperty('nome', updatedData.nome);
     });
     it('deve retornar erro ao atualizar com id desconhecido', async () => {
         const response = await request(app)
             .patch(`/sala/100000000`)
             .set("Authorization", `Bearer ${token}`)

         expect(response.status).toBe(400);
         expect(response.body.message).toBe("Sala não encontrada!")
     });
 });
   // ----------- Excluir Sala ---------
   describe("Excluir sala", () => {
     it('Deve excluir a sala', async () => {
         const response = await request(app)
             .delete(`/sala/${idvalido}`)
             .set("Authorization", `Bearer ${token}`)
             .set("Content-Type", "application/json")
         expect(response.status).toBe(204);
     });
     it('deve retornar erro ao atualizar com id desconhecido', async () => {
         const response = await request(app)
             .delete(`/sala/100000000`)
             .set("Authorization", `Bearer ${token}`)
         expect(response.status).toBe(400);
         expect(response.body.message).toBe("Sala não encontrada!")
     });
});