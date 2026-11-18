// # Punto de entrada principal del servidor

/** *@fileoverview Archivo principal del servidor backend TandemLink.
 * Este archivo configura y arranca un servidor ExpressJS, conectándose a una base de datos MongoDB y exponiendo rutas para gestionar intercambios de idiomas.
 * Replica las validaciones y estructura de datos definidas en el Producto 2.
 */

import express from "express";
import intercambiosRoutes from "./routes/intercambiosRoutes.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();

const PORT = process.env.PORT || 3000; // Puerto en el que se ejecutará el servidor, por defecto 3000 si no se especifica en las variables de entorno

// imprescindible para que Express entienda los cuerpos JSON que envía el cliente (Postman) en req.body, y que aquí lo desestructuras para leer cada campo por separado.
app.use(express.json());

app.use("/api", intercambiosRoutes); // Se monta el router de intercambios en la ruta base /api
// Endpoint único de GraphQL sobre ExpressJS
app.all("/graphql", createHandler({
    schema: schema,
    rootValue: resolvers
}));

app.get("/", (req, res) => { res.json({ message: "Bienvenido al servidor Backend de TandemLink" }); }); // Ruta raíz que devuelve un mensaje de bienvenida en formato JSON

app.use((err, req, res, next) => { res.status(500).json({ error: "Error interno del servidor", detalle: err.message }); }); // Middleware de manejo de errores que captura cualquier error no manejado y devuelve un código HTTP 500 Internal Server Error con un mensaje de error

// Inicia el servidor y escucha en el puerto especificado, mostrando un mensaje en la consola indicando que el servidor está activo y en qué URL se puede acceder.
app.listen(PORT, () => { console.log(`Servidor backend de TandemLink escuchando en http://localhost:${PORT}`); });


