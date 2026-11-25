
/**
 * Importamos las funciones del controlador de usuarios.
 * Estas funciones permiten consultar, crear, editar y eliminar usuarios.
 */
import {
    consultarUsuarios,
    buscarUsuario,
    buscarUsuarioPorEmail,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
} from '../controllers/usuariosController.js';

/**
 * Importamos las funciones del controlador de intercambios.
 * Estas funciones permiten gestionar las publicaciones de intercambios.
 */
import {
    consultarIntercambios,
    buscarIntercambio,
    crearIntercambio,
    editarIntercambio,
    eliminarIntercambio
} from '../controllers/intercambiosController.js';

/**
 * Importamos las funciones del controlador de intercambios seleccionados.
 * Estas funciones permiten consultar, guardar y eliminar favoritos.
 */
import {
    consultarSeleccionados,
    guardarSeleccionado,
    eliminarSeleccionado
} from '../controllers/seleccionadosController.js';

// ======================================================
// TRANSFORMACIÓN DE DATOS DE USUARIO
// ======================================================

/**
 * Prepara un usuario para devolverlo a través de GraphQL.
 *
 * Elimina el campo password del objeto para evitar exponer
 * la contraseña almacenada, incluso si está cifrada.
 *
 * @param {Object|null} usuario - Usuario recuperado de MongoDB.
 * @returns {Object|null} Usuario sin contraseña o null si no existe.
 */
function usuarioPublico(usuario) {
    if (!usuario) return null;

    const { password, ...datosPublicos } = usuario;

    return datosPublicos;
}

// ======================================================
// RESOLVERS DE GRAPHQL
// ======================================================

/**
 * Conecta las consultas y mutaciones definidas en el esquema GraphQL
 * con las funciones correspondientes de los controladores.
 *
 * Los resolvers actúan como intermediarios entre las peticiones
 * de GraphQL y la lógica de gestión de datos.
 *
 * @type {Object}
 */
export const resolvers = {

    // ======================================================
    // CONSULTAS DE USUARIOS
    // ======================================================

    /**
     * Consulta todos los usuarios y elimina sus contraseñas
     * antes de devolver los resultados.
     *
     * @returns {Promise<Array<Object>>} Lista de usuarios públicos.
     */
    usuarios: async () => {
        const usuarios = await consultarUsuarios();
        return usuarios.map(usuarioPublico);
    },

    /**
     * Busca un usuario por su identificador.
     *
     * @param {Object} args - Argumentos de la consulta GraphQL.
     * @param {string} args.id - Identificador del usuario.
     * @returns {Promise<Object|null>} Usuario público o null.
     */
    usuario: async ({ id }) => {
        const usuario = await buscarUsuario(id);
        return usuarioPublico(usuario);
    },

    /**
     * Busca un usuario por su correo electrónico.
     *
     * @param {Object} args - Argumentos de la consulta GraphQL.
     * @param {string} args.email - Correo electrónico del usuario.
     * @returns {Promise<Object|null>} Usuario público o null.
     */
    usuarioPorEmail: async ({ email }) => {
        const usuario = await buscarUsuarioPorEmail(email);
        return usuarioPublico(usuario);
    },

    // ======================================================
    // CONSULTAS DE INTERCAMBIOS
    // ======================================================

    /**
     * Consulta todos los intercambios almacenados.
     *
     * @returns {Promise<Array<Object>>} Lista de intercambios.
     */
    intercambios: () => consultarIntercambios(),

    /**
     * Busca un intercambio por su identificador.
     *
     * @param {Object} args - Argumentos de la consulta GraphQL.
     * @param {string} args.id - Identificador del intercambio.
     * @returns {Promise<Object|null>} Intercambio encontrado o null.
     */
    intercambio: ({ id }) => buscarIntercambio(id),

    // ======================================================
    // MUTACIONES DE USUARIOS
    // ======================================================

    /**
     * Crea un usuario y devuelve sus datos públicos.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {Object} args.datos - Datos del nuevo usuario.
     * @returns {Promise<Object>} Usuario creado sin contraseña.
     */
    crearUsuario: async ({ datos }) => {
        const usuario = await crearUsuario(datos);
        return usuarioPublico(usuario);
    },

    /**
     * Modifica los datos de un usuario y devuelve su versión pública.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {string} args.id - Identificador del usuario.
     * @param {Object} args.datos - Campos que se van a actualizar.
     * @returns {Promise<Object>} Usuario actualizado sin contraseña.
     */
    editarUsuario: async ({ id, datos }) => {
        const usuario = await editarUsuario(id, datos);
        return usuarioPublico(usuario);
    },

    /**
     * Elimina un usuario y devuelve sus datos públicos.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {string} args.id - Identificador del usuario.
     * @returns {Promise<Object>} Usuario eliminado sin contraseña.
     */
    eliminarUsuario: async ({ id }) => {
        const usuario = await eliminarUsuario(id);
        return usuarioPublico(usuario);
    },

    // ======================================================
    // MUTACIONES DE INTERCAMBIOS
    // ======================================================

    /**
     * Crea un nuevo intercambio.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {Object} args.datos - Datos del nuevo intercambio.
     * @returns {Promise<Object>} Intercambio creado.
     */
    crearIntercambio: ({ datos }) => crearIntercambio(datos),

    /**
     * Modifica un intercambio existente.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {string} args.id - Identificador del intercambio.
     * @param {Object} args.datos - Campos que se van a actualizar.
     * @returns {Promise<Object>} Intercambio actualizado.
     */
    editarIntercambio: ({ id, datos }) => editarIntercambio(id, datos),

    /**
     * Elimina un intercambio existente.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {string} args.id - Identificador del intercambio.
     * @returns {Promise<Object>} Intercambio eliminado.
     */
    eliminarIntercambio: ({ id }) => eliminarIntercambio(id),

    // ======================================================
    // CONSULTAS Y MUTACIONES DE FAVORITOS
    // ======================================================

    /**
     * Consulta todos los intercambios guardados como favoritos.
     *
     * @returns {Promise<Array<Object>>} Lista de favoritos.
     */
    seleccionados: () => consultarSeleccionados(),

    /**
     * Guarda o actualiza un intercambio en favoritos.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {string} args.id - Identificador del intercambio.
     * @returns {Promise<Object>} Intercambio guardado.
     */
    guardarSeleccionado: ({ id }) => guardarSeleccionado(id),

    /**
     * Elimina un intercambio de la lista de favoritos.
     *
     * @param {Object} args - Argumentos de la mutación GraphQL.
     * @param {string} args.id - Identificador del intercambio.
     * @returns {Promise<Object>} Intercambio eliminado de favoritos.
     */
    eliminarSeleccionado: ({ id }) => eliminarSeleccionado(id)
};
