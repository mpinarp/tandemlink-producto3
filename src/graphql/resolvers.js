
// Importamos las funciones del controlador de usuarios.
import {
    consultarUsuarios,
    buscarUsuario,
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

// Eliminamos la contraseña antes de devolver un usuario.
function usuarioPublico(usuario) {
    if (!usuario) return null;

    const { password, ...datosPublicos } = usuario;

    return datosPublicos;
}

// Conectamos las consultas y mutaciones con sus controladores.
export const resolvers = {
    // Consultas de usuarios.
    usuarios: () => consultarUsuarios().map(usuarioPublico),

    usuario: ({ id }) => usuarioPublico(buscarUsuario(id)),

    // Consultas de intercambios.
    intercambios: () => consultarIntercambios(),

    intercambio: ({ id }) => buscarIntercambio(id),

    // Mutaciones de usuarios.
    crearUsuario: ({ datos }) => {
        return usuarioPublico(crearUsuario(datos));
    },

    editarUsuario: ({ id, datos }) => {
        return usuarioPublico(editarUsuario(id, datos));
    },

    eliminarUsuario: ({ id }) => {
        return usuarioPublico(eliminarUsuario(id));
    },

    // Mutaciones de intercambios.
    crearIntercambio: ({ datos }) => crearIntercambio(datos),

    editarIntercambio: ({ id, datos }) => editarIntercambio(id, datos),

    eliminarIntercambio: ({ id }) => eliminarIntercambio(id)
};
