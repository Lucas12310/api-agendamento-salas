import express from 'express';
import routes from './routes/index.js';
import cors from 'cors'; // permite o fornt-end usar essa api (resumindo)

const app = express();


app.use(cors({
    origin: 'http://localhost:3000', // Permitir todas as origens
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Permitir que o cookie seja enviado
}));


app.use(
    express.json(),
    express.text(),
);
routes(app);

export default app;