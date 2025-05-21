import { prisma } from '../configs/prismaClient.js';

class SalaRepository {
    static async findMany(filtros, page, limit) {
        page = Math.max(page, 1);
        limit = Math.max(limit, 1);

        const skip = (page - 1) * limit;
        const take = limit;

        // Adiciona suporte ao filtro parcial no nome
        const where = {};
        if (filtros.nome) {
            where.nome = {
                startsWith: filtros.nome, // Busca parcial
            };
        }

        // Adiciona outros filtros (se houver)
        const additionalFilters = { ...filtros };
        delete additionalFilters.nome; // Remove 'nome' para evitar duplicação
        Object.assign(where, additionalFilters);

        const data = await prisma.sala.findMany({
            skip,
            take,
            where,
            orderBy: { id: 'desc' },
            select: {
                id: true,
                bloco: true,
                andar: true,
                nome: true
            }
        });

        const totalCount = await prisma.sala.count();
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data,
            totalCount,
            totalPages,
            currentPage: page,
        };
    }

    static async findById(id) {
        return await prisma.sala.findUnique({ where: { id: id } });
    }

    static async create(data) {
        return await prisma.sala.create({ data: data });
    }

    static async update(id, data) {
        return await prisma.sala.update({ where: { id: id }, data: data });
    }

    static async delete(id) {
        return await prisma.sala.delete({ where: { id: id } });
    }
}

export default SalaRepository;
