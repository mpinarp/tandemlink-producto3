// Importamos las funciones de almacenamiento
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    guardarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerIntercambios
} from "../../models/almacenamiento.js";

// Importamos los errores personalizados
import { errorNoEncontrado, errorValidacion } from "../errores.js";

/**
 * Resolvers para gestionar los usuarios.
 */
export const usuarioResolvers = {
    Query: {
        // Consultamos todos los usuarios
        usuarios: () => obtenerUsuarios(),

        // Buscamos un usuario por su ID
        usuario: (_, { id }) => obtenerUsuarioPorId(id),

        // Buscamos un usuario por su correo
        usuarioPorEmail: (_, { email }) => obtenerUsuarioPorEmail(email)
    },

    Mutation: {
        // Creamos un usuario
        crearUsuario: (_, { datos }) => {
            if (!datos.nombre.trim() || !datos.email.trim()) {
                throw errorValidacion("El nombre y el correo electrónico son obligatorios");
            }

            const email = datos.email.trim().toLowerCase();
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!emailValido) {
                throw errorValidacion("El correo electrónico no tiene un formato válido");
            }

            if (obtenerUsuarioPorEmail(email)) {
                throw new Error("Ya existe un usuario con ese correo electrónico");
            }

            return guardarUsuario({
                nombre: datos.nombre.trim(),
                email
            });
        },

        // Actualizamos un usuario
        actualizarUsuario: (_, { id, datos }) => {
            const usuario = obtenerUsuarioPorId(id);

            if (!usuario) {
                throw errorNoEncontrado("Usuario");
            }

            if (!datos.nombre.trim() || !datos.email.trim()) {
                throw errorValidacion("El nombre y el correo electrónico son obligatorios");
            }

            const email = datos.email.trim().toLowerCase();
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!emailValido) {
                throw errorValidacion("El correo electrónico no tiene un formato válido");
            }

            const usuarioExistente = obtenerUsuarioPorEmail(email);

            if (usuarioExistente && usuarioExistente.id !== id) {
                throw new Error("Ese correo electrónico ya pertenece a otro usuario");
            }

            return actualizarUsuario(id, {
                nombre: datos.nombre.trim(),
                email
            });
        },

        // Eliminamos un usuario si no tiene intercambios asociados
        eliminarUsuario: (_, { id }) => {
            const usuario = obtenerUsuarioPorId(id);

            if (!usuario) {
                throw errorNoEncontrado("Usuario");
            }

            const tieneIntercambios = obtenerIntercambios().some(
                intercambio => intercambio.usuarioId === id
            );

            if (tieneIntercambios) {
                throw new Error("No se puede eliminar el usuario porque tiene intercambios asociados");
            }

            return eliminarUsuario(id);
        }
    }
};