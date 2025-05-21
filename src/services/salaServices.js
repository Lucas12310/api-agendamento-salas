import salaRepository from "../repository/salaRepository.js";
import SalaSchema from "../schema/salaSchema.js";

class SalaServices{
    static async listar(filtro, page = 1, limit = 10) {
        
        const validatedFilter = SalaSchema.salaFilterSchema.parse(filtro);
        const response = await salaRepository.findMany(validatedFilter, page, limit);
        if(response.data.length === 0){
            throw{
                message:"Sala não encontrada!",
                code:400
            }
        }
        return response;
    }

    static async inserir(data) {
        const validatedData = SalaSchema.salaCreateSchema.parse(data);
        const response = await salaRepository.create(validatedData);
        return response;
    }

    static async atualizar(id, data) {
        const validatedId = SalaSchema.salaIdSchema.parse(id);
        const validatedSala = await salaRepository.findById(validatedId.id);
        if(!validatedSala){
            throw{
                message:"Sala não encontrada!",
                code:400
            }
        }
        const validatedData = SalaSchema.salaUpdateSchema.parse(data);
        const response = await salaRepository.update(validatedSala.id, validatedData);
        return response;
    }

    static async excluir(id) {
        const validatedId = SalaSchema.salaIdSchema.parse(id);
        const sala = await salaRepository.findById(validatedId.id);
        if(!sala){
            throw{
                message:"Sala não encontrada!",
                code:400
            }
        }
        const response = await salaRepository.delete(sala.id);
        return response;
    }

}

export default SalaServices;