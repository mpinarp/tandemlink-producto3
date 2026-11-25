
import { obtenerDB } from '../config/db.js';

// ======================================================
// CONSULTAR TODOS LOS INTERCAMBIOS SELECCIONADOS
// ======================================================

/**
 * Consulta todos los intercambios guardados como favoritos.
 *
 * Recupera todos los documentos de la colección seleccionados
 * de MongoDB y los devuelve en forma de array.
 *
 * @async
 * @returns {Promise<Array<Object>>} Lista de intercambios seleccionados.
 */
export async function consultarSeleccionados() {
    const db = obtenerDB();

    return await db.collection('seleccionados')
        .find({})
        .toArray();
}

// ======================================================
// GUARDAR UN INTERCAMBIO COMO FAVORITO
// ======================================================

/**
 * Guarda un intercambio en la colección de favoritos.
 *
 * Busca el intercambio original en la colección intercambios.
 * Si existe, copia sus datos a la colección seleccionados.
 * Si ya estaba guardado, actualiza sus datos mediante replaceOne.
 * La opción upsert permite insertar el documento si no existe.
 *
 * @async
 * @param {number|string} id - Identificador del intercambio.
 * @returns {Promise<Object>} Intercambio guardado o actualizado.
 * @throws {Error} Si el intercambio original no existe.
 */
export async function guardarSeleccionado(id) {
    const db = obtenerDB();

    const intercambios = db.collection('intercambios');
    const seleccionados = db.collection('seleccionados');

    // Buscamos el intercambio original.
    const intercambio = await intercambios.findOne({
        id: Number(id)
    });

    if (!intercambio) {
        throw new Error('El intercambio no existe.');
    }

    // Preparamos una copia sin el identificador interno de MongoDB.
    const { _id, ...datosIntercambio } = intercambio;

    const seleccionado = { ...datosIntercambio };

    // Guardamos o actualizamos el favorito.
    // Si ya existe, sustituimos sus datos.
    await seleccionados.replaceOne(
        { id: intercambio.id },
        seleccionado,
        { upsert: true }
    );

    return seleccionado;
}

// ======================================================
// ELIMINAR UN INTERCAMBIO DE FAVORITOS
// ======================================================

/**
 * Elimina un intercambio de la colección de favoritos.
 *
 * Busca el favorito por su identificador, lo elimina de MongoDB
 * y devuelve el documento que se ha eliminado.
 *
 * @async
 * @param {number|string} id - Identificador del intercambio.
 * @returns {Promise<Object>} Intercambio eliminado de favoritos.
 * @throws {Error} Si el intercambio no está guardado como favorito.
 */
export async function eliminarSeleccionado(id) {
    const db = obtenerDB();
    const coleccion = db.collection('seleccionados');

    // Buscamos el favorito que queremos eliminar.
    const seleccionado = await coleccion.findOne({
        id: Number(id)
    });

    if (!seleccionado) {
        throw new Error('El intercambio no está en favoritos.');
    }

    // Eliminamos el favorito de MongoDB.
    await coleccion.deleteOne({
        id: Number(id)
    });

    // Devolvemos el intercambio eliminado de favoritos.
    return seleccionado;
}
