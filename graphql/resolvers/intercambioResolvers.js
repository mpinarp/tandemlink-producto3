// Importamos las funciones de almacenamiento
import {
    obtenerIntercambios,
    obtenerIntercambioPorId,
    guardarIntercambio,
    actualizarIntercambio,
    eliminarIntercambio,
    obtenerUsuarioPorId,
    obtenerSeleccionados,
    guardarSeleccionado,
    eliminarSeleccionado
} from "../../models/almacenamiento.js";

// Importamos los errores personalizados
import { errorNoEncontrado, errorValidacion } from "../errores.js";

/**
 * Resolvers para gestionar los intercambios.
 */
export const intercambioResolvers = {
    Query: {
        // Consultamos todos los intercambios
        intercambios: () => obtenerIntercambios(),

        // Buscamos un intercambio por su ID
        intercambio: (_, { id }) => obtenerIntercambioPorId(id),

        // Consultamos los intercambios seleccionados
        seleccionados: () => obtenerSeleccionados()
    },

    Mutation: {
        // Creamos un intercambio
        crearIntercambio: (_, { datos }) => {
            const camposObligatorios = [
                datos.tipo,
                datos.idiomaOfrecido,
                datos.idiomaBuscado,
                datos.modalidad,
                datos.descripcion,
                datos.fechaCreacion
            ];

            if (camposObligatorios.some(campo => !campo.trim())) {
                throw errorValidacion("Todos los campos del intercambio son obligatorios");
            }

            const usuario = obtenerUsuarioPorId(datos.usuarioId);

            if (!usuario) {
                throw errorNoEncontrado("Usuario");
            }

            return guardarIntercambio({
                ...datos,
                fechaCreacion: datos.fechaCreacion.trim()
            });
        },

        // Actualizamos un intercambio
        actualizarIntercambio: (_, { id, datos }) => {
            const intercambio = obtenerIntercambioPorId(id);

            if (!intercambio) {
                throw errorNoEncontrado("Intercambio");
            }

            const camposObligatorios = [
                datos.tipo,
                datos.idiomaOfrecido,
                datos.idiomaBuscado,
                datos.modalidad,
                datos.descripcion,
                datos.fechaCreacion
            ];

            if (camposObligatorios.some(campo => !campo.trim())) {
                throw errorValidacion("Todos los campos del intercambio son obligatorios");
            }

            const usuario = obtenerUsuarioPorId(datos.usuarioId);

            if (!usuario) {
                throw errorNoEncontrado("Usuario");
            }

            return actualizarIntercambio(id, {
                ...datos,
                fechaCreacion: datos.fechaCreacion.trim()
            });
        },

        // Eliminamos un intercambio
        eliminarIntercambio: (_, { id }) => {
            const intercambio = obtenerIntercambioPorId(id);

            if (!intercambio) {
                throw errorNoEncontrado("Intercambio");
            }

            return eliminarIntercambio(id);
        },

        // Guardamos un intercambio como seleccionado
        guardarSeleccionado: (_, { id }) => {
            const intercambio = obtenerIntercambioPorId(id);

            if (!intercambio) {
                throw errorNoEncontrado("Intercambio");
            }

            return guardarSeleccionado(intercambio);
        },

        // Eliminamos un intercambio seleccionado
        eliminarSeleccionado: (_, { id }) => eliminarSeleccionado(id)
    }
};