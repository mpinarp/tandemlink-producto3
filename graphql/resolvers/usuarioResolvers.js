
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    guardarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerIntercambios
} from "../../models/almacenamiento.js";

import { errorNoEncontrado, errorValidacion } from "../errores.js";

/**
 * Resolvers para gestionar los usuarios.
 */
export const usuarioResolvers = {
    Query: {
        usuarios: async () => await obtenerUsuarios(),

        usuario: async (_, { id }) => await obtenerUsuarioPorId(id),

        usuarioPorEmail: async (_, { email }) =>
            await obtenerUsuarioPorEmail(email)
    },

    Mutation: {
        crearUsuario: async (_, { datos }) => {
            if (!datos.nombre.trim() || !datos.email.trim()) {
                throw errorValidacion("El nombre y el correo electrónico son obligatorios");
            }

            const email = datos.email.trim().toLowerCase();
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!emailValido) {
                throw errorValidacion("El correo electrónico no tiene un formato válido");
            }

            if (await obtenerUsuarioPorEmail(email)) {
                throw errorValidacion("Ya existe un usuario con ese correo electrónico");
            }

            return await guardarUsuario({
                nombre: datos.nombre.trim(),
                email
            });
        },

        actualizarUsuario: async (_, { id, datos }) => {
            const usuario = await obtenerUsuarioPorId(id);

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

            const usuarioExistente = await obtenerUsuarioPorEmail(email);

            if (usuarioExistente && usuarioExistente.id !== id) {
                throw errorValidacion("Ese correo electrónico ya pertenece a otro usuario");
            }

            return await actualizarUsuario(id, {
                nombre: datos.nombre.trim(),
                email
            });
        },

        eliminarUsuario: async (_, { id }) => {
            const usuario = await obtenerUsuarioPorId(id);

            if (!usuario) {
                throw errorNoEncontrado("Usuario");
            }

            const intercambios = await obtenerIntercambios();

            const tieneIntercambios = intercambios.some(
                intercambio => intercambio.usuarioId === id
            );

            if (tieneIntercambios) {
                throw errorValidacion(
                    "No se puede eliminar el usuario porque tiene intercambios asociados"
                );
            }

            return await eliminarUsuario(id);
        }
    }
};