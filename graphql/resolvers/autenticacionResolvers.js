// Importamos el controlador de autenticación
import { iniciarSesionAdministrador } from "../../controllers/administradorController.js";

/**
 * Resolver para la autenticación del administrador.
 */
export const autenticacionResolvers = {
    Mutation: {
        // Iniciamos sesión como administrador
        loginAdministrador: async (_, { email, password }) => {
            return iniciarSesionAdministrador(email, password);
        }
    }
};