/**
 * Genera un error indicando que un recurso no existe.
 * @param {string} recurso - Nombre del recurso.
 * @returns {Error} Error descriptivo.
 */
export function errorNoEncontrado(recurso) {
    return new Error(`${recurso} no encontrado`);
}

/**
 * Genera un error de validación.
 * @param {string} mensaje - Descripción del error.
 * @returns {Error} Error de validación.
 */
export function errorValidacion(mensaje) {
    return new Error(mensaje);
}