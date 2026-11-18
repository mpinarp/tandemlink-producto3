import { verificarToken } from "./config/autenticacion.js";

import { parse, getOperationAST } from "graphql";

// Importamos Express
import express from "express";

// Importamos GraphQL HTTP
import { createHandler } from "graphql-http/lib/use/express";

// Importamos nuestro esquema GraphQL
import { esquema } from "./graphql/esquema.js";

// Creamos la aplicación
const app = express();

// Definimos el puerto del servidor
const PORT = 3000;

// Ruta principal para comprobar que el servidor funciona
app.get("/", (req, res) => {
    res.send("API de TandemLink funcionando correctamente");
});

// Permitimos leer el cuerpo de las peticiones JSON
app.use(express.json());

// Protegemos el acceso a GraphQL mediante JWT
app.use("/graphql", (req, res, next) => {
    // Permitimos consultar GraphQL solo con un token válido
    const autorizacion = req.headers.authorization;

    // Permitimos el inicio de sesión sin autenticación previa
    try {
        const documento = parse(req.body.query);
        const operacion = getOperationAST(documento);

        if (
            operacion?.operation === "mutation" &&
            operacion.selectionSet.selections.length === 1 &&
            operacion.selectionSet.selections[0].name?.value === "loginAdministrador"
        ) {
            return next();
        }
    } catch {
        return res.status(400).json({
            error: "La consulta GraphQL no es válida."
        });
    }

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Acceso no autorizado. Debes iniciar sesión."
        });
    }

    const token = autorizacion.split(" ")[1];
    const usuario = verificarToken(token);

    if (!usuario || usuario.rol !== "admin") {
        return res.status(403).json({
            error: "Token inválido o permisos insuficientes."
        });
    }

    next();
});

// Configuramos el punto de entrada de GraphQL
app.all(
    "/graphql",
    createHandler({
        schema: esquema
    })
);

// Gestionamos los errores generales del servidor
app.use((error, req, res, next) => {
    console.error("Error en el servidor:", error);

    res.status(500).json({
        error: "Se ha producido un error interno en el servidor."
    });
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    console.log(`GraphQL disponible en http://localhost:${PORT}/graphql`);
});