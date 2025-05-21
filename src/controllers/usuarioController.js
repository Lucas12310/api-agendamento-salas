import UsuarioService from "../services/usuarioService.js";


class UsuarioController {
    static listar = async (req, res, next) => {
        try {
            const response = await UsuarioService.listar(req.query, req.query.page, req.query.limit);
            res.status(200).json({
                message: 'Listado com sucesso!',
                error: false,
                code: 200,
                ...response,
            });
        } catch (error) {
            next(error);
        };
    };

    static inserir = async (req, res, next) => {
        try {
            

            const response = await UsuarioService.inserir(req.body);

            delete response.senha;

            res.status(201).json({
                message: 'Usuario criado com sucesso!',
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

            const response = await UsuarioService.atualizar(id, req.body);

            delete response.senha;

            res.status(202).json({
                message: 'Usuario atualizado com sucesso!',
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
            const response = await UsuarioService.excluir(id);

            res.status(204).json({
                message: 'Usuário deletado com sucesso!',
                error: false,
                code: 204,
                data: response
            });
        } catch (error) {
            next(error);
        }
    };
};

export default UsuarioController;