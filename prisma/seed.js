import { prisma } from '../src/configs/prismaClient.js';

async function seed() {

  // Deleta todos os dados existentes nas tabelas
  await prisma.reserva.deleteMany();
  await prisma.sala.deleteMany();
  await prisma.usuario.deleteMany();

  // Reseta a sequência de IDs (ajuste o comando para o seu banco de dados)
  await prisma.$executeRawUnsafe('ALTER TABLE usuario AUTO_INCREMENT = 1;');
  await prisma.$executeRawUnsafe('ALTER TABLE sala AUTO_INCREMENT = 1;');
  await prisma.$executeRawUnsafe('ALTER TABLE reserva AUTO_INCREMENT = 1;');


  // Insere novos dados na tabela `usuario`
  await prisma.usuario.createMany({
    data: [
      { id: 1, nome: 'Carlos Silva', email: 'carlos@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 123456, foto: null, dape: true, ativo: false },
      { id: 2, nome: 'Ana Pereira', email: 'ana@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 456789, foto: null, dape: true, ativo: false },
      { id: 3, nome: 'João Souza', email: 'joao@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 147258, foto: null, dape: true, ativo: false },
      { id: 4, nome: 'Maria Oliveira', email: 'maria@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 258369, foto: null, dape: true, ativo: false },
      { id: 5, nome: 'Lucas Lima', email: 'lucas@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 159732, foto: null, dape: true, ativo: false },
      { id: 6, nome: 'Beatriz Santos', email: 'beatriz@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 248613, foto: null, dape: false, ativo: true },
      { id: 7, nome: 'Pedro Costa', email: 'pedro@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 123789, foto: null, dape: false, ativo: true },
      { id: 8, nome: 'Julia Gomes', email: 'julia@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 147123, foto: null, dape: false, ativo: true },
      { id: 9, nome: 'Fernanda Alves', email: 'fernanda@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 369874, foto: null, dape: false, ativo: true },
      { id: 10, nome: 'Rodrigo Ramos', email: 'rodrigo@example.com', senha: '$2a$10$BZT9CNJZ6Nd7RzRd.04Wp.wyGgRA2nN7grTQgCvDySzoepww.WCA6', siape: 169875, foto: null, dape: true, ativo: true },
    ],
  });

  // Insere novos dados na tabela `sala`
  await prisma.sala.createMany({
    data: [
      { id: 1, bloco: 'A', andar: 1, nome: 'Laboratório 1' },
      { id: 2, bloco: 'A', andar: 1, nome: 'Laboratório 2' },
      { id: 3, bloco: 'B', andar: 2, nome: 'SALA 1' },
      { id: 4, bloco: 'C', andar: 1, nome: 'SALA 1' },
      { id: 5, bloco: 'A', andar: 2, nome: 'Laboratório 3' },
      { id: 6, bloco: 'B', andar: 1, nome: 'SALA 2' },
      { id: 7, bloco: 'C', andar: 2, nome: 'SALA 2' },
      { id: 8, bloco: 'A', andar: 1, nome: 'Laboratório 4' },
      { id: 9, bloco: 'B', andar: 2, nome: 'SALA 3' },
      { id: 10, bloco: 'C', andar: 2, nome: 'SALA 3' },
    ],
  });

  // Insere novos dados na tabela `reserva`
  await prisma.reserva.createMany({
    data: [
      { id: 1, id_sala: 1, id_usuario: 1, turma: '1ºA Informatica', hora_inicio: '2024-01-02T14:00:00Z', hora_fim: '2024-01-02T14:50:00Z', descricao: 'Reforço', id_reservante: 1 },
      { id: 2, id_sala: 2, id_usuario: 2, turma: '1ºB Informatica', hora_inicio: '2024-01-01T13:00:00Z', hora_fim: '2024-01-01T13:50:00Z', descricao: 'Aula', id_reservante: 2 },
      { id: 3, id_sala: 3, id_usuario: 3, turma: '1ºC Informatica', hora_inicio: '2024-01-03T08:00:00Z', hora_fim: '2024-01-03T08:50:00Z', descricao: 'Reforço', id_reservante: 3 },
      { id: 4, id_sala: 4, id_usuario: 4, turma: '2ºA Informatica', hora_inicio: '2024-01-04T14:00:00Z', hora_fim: '2024-01-04T14:50:00Z', descricao: 'Aula', id_reservante: 4 },
      { id: 5, id_sala: 5, id_usuario: 5, turma: '2ºB Informatica', hora_inicio: '2024-01-05T08:00:00Z', hora_fim: '2024-01-05T08:50:00Z', descricao: 'Aula', id_reservante: 5 },
      { id: 6, id_sala: 6, id_usuario: 6, turma: '2ºC Informatica', hora_inicio: '2024-01-06T14:00:00Z', hora_fim: '2024-01-06T14:50:00Z', descricao: 'Reforço', id_reservante: 6 },
      { id: 7, id_sala: 7, id_usuario: 7, turma: '3ºA Informatica', hora_inicio: '2024-01-07T08:00:00Z', hora_fim: '2024-01-07T08:50:00Z', descricao: 'Aula', id_reservante: 7 },
      { id: 8, id_sala: 8, id_usuario: 8, turma: '1ºA Edificações', hora_inicio: '2024-01-08T14:00:00Z', hora_fim: '2024-01-08T14:50:00Z', descricao: 'Aula', id_reservante: 8 },
      { id: 9, id_sala: 9, id_usuario: 9, turma: '2ºA Edificações', hora_inicio: '2024-01-09T13:00:00Z', hora_fim: '2024-01-09T13:50:00Z', descricao: 'Aula', id_reservante: 9 },
      { id: 10, id_sala: 10, id_usuario: 10, turma: '3ºA Edificações', hora_inicio: '2025-01-10T13:00:00Z', hora_fim: '2025-01-10T13:50:00Z', descricao: 'Reforço', id_reservante: 10 },
    ],
  });



  console.log('Seed criado com sucesso!');
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
