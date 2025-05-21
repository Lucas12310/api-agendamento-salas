import ReservaServices from '../services/reservaServices.js';

class ReservaController {

    static listar = async (req, res, next) => {
        try {
            const { id, id_sala, id_usuario, turma, hora_inicio, hora_fim, descricao, id_reservante, sala, dia } = req.query;
            const filtro = { id, id_sala, id_usuario, turma, hora_inicio, hora_fim, descricao, id_reservante, sala, dia };

            const response = await ReservaServices.listar(filtro, req.query.page, req.query.limit);

            res.status(200).json({
                message: 'Listado com sucesso!',
                error: false,
                code: 200,
                ...response
            });
        } catch (error) {
            next(error);
        }
    };

    static inserir = async (req, res, next) => {
        try {
            console.log(req.body);
            const { id_sala, id_usuario, turma, hora_inicio, hora_fim, descricao, id_reservante } = req.body;
            const data = { id_sala, id_usuario, turma, hora_inicio, hora_fim, descricao, id_reservante };

            const response = await ReservaServices.inserir(data);

            res.status(201).json({
                message: 'Reserva criada com sucesso!',
                error: false,
                code: 201,
                data: response
            });
        } catch (error) {
            next(error);
        }
    };

    static atualizar = async (req, res, next) => {
        try {
            const id = req.params;

            const { id_sala, id_usuario, turma, hora_inicio, hora_fim, descricao, id_reservante, sala } = req.body;
            const data = { id_sala, id_usuario, turma, hora_inicio, hora_fim, descricao, id_reservante, sala };

            const response = await ReservaServices.atualizar(id, data, req.user);

            res.status(202).json({
                message: 'Reserva atualizada com sucesso!',
                error: false,
                code: 202,
                data: response
            });
        } catch (error) {
            next(error);
        }
    };

    static excluir = async (req, res, next) => {
        try {
            const id = req.params;
            const response = await ReservaServices.excluir(id, req.user);

            res.status(204).json({
                message: 'Reserva deletada com sucesso!',
                error: false,
                code: 204,
                data: response
            });
        } catch (error) {
            next(error);
        }

    };
}

export default ReservaController;