import { prisma } from "../configs/prismaClient.js";

class UsuarioRepository {
  static async findAll(filtros, page = 1, limit = 10) {
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

    const data = await prisma.usuario.findMany({
      skip,
      take,
      where,
      orderBy: { id: 'desc' },
    });

    const totalCount = await prisma.usuario.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  static async findById(id) {
    return await prisma.usuario.findUnique({ where: { id: id } });
  }

  static async findByEmail(email) {
    return await prisma.usuario.findUnique({ where: { email: email } });
  }

  static async create(data) {
    return await prisma.usuario.create({ data: data });
  }

  static async update(id, data) {
    return await prisma.usuario.update({ where: { id: id }, data: data });
  }

  static async delete(id) {
    return await prisma.usuario.delete({ where: { id: id } });
  }
}

export default UsuarioRepository;
