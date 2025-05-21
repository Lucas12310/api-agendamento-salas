import request from "supertest";
import { expect, it } from "@jest/globals";
import app from "../../app.js";

describe("Testes de autenticação com token /login", () => {
  it("Criar token, deve retonar: Token gerado com sucesso!", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        siape: "169875",
        senha: "Senha123@",
      });
    expect(response.status).toBe(200);
    expect(typeof response.body.accessToken).toBe("string");
    expect(typeof response.body.refreshToken).toBe("string");
    expect(response.body.accessToken).not.toBe("");
    expect(response.body.accessToken).not.toBeNull();
    expect(response.body.refreshToken).not.toBe("");
    expect(response.body.refreshToken).not.toBeNull();
  });

  it("Deve retornar erro quando tentar realizar login com dados invalidos", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        siape: "24861",
        senha: "Senha123",
      });

    expect(response.status).toBe(400);
  });
  it("Deve retornar erro quando tentar realizar login com dados invalidos", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        siape: " ",
        senha: "Senha123@",
      });
    expect(response.body.message).toBe(
      "O campo 'siape' fornecido não é um número válido."
    );
    expect(response.status).toBe(500);
  });
});
describe("Testes de refresh token /refresh", () => {
  it("deve retornar erro 500 ao passar o token invalido", async () => {
    const response = await request(app)
      .post("/refresh")
      .set("Content-Type", "application/json")
      .send({
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjo2LCJub21lIjoiQmVhdHJpeiBTYW50b3MiLCJlbWFpbCI6ImJlYXRyaXpAZXhhbXBsZS5jb20iLCJzaWFwZSI6MjQ4NjEzLCJmb3RvIjpudWxsLCJkYXBlIjpmYWxzZSwiYXRpdm8iOnRydWV9LCJpYXQiOjE3NDAwMjIyODMsImV4cCI6MTc0MDYyNzA4M30.MU1FB8FnAgKuVhOGl9k5tWHDhPFxC9j-ZjhxvcsIXZ",
      });
      expect(response.status).toBe(500);
  });

  it("deve retornar erro ao passar refreshtoken vazio", async () => {
    const response = await request(app)
      .post("/refresh")
      .set("Content-Type", "application/json")
      .send({
        refreshToken: "",
      });
    expect(response.body.error).toBe(
      "Acesso negado. Refresh token não fornecido"
    );
    //console.log(response.body.error)
  });
  it("deve retornar o novo accessToken", async () => {
    let token
    const login = await request(app).post('/login').send({ siape: '169875', senha: 'Senha123@' });
    token = login.body.refreshToken;
    
    const response = await request(app)
      .post("/refresh")
      .set("Content-Type", "application/json")
      .send({
        refreshToken: token,
      });
      expect(response.status).toBe(200);
      expect(response.body.refreshToken).not.toBe("");
    expect(response.body.refreshToken).not.toBeNull();
    //console.log(response.body.error)
  });
});
