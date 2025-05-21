//routes
import { reservaRoutes } from "../routes/reserva.js";
import { ensalamentoRouter } from "../routes/ensalamento.js";
import { salaRoutes } from "../routes/sala.js";
import { loginRouter } from "../routes/login.js";
import { usuarioRoutes } from "../routes/usuario.js";
//schemas
import reservaSchemas from "../schemas/reserva.js";
import ensalamentoSchema from "../schemas/ensalamento.js";
import salaSchema from "../schemas/sala.js"
import loginSchema from "../schemas/login.js"
import usuarioSchemas from "../schemas/usuario.js"

// Função para definir as URLs do servidor dependendo do ambiente
const getServersInCorrectOrder = () => {
  const devUrl = { url: process.env.SWAGGER_DEV_URL || 'http://localhost:7002' };
  const prodUrl = { url: process.env.SWAGGER_PROD_URL || 'http://localhost:7002' };

  if (process.env.NODE_ENV === 'production') return [prodUrl, devUrl];
  else return [devUrl, prodUrl];
};

// Função para obter as opções do Swagger
const getSwaggerOptions = () => {
  return {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'API Visualização de Reservas',
        version: '1.0-alpha',
        description: 'Api que gerencia a reserva de salas',
        contact: {
          name: 'Fslab',
          email: 'fslab@example.com',
        },
      },
      servers: getServersInCorrectOrder(),
      tags: [
        {
          name: 'Login',
          description: 'Rota para autenticação'
        },
        {
          name: 'Reserva',
          description: 'Rota para reserva'
        },
        {
          name: "Usuário",
          description: "Rotas para gestão de usuários"
        },
        {
          name: 'Sala',
          description: 'Rotas para gestão de salas'
        },
        {
          name: 'Ensalamento',
          description: 'Rota para gestão de ensalamento'
        },
      ],
      paths: {
        //login
        ...loginRouter,

        //reserva
        ...reservaRoutes,
        
        //usuario
        ...usuarioRoutes,
        
        //sala
        ...salaRoutes,
       
        //ensalamento
        ...ensalamentoRouter
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          ...loginSchema,
          ...usuarioSchemas,
          ...reservaSchemas,
          ...ensalamentoSchema,
          ...salaSchema
        }
      },
      security: [{
        bearerAuth: []
      }]
    },
    apis: ['./src/routes/*.js']
  };
};

export default getSwaggerOptions;
