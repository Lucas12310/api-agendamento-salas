import { z } from 'zod';

class EnsalamentoSchema{

    static listarEnsalamento = z.object({
        id_ensalamento: z.number().min(1).max(200).optional(),
        data_inicio_ensalamento: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Este campo deve ser do tipo ISO 8601!',
        }).transform((val) => new Date(val)).optional(),
        data_fim_ensalamento: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Este campo deve ser do tipo ISO 8601!',
        }).transform((val) => new Date(val)).optional(),
        horario_ensalamento: z.string().trim().min(1).max(200).optional(),
        repetir: z.string().optional(),
        dape_n_siape_dape: z.string().trim().min(1).max(200).optional(),
        docente_n_siape: z.string().trim().min(1).max(200).optional(),
        sala_id_sala: z.number().min(1).max(200).optional(),
    });


    static listarEnsalamentoPorId = z.object({id_ensalamento: z.number().min(1)});

    static criarEnsalamento = z.object({
        data_inicio_ensalamento: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Data de inicio do ensalamento é obrigatório e deve ser uma string!!',
        }).transform((val) => new Date(val)),
        data_fim_ensalamento: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Data Final do ensalamento é obrigatório e deve ser uma string!!',
        }).transform((val) => new Date(val)),
        horario_ensalamento: z.string({
            message: 'Horário de ensalamento é obrigatório e deve se uma string!'
        }).trim().min(1).max(200),
        repetir: z.string({
            message: 'Campo repetir é obrigatório e deve ser uma string!'
        }),
        dape_n_siape_dape: z.string({
            message: 'O número do siape de dape é obrigatório e deve ser uma string!'
        }).trim().min(1).max(200),
        docente_n_siape: z.string({
            message: 'O número do siape do docente é obrigatório e deve ser uma string!'
        }).trim().min(1).max(200),
        sala_id_sala: z.number({
            message: 'Sala é obrigatório e deve ser um número!'
        }).min(1).max(200).optional(),
    });
}

export default EnsalamentoSchema;