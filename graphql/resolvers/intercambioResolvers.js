
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

import { errorNoEncontrado, errorValidacion } from "../errores.js";

/**
 * Resolvers para gestionar los intercambios.
 */
export const intercambioResolvers = {
    Query: {
        intercambios: async () => await obtenerIntercambios(),

        intercambio: async (_, { id }) =>
            await obtenerIntercambioPorId(id),

        seleccionados: async () => await obtenerSeleccionados()
    },

    Mutation: {
        crearIntercambio: async (_, { datos }) => {
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

            const usuario = await obtenerUsuarioPorId(datos.usuarioId);

            if (!usuario) {
                throw errorNoEncontrado("Usuario");
            }

            return await guardarIntercambio({
                ...datos,
                fechaCreacion: datos.fechaCreacion.trim()
            });
        },

        actualizarIntercambio: async (_, { id, datos }) => {
            const intercambio = await obtenerIntercambioPorId(id);

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

            const usuario = await obtenerUsuarioPorId(datos.usuarioId);

            if (!usuario) {
                throw errorNoEncontrado("Usuario");
            }

            return await actualizarIntercambio(id, {
                ...datos,
                fechaCreacion: datos.fechaCreacion.trim()
            });
        },

        eliminarIntercambio: async (_, { id }) => {
            const intercambio = await obtenerIntercambioPorId(id);

            if (!intercambio) {
                throw errorNoEncontrado("Intercambio");
            }

            return await eliminarIntercambio(id);
        },

        guardarSeleccionado: async (_, { id }) => {
            const intercambio = await obtenerIntercambioPorId(id);

            if (!intercambio) {
                throw errorNoEncontrado("Intercambio");
            }

            return await guardarSeleccionado(intercambio);
        },

        eliminarSeleccionado: async (_, { id }) =>
            await eliminarSeleccionado(id)
    }
};