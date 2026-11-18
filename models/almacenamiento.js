// Importamos los datos iniciales
import { usuarios, intercambios } from "./datos.js";

// Creamos copias de los datos para trabajar en memoria
let usuariosGuardados = [...usuarios];
let intercambiosGuardados = [...intercambios];
let seleccionadosGuardados = [];

// ==============================
// GESTIÓN DE USUARIOS
// ==============================

// Obtenemos todos los usuarios
export function obtenerUsuarios() {
    return usuariosGuardados;
}

// Buscamos un usuario por su ID
export function obtenerUsuarioPorId(id) {
    return usuariosGuardados.find(usuario => usuario.id === id);
}

// Buscamos un usuario por su correo
export function obtenerUsuarioPorEmail(email) {
    return usuariosGuardados.find(
        usuario => usuario.email.toLowerCase() === email.toLowerCase()
    );
}

// Guardamos un usuario nuevo
export function guardarUsuario(usuario) {
    const nuevoId = usuariosGuardados.length > 0
        ? Math.max(...usuariosGuardados.map(usuario => usuario.id)) + 1
        : 1;

    const nuevoUsuario = {
        id: nuevoId,
        ...usuario
    };

    usuariosGuardados.push(nuevoUsuario);

    return nuevoUsuario;
}

// Actualizamos los datos de un usuario
export function actualizarUsuario(id, datosActualizados) {
    const indice = usuariosGuardados.findIndex(
        usuario => usuario.id === id
    );

    if (indice === -1) return null;

    usuariosGuardados[indice] = {
        ...usuariosGuardados[indice],
        ...datosActualizados,
        id
    };

    return usuariosGuardados[indice];
}

// Eliminamos un usuario por su ID
export function eliminarUsuario(id) {
    const existe = usuariosGuardados.some(usuario => usuario.id === id);

    if (!existe) {
        return false;
    }

    usuariosGuardados = usuariosGuardados.filter(usuario => usuario.id !== id);

    return true;
}

// ==============================
// GESTIÓN DE INTERCAMBIOS
// ==============================

// Obtenemos todos los intercambios
export function obtenerIntercambios() {
    return intercambiosGuardados;
}

// Buscamos un intercambio por su ID
export function obtenerIntercambioPorId(id) {
    return intercambiosGuardados.find(intercambio => intercambio.id === id);
}

// Guardamos un intercambio nuevo
export function guardarIntercambio(intercambio) {
    const nuevoId = intercambiosGuardados.length > 0
        ? Math.max(...intercambiosGuardados.map(intercambio => intercambio.id)) + 1
        : 1;

    const nuevoIntercambio = {
        id: nuevoId,
        ...intercambio
    };

    intercambiosGuardados.push(nuevoIntercambio);

    return nuevoIntercambio;
}

// Actualizamos un intercambio existente
export function actualizarIntercambio(id, datosActualizados) {
    const indice = intercambiosGuardados.findIndex(
        intercambio => intercambio.id === id
    );

    if (indice === -1) {
        return null;
    }

    intercambiosGuardados[indice] = {
        ...intercambiosGuardados[indice],
        ...datosActualizados,
        id
    };

    return intercambiosGuardados[indice];
}

// Eliminamos un intercambio por su ID
export function eliminarIntercambio(id) {
    const existe = intercambiosGuardados.some(
        intercambio => intercambio.id === id
    );

    if (!existe) {
        return false;
    }

    intercambiosGuardados = intercambiosGuardados.filter(
        intercambio => intercambio.id !== id
    );

    return true;
}
// ==============================
// GESTIÓN DE INTERCAMBIOS SELECCIONADOS
// ==============================

// Obtenemos los intercambios seleccionados
export function obtenerSeleccionados() {
    return seleccionadosGuardados;
}

// Guardamos un intercambio seleccionado
export function guardarSeleccionado(intercambio) {
    const existe = seleccionadosGuardados.some(
        seleccionado => seleccionado.id === intercambio.id
    );

    if (existe) {
        return seleccionadosGuardados.find(
            seleccionado => seleccionado.id === intercambio.id
        );
    }

    seleccionadosGuardados.push(intercambio);

    return intercambio;
}

// Eliminamos un intercambio seleccionado
export function eliminarSeleccionado(id) {
    const existe = seleccionadosGuardados.some(
        seleccionado => seleccionado.id === id
    );

    if (!existe) {
        return false;
    }

    seleccionadosGuardados = seleccionadosGuardados.filter(
        seleccionado => seleccionado.id !== id
    );

    return true;
}