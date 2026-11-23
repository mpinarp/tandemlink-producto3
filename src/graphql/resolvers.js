
// Importamos las funciones del controlador de usuarios.
import {
    consultarUsuarios,
    buscarUsuario,
    buscarUsuarioPorEmail,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
} from '../controllers/usuariosController.js';

// Importamos las funciones del controlador de intercambios.
import {
    consultarIntercambios,
    buscarIntercambio,
    crearIntercambio,
    editarIntercambio,
    eliminarIntercambio
} from '../controllers/intercambiosController.js';

// Importamos las funciones del controlador de intercambios seleccionados.
import {
    consultarSeleccionados,
    guardarSeleccionado,
    eliminarSeleccionado
} from '../controllers/seleccionadosController.js';

// Eliminamos la contraseña antes de devolver un usuario.
function usuarioPublico(usuario) {
    if (!usuario) return null;

    const { password, ...datosPublicos } = usuario;

    return datosPublicos;
}

// Conectamos las consultas y mutaciones con sus controladores.
export const resolvers = {

    // ======================================================
    // CONSULTAS DE USUARIOS
    // ======================================================

    usuarios: async () => {
        const usuarios = await consultarUsuarios();
        return usuarios.map(usuarioPublico);
    },

    usuario: async ({ id }) => {
        const usuario = await buscarUsuario(id);
        return usuarioPublico(usuario);
    },

    usuarioPorEmail: async ({ email }) => {
        const usuario = await buscarUsuarioPorEmail(email);
        return usuarioPublico(usuario);
    },

    // ======================================================
    // CONSULTAS DE INTERCAMBIOS
    // ======================================================

    intercambios: () => consultarIntercambios(),

    intercambio: ({ id }) => buscarIntercambio(id),

    // ======================================================
    // MUTACIONES DE USUARIOS
    // ======================================================

    crearUsuario: async ({ datos }) => {
        const usuario = await crearUsuario(datos);
        return usuarioPublico(usuario);
    },

    editarUsuario: async ({ id, datos }) => {
        const usuario = await editarUsuario(id, datos);
        return usuarioPublico(usuario);
    },

    eliminarUsuario: async ({ id }) => {
        const usuario = await eliminarUsuario(id);
        return usuarioPublico(usuario);
    },

    // ======================================================
    // MUTACIONES DE INTERCAMBIOS
    // ======================================================

    crearIntercambio: ({ datos }) => crearIntercambio(datos),

    editarIntercambio: ({ id, datos }) => editarIntercambio(id, datos),

    eliminarIntercambio: ({ id }) => eliminarIntercambio(id),

    // ======================================================
    // CONSULTAS Y MUTACIONES DE FAVORITOS
    // ======================================================

    seleccionados: () => consultarSeleccionados(),

    guardarSeleccionado: ({ id }) => guardarSeleccionado(id),

    eliminarSeleccionado: ({ id }) => eliminarSeleccionado(id)
};
