import { z } from 'zod';

class SalaSchema {
    
    static salaFilterSchema = z.object({
        id: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: "O campo 'id' fornecido não é um número válido."
                };
            }
            return parsed;
        })]).optional(),
        bloco: z.string().trim().max(1).optional(),
        andar: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: "O campo 'andar' fornecido não é um número válido."
                };
            }
            return parsed;
        })]).optional(),
        nome: z.string().trim().max(50).optional(),
    });

    static salaIdSchema = z.object({
        id: z
            .string()
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val) && val > 0, {
                message: 'ID deve ser um número inteiro positivo'
            }).optional(),
    });

    static salaSchema = z.object({
        bloco: z.string().trim().max(1, 'Andar deve ter no máximo 1 caracteres'),
        andar: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: "O campo 'andar' fornecido não é um número válido."
                };
            }
            return parsed;
        })]).optional(),
        nome: z.string().trim().max(50, 'Nome deve ter no máximo 50 caracteres'),
    });
    
    static salaCreateSchema = SalaSchema.salaSchema;

    static salaUpdateSchema = SalaSchema.salaSchema;
}

export default SalaSchema;