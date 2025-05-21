import SalaServices from "../../services/salaServices.js";
import SalaSchema from "../../schema/salaSchema.js";
import salaRepository from "../../repository/salaRepository.js";

// Mocking de dependências
jest.mock("../../repository/salaRepository.js");

describe('SalaServices', () => {
    // Teste das validações do Schema

    describe('Validações do Schema', () => {
        it('deve validar o filtro de sala corretamente com ID válido', () => {
            const filtro = { id: "123" }; // string que pode ser convertida em número
            const validado = SalaSchema.salaIdSchema.parse(filtro);
            expect(validado.id).toBe(123); // Espera-se que a string '123' seja convertida para número
        });

        it('deve lançar erro se ID no filtro não for válido', () => {
            const filtro = { id: "abc" }; // string não válida
            expect(() => {
                SalaSchema.salaIdSchema.parse(filtro);
            }).toThrowError('ID deve ser um número inteiro positivo');
        });

        it('deve validar o esquema de criação da sala', () => {
            const data = { bloco: 'A', andar: 2, nome: 'Sala de Reunião' };
            const salaValida = SalaSchema.salaCreateSchema.parse(data);
            expect(salaValida.bloco).toBe('A');
            expect(salaValida.andar).toBe(2);
            expect(salaValida.nome).toBe('Sala de Reunião');
        });

        it('deve lançar erro de validação no nome (tamanho excessivo)', () => {
            const data = { bloco: 'B', andar: 3, nome: 'A'.repeat(51) }; // Nome com mais de 50 caracteres
            expect(() => {
                SalaSchema.salaCreateSchema.parse(data);
            }).toThrowError('Nome deve ter no máximo 50 caracteres');
        });

        it('deve lançar erro de validação no bloco (tamanho excessivo)', () => {
            const data = { bloco: 'ABC', andar: 2, nome: 'Sala Teste' }; // Bloco com mais de 1 caractere
            expect(() => {
                SalaSchema.salaCreateSchema.parse(data);
            }).toThrowError('Andar deve ter no máximo 1 caracteres');
        });
    });
});
