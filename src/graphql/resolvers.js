
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
    // Consultas de usuarios.
    usuarios: () => consultarUsuarios().map(usuarioPublico),

    usuario: ({ id }) => usuarioPublico(buscarUsuario(id)),

    usuarioPorEmail: ({ email }) => usuarioPublico(buscarUsuarioPorEmail(email)),

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

    eliminarIntercambio: ({ id }) => eliminarIntercambio(id),

    // Consultar todos los intercambios favoritos.
    seleccionados: () => consultarSeleccionados(),

    // Guardar un intercambio como favorito.
    guardarSeleccionado: ({ id }) => guardarSeleccionado(id),

    // Eliminar un intercambio de favoritos.
    eliminarSeleccionado: ({ id }) => eliminarSeleccionado(id),
};
