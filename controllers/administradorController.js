// Importamos la función de autenticación
import { autenticarAdministrador } from "../config/autenticacion.js";

/**
 * Inicia sesión como administrador.
 * Comprueba las credenciales y devuelve un token JWT.
 *
 * @param {string} email - Correo electrónico del administrador.
 * @param {string} password - Contraseña del administrador.
 * @returns {Promise<{token: string}>} Token de autenticación.
 * @throws {Error} Si las credenciales no son correctas.
 */
export async function iniciarSesionAdministrador(email, password) {
    const token = await autenticarAdministrador(email, password);

    if (!token) {
        throw new Error("Credenciales de administrador incorrectas");
    }

    return { token };
}