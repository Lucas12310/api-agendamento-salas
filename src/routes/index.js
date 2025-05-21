import express from 'express';
import cookieParser from 'cookie-parser';
import reserva from './reservaRouter.js';
import usuario from './usuarioRoutes.js';
import sala from './salaRoutes.js';
import ensalamento from './ensalamentoRoutes.js';
import login from './loginRoutes.js';
//imports swagger
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import getSwaggerOptions from '../docs/config/head.js';
import errorHandler from '../middlewares/errorHandler.js';
import cors from 'cors';



const routes = (app) => {
    // Configurando a documentação da Swagger UI para ser servida diretamente em '/'
    const swaggerDocs = swaggerJsDoc(getSwaggerOptions());
    app.use(swaggerUI.serve);
    app.get('/', (req, res, next) => {
        swaggerUI.setup(swaggerDocs)(req, res, next);
    });

    app.use(
        reserva,
        usuario,
        sala,
        ensalamento,
        login,
    );

    // Este middleware deve ficar no final, não removê-lo daqui!
    app.use(errorHandler);
};

export default routes;