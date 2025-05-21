import { z } from 'zod';

class ReservaSchema {
  
    static CamposReserva = z.object({
        id: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: 'O campo "id" fornecido não é um número válido.'
                };
            }
            return parsed;
        })]).optional(),
        
        id_sala: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: 'O campo "id_sala" fornecido não é um número válido.'
                };
            }
            return parsed;
        })]),
        
        id_usuario: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: 'O campo "id_usuario" fornecido não é um número válido.'
                };
            }
            return parsed;
        })]),
        
        turma: z.string().trim().min(1).max(100),
        
        hora_inicio: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'O campo hora_inicio deve ser do tipo dateTime',
        }).transform((val) => new Date(val)),
        
        hora_fim: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'O campo hora_fim deve ser do tipo ISO dateTime',
        }).transform((val) => new Date(val)),
        
        descricao: z.string().trim().max(200).optional(),
        
        id_reservante: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: 'O campo "id_reservante" precisa ser um número inteiro.'
                };
            }
            return parsed;
        })]),
        
        dia: z.string().refine((val) => {
            const dateParts = val.split('-');
            if (dateParts.length !== 3) return false;
            const [dia, mes, ano] = dateParts.map(Number);
            return dia > 0 && dia <= 31 && mes > 0 && mes <= 12 && !isNaN(ano);
        }, {
            message: 'O campo \'Dia\' deve estar no formato \'DD-MM-YYYY\'.',
        }).optional()
    });
    

    static IdReserva = z.object({
        id: z.union([z.number(), z.string().transform((val) => { 
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw {
                    error: true,
                    code: 400,
                    message: 'O campo "id" fornecido não é um número válido.'
                };
            }
            return parsed;
          })
        ])
    });
    
    static CamposReservaOptional = this.CamposReserva.partial();
}

export default ReservaSchema;