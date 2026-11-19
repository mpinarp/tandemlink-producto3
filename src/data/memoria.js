
import {
    usuariosIniciales,
    intercambiosIniciales
} from './datosIniciales.js';

// ======================================================
// ALMACENAMIENTO TEMPORAL EN MEMORIA
// ======================================================

// Cargamos los datos iniciales del Producto 2.
// Usamos copias para no modificar los datos originales.
export const usuarios = usuariosIniciales.map(usuario => ({ ...usuario }));
export const intercambios = intercambiosIniciales.map(intercambio => ({ ...intercambio }));

// Array donde almacenaremos los intercambios seleccionados.
export const seleccionados = [];

// ======================================================
// CONTADORES DE IDENTIFICADORES
// ======================================================

// Calculamos el siguiente ID a partir de los datos iniciales.
// Así evitamos repetir los identificadores 1, 2 y 3.
let siguienteUsuarioId =
    Math.max(0, ...usuarios.map(usuario => Number(usuario.id))) + 1;

let siguienteIntercambioId =
    Math.max(0, ...intercambios.map(intercambio => Number(intercambio.id))) + 1;

// Genera un identificador numérico para cada nuevo usuario.
export function generarUsuarioId() {
    return siguienteUsuarioId++;
}

// Genera un identificador numérico para cada nuevo intercambio.
export function generarIntercambioId() {
    return siguienteIntercambioId++;
}
