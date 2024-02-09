import express from 'express';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000; // Puedes elegir el puerto que prefieras


import mainRoutes from './routes/mainRoute'
// import authRoutes from './routes/authRoutes'


app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

// app.use('/', authRoutes)


app.use('/', mainRoutes)


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

