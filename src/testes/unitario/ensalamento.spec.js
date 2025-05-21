import EnsalamentoServices from "../../services/ensalamentoServices.js";
import ReservaRepository from "../../repository/reservaRepository.js";
import SalaRepository from "../../repository/salaRepository.js";
import UsuarioRepository from "../../repository/usuarioRepository.js";
import { z } from "zod";
import ReservaServices from "../../services/reservaServices.js";

// Mock dos repositórios
jest.mock("../../repository/reservaRepository.js");
jest.mock("../../repository/salaRepository.js");
jest.mock("../../repository/usuarioRepository.js");
const usuarioLogado = { dape: true };
describe("EnsalamentoServices.inserir", () => {
  const validData = [
    {
      id_sala: 4,
      id_usuario: 2,
      turma: "aa1",
      hora_inicio: "2025-02-01T21:00:00.020Z",
      hora_fim: "2025-02-01T22:45:00.000Z",
      descricao: "Aula de Matemática",
      id_reservante: 5
    },
    {
      id_sala: 4,
      id_usuario: 3,
      turma: "aa2",
      hora_inicio: "2025-02-01T21:16:00.000Z",
      hora_fim: "2025-02-01T23:00:00.000Z",
      descricao: "Aula de Física",
      id_reservante: 6
    }
  ];
  const dataInicio = new Date("2025-02-07T13:00:00.000Z");
  const dataFim = new Date("2025-05-03T08:50:00.000Z");

  beforeEach(() => {
    UsuarioRepository.findById.mockResolvedValue({ id: 2 });
    SalaRepository.findById.mockResolvedValue({ id: 4 });
    jest.clearAllMocks();
  });

  it("deve lançar erro se o campo data não for um array ou estiver vazio", async () => {
    await expect(EnsalamentoServices.inserir("", dataInicio, dataFim, usuarioLogado)).rejects.toMatchObject({
      message: "O campo Ensalamento deve ser do tipo array e não pode estar vazio",
      code: 400
    });
  });

  it("deve lançar erro se algum id de referência (usuário, reservante ou sala) não existir", async () => {
    UsuarioRepository.findById.mockResolvedValueOnce(null);
    await expect(EnsalamentoServices.inserir(validData, dataInicio, dataFim, usuarioLogado)).rejects.toMatchObject({
      message: "Não existe um usuário com este id: 2 em (id_usuario)",
      code: 400
    });
  });

  it("deve lançar erro se dataFim for anterior a dataInicio", async () => {
    const invalidDataFim = new Date("2025-01-01T00:00:00.000Z");
    await expect(EnsalamentoServices.inserir(validData, dataInicio, invalidDataFim, usuarioLogado)).rejects.toMatchObject({
      errors: [
        {
            code: "custom",
            message: "dataFim deve ser posterior a dataInicio",
            path: ["dataFim"]
        }
    ]}
    );
  });

  it("deve criar reservas com horários repetitivos sem conflitos", async () => {
    UsuarioRepository.findById.mockResolvedValue({ id: 2 });
    SalaRepository.findById.mockResolvedValue({ id: 4 });
    UsuarioRepository.findById.mockResolvedValue({ id: 5 });
    ReservaRepository.lista.mockResolvedValue({data:[]});
    ReservaRepository.createMany.mockResolvedValue("Reservas criadas com sucesso");

    const novaData = [
      {
        "id_sala": 1,
        "id_usuario": 1,
        "turma": "2ºB Eletrônica",
        "hora_inicio": "2024-05-02T09:00:00.000Z",
        "hora_fim": "2024-05-02T11:50:00.000Z",
        "descricao": "Prática de laboratório",
        "id_reservante": 7
      },
      {
        "id_sala": 1,
        "id_usuario": 1,
        "turma": "3ºC Mecatrônica",
        "hora_inicio": "2024-05-03T14:00:00.000Z",
        "hora_fim": "2024-05-03T16:50:00.000Z",
        "descricao": "Aula teórica",
        "id_reservante": 8
      },
      {
        "id_sala": 1,
        "id_usuario": 1,
        "turma": "1ºD Informática",
        "hora_inicio": "2024-05-04T10:00:00.000Z",
        "hora_fim": "2024-05-04T12:50:00.000Z",
        "descricao": "Exercícios práticos",
        "id_reservante": 6
      }
    ]
    const response = await EnsalamentoServices.inserir(novaData, dataInicio, dataFim, usuarioLogado);
    expect(response).toBe("Reservas criadas com sucesso");
  });

  // it("deve criar dar conflito nas reservas", async () => {
  //   UsuarioRepository.findById.mockResolvedValue({ id: 2 });
  //   SalaRepository.findById.mockResolvedValue({ id: 4 });
  //   UsuarioRepository.findById.mockResolvedValue({ id: 5 });
  //   ReservaRepository.lista.mockResolvedValue({data:[]});
  //   ReservaRepository.createMany.mockResolvedValue("Reservas criadas com sucesso");

  //   const novaData = [
  //     {
  //       "id_sala": 5,
  //       "id_usuario": 1,
  //       "turma": "----------",
  //       "hora_inicio": "2024-01-05T08:00:00Z",
  //       "hora_fim": "2024-05-02T11:50:00.000Z",
  //       "descricao": "Prática de laboratório",
  //       "id_reservante": 7
  //     },
  //     {
  //       "id_sala": 1,
  //       "id_usuario": 1,
  //       "turma": "22222222222",
  //       "hora_inicio": "2024-05-03T14:00:00.000Z",
  //       "hora_fim": "2024-05-03T16:50:00.000Z",
  //       "descricao": "Aula teórica",
  //       "id_reservante": 8
  //     },
  //     {
  //       "id_sala": 1,
  //       "id_usuario": 1,
  //       "turma": "3333333333333333",
  //       "hora_inicio": "2024-05-04T10:00:00.000Z",
  //       "hora_fim": "2024-05-04T12:50:00.000Z",
  //       "descricao": "Exercícios práticos",
  //       "id_reservante": 6
  //     }
  //   ]
  //   const response = await EnsalamentoServices.inserir(novaData, dataInicio, dataFim, usuarioLogado);
  //   expect(response).toBe("Reservas criadas com sucesso");
  // });
});
