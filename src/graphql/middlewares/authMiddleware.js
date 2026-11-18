import jwt from "jsonwebtoken";

/**
 * Middleware de autenticación JWT.
 * Intercepta la cabecera Authorization: Bearer <token>, verifica su firma
 * y adjunta los datos del usuario autenticado en req.usuario.
 * No bloquea la petición directamente para permitir operaciones públicas
 * (registro, login, consultas abiertas) en el endpoint único /graphql.
 */
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.usuario = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const secreto = process.env.JWT_SECRET || "clave_secreta_tandemlink_2026";
        const decodificado = jwt.verify(token, secreto);
        req.usuario = decodificado; // { id, email, iat, exp }
    } catch (error) {
        req.usuario = null;
    }

    next();
};