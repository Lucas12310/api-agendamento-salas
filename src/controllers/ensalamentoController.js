import EnsalamentoServices from '../services/ensalamentoServices.js';

class EnsalamentoController {

  static inserir = async (req, res, next) => {
    try {
      const userLogado = req.user;
      //console.log('userLogado', userLogado);
      const { ensalamento, dataInicio, dataFim } = req.body;

      const response = await EnsalamentoServices.inserir(ensalamento, dataInicio, dataFim, userLogado);

      res.status(201).json({
        code: 201,
        error: false,
        message: 'Ensalamento criado com sucesso!',
        data: response
      });
    } catch (error) {
      next(error);
    }

  };
  static deletar = async (req, res, next) =>{
    try {
      const userLogado = req.user;
      const response = await EnsalamentoServices.deletar(userLogado, req.body);

      res.status(204).json({
        code: 204,
        error: false,
        message: 'Ensalamento deletado com sucesso!',
        data: response
      });
    } catch (error) {
      next(error);
    }
  };
}
export default EnsalamentoController;