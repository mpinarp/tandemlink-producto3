
/**
 * @fileoverview Punto de entrada de la aplicación TandemLink.
 * Configura Express, conecta GraphQL y MongoDB e inicia el servidor.
 */

// Importamos Express y GraphQL.
import express from 'express';
import dotenv from 'dotenv';
import { createHandler } from 'graphql-http/lib/use/express';

// Importamos el esquema, los resolvers y la conexión con MongoDB.
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { conectarDB } from './config/db.js';

// Cargamos las variables de entorno definidas en el archivo .env.
dotenv.config();

// Creamos la aplicación Express.
const app = express();

// Definimos el puerto del servidor a partir de las variables de entorno.
// Si no se especifica, utilizamos el puerto 3000.
const PORT = process.env.PORT || 3000;

// Permitimos que Express reciba y procese datos en formato JSON.
app.use(express.json());

// Ruta principal de comprobación del servidor.
/**
 * Endpoint GET /.
 * Devuelve un mensaje para comprobar que el servidor funciona.
 *
 * @param {import('express').Request} req - Solicitud HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {void}
 */
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de TandemLink - Producto 3',
        estado: 'Servidor funcionando correctamente',
        graphql: '/graphql'
    });
});

// Conectamos GraphQL con Express.
/**
 * Endpoint /graphql.
 * Gestiona las consultas y mutaciones de GraphQL mediante
 * el esquema y los resolvers definidos en la aplicación.
 */
app.all(
    '/graphql',
    createHandler({
        schema,
        rootValue: resolvers
    })
);

/**
 * Inicia la aplicación conectando previamente con MongoDB.
 *
 * Primero establece la conexión con la base de datos y, si es
 * correcta, inicia el servidor Express en el puerto configurado.
 *
 * Si la conexión falla, muestra el error y finaliza el proceso.
 *
 * @async
 * @function iniciarServidor
 * @returns {Promise<void>}
 */
async function iniciarServidor() {
    try {
        // Primero conectamos con MongoDB.
        await conectarDB();

        // Después iniciamos Express.
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
            console.log(`GraphQL disponible en http://localhost:${PORT}/graphql`);
        });

    } catch (error) {
        // Si falla MongoDB, no iniciamos el servidor.
        console.error('No se pudo iniciar la aplicación:', error.message);
        process.exit(1);
    }
}

// Ejecutamos el inicio de la aplicación.
iniciarServidor();
