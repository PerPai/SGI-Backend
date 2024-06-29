import express from 'express';
import cors from 'cors'; 

import routerSGI from './routes/rutas.js';

const app = express();

// Configurar el middleware CORS
app.use(cors());

// Middleware que permite responder y recibir objetos JSON
app.use(express.json());
app.use('/api', routerSGI);

// Manejar 404 - Endpoint no encontrado
app.use((req, res, next) => {
    res.status(404).json({
        message: "Endpoint Not Found"
    });
});


app.listen(3000);