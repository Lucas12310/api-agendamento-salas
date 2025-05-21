import { z } from 'zod';

class UsuarioSchema {
    static booleanTransform = z.union([z.boolean(), z.string()])
        .refine(value => typeof value === "boolean" || value === "true" || value === "false", {
            message: "Valor inválido, deve ser um booleano ou uma string 'true' ou 'false'"
        })
        .transform(value => (typeof value === "string" ? value === "true" : value));

    static usuarioSchema = z.object({
        id: z.number().int().positive(),
        nome: z.string().max(255, "Nome deve ter no máximo 255 caracteres"),
        email: z.string().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
        senha: z.string().max(255, "Senha deve ter no máximo 255 caracteres"),
        siape: z.union([z.number().int(), z.string()])
            .transform(value => parseInt(value, 10))
            .refine(value => !isNaN(value) && value > 0, {
                message: "SIAPE deve ser um número positivo"
            }),
        foto: z.string().max(255, "Foto deve ter no máximo 255 caracteres").nullable().optional(),
        dape: UsuarioSchema.booleanTransform,
        ativo: UsuarioSchema.booleanTransform,
    });

    static usuarioFilterSchema = z.object({
        id: z.union([z.number().int(), z.string()])
            .transform(value => parseInt(value, 10))
            .refine(value => !isNaN(value) && value > 0, {
                message: "Id deve ser um número positivo"
            }).optional(),
        nome: z.string().max(255).optional(),
        email: z.string().email().optional(),
        siape: z.union([z.number().int(), z.string()])
            .transform(value => parseInt(value, 10))
            .refine(value => !isNaN(value) && value > 0, {
                message: "SIAPE deve ser um número positivo"
            }).optional(),
        dape: UsuarioSchema.booleanTransform.optional(),
        ativo: UsuarioSchema.booleanTransform.optional(),
    });

    static usuarioIdSchema = z.object({
        id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && val > 0, {
            message: "ID deve ser um número inteiro positivo"
        })
    });

    static usuarioCreateSchema = UsuarioSchema.usuarioSchema.omit({ id: true });

    static usuarioUpdateSchema = UsuarioSchema.usuarioSchema.omit({ id: true }).partial();
}

export default UsuarioSchema;
