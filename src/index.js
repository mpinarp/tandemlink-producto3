
// Importamos Express y GraphQL.
import express from 'express';
import dotenv from 'dotenv';
import { createHandler } from 'graphql-http/lib/use/express';

// Importamos el esquema y los resolvers.
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

// Cargamos las variables de entorno.
dotenv.config();

// Creamos la aplicación Express.
const app = express();

// Definimos el puerto del servidor.
const PORT = process.env.PORT || 3000;

// Permitimos recibir datos JSON.
app.use(express.json());

// Ruta principal de comprobación.
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de TandemLink - Producto 3',
        estado: 'Servidor funcionando correctamente',
        graphql: '/graphql'
    });
});

// Conectamos GraphQL con Express.
app.all(
    '/graphql',
    createHandler({
        schema,
        rootValue: resolvers
    })
);

// Iniciamos el servidor.
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    console.log(`GraphQL disponible en http://localhost:${PORT}/graphql`);
});
