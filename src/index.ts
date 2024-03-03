import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import mainRoutes from './routes/mainRoute'

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.use('/', mainRoutes)


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

