
import { obtenerDB } from '../config/db.js';

// ======================================================
// CONSULTAR TODOS LOS INTERCAMBIOS SELECCIONADOS
// ======================================================

export async function consultarSeleccionados() {
    const db = obtenerDB();

    return await db.collection('seleccionados')
        .find({})
        .toArray();
}

// ======================================================
// GUARDAR UN INTERCAMBIO COMO FAVORITO
// ======================================================


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
