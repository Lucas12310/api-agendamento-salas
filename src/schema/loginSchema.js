import { z } from 'zod';

class LoginSchema{
    static loginSchema = z.object({
        siape: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw new Error('O campo \'siape\' fornecido não é um número válido.');
            }
            return parsed;
        })]),
        senha: z.string({
        required_error: 'Campo senha é obrigatório!',
        invalid_type_error: 'Formato da senha invalido, deve ser string!'
        }).min(8, {
        message: 'A senha deve possuir no minimo 8 caracteres!'
        }).refine(
        (value) =>
            /[a-z]/.test(value) &&  // Tem pelo menos uma letra minúscula
            /[A-Z]/.test(value) &&  // Tem pelo menos uma letra maiúscula
            /[0-9]/.test(value) &&  // Tem pelo menos um número
            /[^a-zA-Z0-9]/.test(value),  // Tem pelo menos um símbolo
        {
            message: 'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um símbolo.',
        }
        )
    });

}

export default LoginSchema;