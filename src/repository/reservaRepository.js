import { prisma } from '../configs/prismaClient.js';

class ReservaRepository {

  static async lista(filtros, page = 1, limit = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit;
    const take = limit;

    const data = await prisma.reserva.findMany({
      skip,
      take,
      where: filtros
    });

    const totalCount = await prisma.reserva.count();
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  static async findById(id) {
    return await prisma.reserva.findUnique({ where: { id: id } });
  }

  static async create(data) {
    return await prisma.reserva.create({ data: data });
  }
  static async createMany(data) {
    return await prisma.reserva.createMany({
      data, // data deve ser um array de objetos que correspondem à estrutura do modelo
    });
  }
  static async delete(id) {
    return await prisma.reserva.delete({ where: { id: id } });
  }

  static async deleteMany(ids) {
    return await prisma.reserva.deleteMany({ where: {id: {in: ids} }});
  }

  static async update(id, data) {
    return await prisma.reserva.update({ where: { id: id }, data: data });
  }

}

export default ReservaRepository;