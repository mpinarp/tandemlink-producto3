
// Almacenamiento temporal de los datos de TandemLink.
// Más adelante sustituir estas estructuras por MongoDB.

// Usuarios registrados en la aplicación.
export const usuarios = [];

// Intercambios publicados en la aplicación.
export const intercambios = [];

// Contador para generar identificadores únicos.
let siguienteUsuarioId = 1;
let siguienteIntercambioId = 1;

// Genera el identificador del siguiente usuario.
export function generarUsuarioId() {
    return String(siguienteUsuarioId++);
}

// Genera el identificador del siguiente intercambio.
export function generarIntercambioId() {
    return String(siguienteIntercambioId++);
}
