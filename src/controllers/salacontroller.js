import salaServices from '../services/salaServices.js';

class salaController {
    static listar = async (req, res) => {
        try {
            const { id, bloco, andar, nome } = req.query;
            const filtro = {
                id: id, bloco: bloco, andar: andar, nome: nome,
            };
            const response = await salaServices.listar(filtro, req.query.page, req.query.limit);

            res.status(200).json({
                message: 'Listado com sucesso!',
                error: false,
                code: 200,
                ...response
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        };
    };

    static inserir = async (req, res, next) => {
        try {
            const { bloco, andar, nome } = req.body;
            const data = {
                bloco: bloco, andar: andar, nome: nome,
            };

            const response = await salaServices.inserir(data);

            res.status(201).json({
                message: 'Sala criada com sucesso!',
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
            const { bloco, andar, nome } = req.body;
            const data = {
                bloco: bloco, andar: andar, nome: nome,
            };
            const response = await salaServices.atualizar(id, data);

            res.status(202).json({
                message: 'Sala atualizada com sucesso!',
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
            const response = await salaServices.excluir(id);

            res.status(204).json({
                message: 'Sala deletada com sucesso!',
                error: false,
                code: 204,
                data: response
            });
        } catch (error) {
            next(error);
        }
    };
}

export default salaController;