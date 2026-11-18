//# Lógica de resolución (Fase 2 memoria -> Fase 3 MongoDB)

import {
    obtenerUsuarios,
    obtenerUsuarioPorEmail,
    obtenerUsuarioConectado,
    crearUsuario,
    loginUsuario,
    eliminarUsuario,
    cerrarSesion
} from "../controllers/usuariosController.js";

import {
    obtenerIntercambiosMongo,
    obtenerIntercambioPorIdMongo,
    crearIntercambioMongo,
    eliminarIntercambioMongo
} from "../controllers/intercambiosController.js";

import {
    obtenerSeleccionados,
    guardarSeleccionado,
    eliminarSeleccionado
} from "../controllers/seleccionadosController.js";

export const resolvers = {
    // Queries
    obtenerUsuarios,
    obtenerUsuarioPorEmail,
    obtenerUsuarioConectado,
    obtenerIntercambios: obtenerIntercambiosMongo,
    obtenerIntercambioPorId: obtenerIntercambioPorIdMongo,
    obtenerSeleccionados,

    // Mutations
    crearUsuario,
    loginUsuario,
    eliminarUsuario,
    crearIntercambio: crearIntercambioMongo,
    eliminarIntercambio: eliminarIntercambioMongo,
    guardarSeleccionado,
    eliminarSeleccionado,
    cerrarSesion
};