import app from './src/app.js';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 7002;

app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`);
    // console.log(process.env); // Visualizar as variáveis de ambiente em uso
  });
  
  
