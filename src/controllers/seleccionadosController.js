
import { seleccionados, intercambios } from '../data/memoria.js';

// ======================================================
// CONSULTAR TODOS LOS INTERCAMBIOS SELECCIONADOS
// ======================================================

export function consultarSeleccionados() {
    return seleccionados;
}

// ======================================================
// GUARDAR UN INTERCAMBIO COMO FAVORITO
// ======================================================

export function guardarSeleccionado(id) {
    // Buscamos el intercambio original por su ID numérico.
    const intercambio = intercambios.find(
        item => item.id === Number(id)
    );

    if (!intercambio) {
        throw new Error('El intercambio no existe.');
    }

    // Evitamos guardar el mismo favorito varias veces.
    const yaExiste = seleccionados.some(
        item => item.id === intercambio.id
    );

    if (yaExiste) {
        throw new Error('El intercambio ya está en favoritos.');
    }

    // Guardamos una copia completa del intercambio.
    const seleccionado = { ...intercambio };

    seleccionados.push(seleccionado);

    return seleccionado;
}

// ======================================================
// ELIMINAR UN INTERCAMBIO DE FAVORITOS
// ======================================================

export function eliminarSeleccionado(id) {
    const indice = seleccionados.findIndex(
        item => item.id === Number(id)
    );

    if (indice === -1) {
        throw new Error('El intercambio no está en favoritos.');
    }

    // Eliminamos y devolvemos el intercambio seleccionado.
    return seleccionados.splice(indice, 1)[0];
}
