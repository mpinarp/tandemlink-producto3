
import { obtenerDB } from '../config/db.js';
import bcrypt from 'bcrypt';

// Número de rondas utilizado para generar los hashes.
const SALT_ROUNDS = 12;

// ======================================================
// VALIDAR IDENTIFICADORES
// ======================================================

/**
 * Valida y convierte un identificador a número.
 *
 * Comprueba que el identificador pueda convertirse en un número
 * entero positivo. Si no cumple estas condiciones, lanza un error.
 *
 * @param {number|string} id - Identificador del usuario que se valida.
 * @returns {number} Identificador convertido a número entero.
 * @throws {Error} Si el identificador no es un entero positivo válido.
 */
function validarId(id) {
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        throw new Error('El identificador del usuario no es válido');
    }

    return idNumerico;
}

// ======================================================
// CONSULTAR Y BUSCAR USUARIOS
// ======================================================

/**
 * Consulta todos los usuarios almacenados en MongoDB.
 *
 * Obtiene los documentos de la colección usuarios y los devuelve
 * en forma de array.
 *
 * @async
 * @returns {Promise<Object[]>} Promesa que devuelve un array de usuarios.
 */
export async function consultarUsuarios() {
    const db = obtenerDB();

    return await db.collection('usuarios')
        .find({})
        .toArray();
}

/**
 * Busca un usuario por su identificador numérico.
 *
 * Valida el ID recibido y consulta la colección usuarios de MongoDB.
 *
 * @async
 * @param {number|string} id - Identificador del usuario que se busca.
 * @returns {Promise<Object|null>} Promesa que devuelve el usuario encontrado o null si no existe.
 * @throws {Error} Si el identificador no es válido.
 */
export async function buscarUsuario(id) {
    const db = obtenerDB();
    const idNumerico = validarId(id);

    return await db.collection('usuarios').findOne({
        id: idNumerico
    });
}

/**
 * Busca un usuario mediante su correo electrónico.
 *
 * Comprueba que el correo sea válido, lo normaliza convirtiéndolo
 * a minúsculas y eliminando espacios exteriores, y consulta MongoDB.
 *
 * @async
 * @param {string} email - Correo electrónico del usuario que se busca.
 * @returns {Promise<Object|null>} Promesa que devuelve el usuario encontrado o null si no existe.
 * @throws {Error} Si el correo no se proporciona o no es válido.
 */
export async function buscarUsuarioPorEmail(email) {
    // Comprobamos que el correo sea una cadena válida.
    if (typeof email !== 'string' || !email.trim()) {
        throw new Error('El correo electrónico es obligatorio');
    }

    const db = obtenerDB();

    // Normalizamos el correo.
    const emailNormalizado = email.trim().toLowerCase();

    return await db.collection('usuarios').findOne({
        email: emailNormalizado
    });
}

// ======================================================
// CREAR USUARIOS
// ======================================================

/**
 * Crea un nuevo usuario en MongoDB.
 *
 * Valida los datos recibidos, comprueba que el correo no esté
 * registrado, genera un identificador numérico y cifra la contraseña
 * mediante bcrypt antes de insertar el documento.
 *
 * @async
 * @param {Object} datos - Datos del nuevo usuario.
 * @param {string} datos.nombre - Nombre del usuario.
 * @param {string} datos.email - Correo electrónico del usuario.
 * @param {string} datos.password - Contraseña sin cifrar que se procesará mediante bcrypt.
 * @returns {Promise<Object>} Promesa que devuelve el usuario creado.
 * @throws {Error} Si los datos son inválidos, el correo ya existe o falla una operación.
 */
export async function crearUsuario(datos) {
    const db = obtenerDB();
    const coleccion = db.collection('usuarios');

    // Comprobamos que se hayan recibido los datos.
    if (!datos || typeof datos !== 'object') {
        throw new Error('Los datos del usuario no son válidos');
    }

    const { nombre, email, password } = datos;

    // Comprobamos los campos obligatorios.
    if (
        typeof nombre !== 'string' || !nombre.trim() ||
        typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || !password.trim()
    ) {
        throw new Error('Nombre, email y contraseña son obligatorios');
    }

    // Normalizamos el correo electrónico.
    const emailNormalizado = email.trim().toLowerCase();

    // Comprobamos que el correo no esté registrado.
    const emailExiste = await coleccion.findOne({
        email: emailNormalizado
    });

    if (emailExiste) {
        throw new Error('Ya existe un usuario con ese correo electrónico');
    }

    // Calculamos el siguiente identificador numérico.
    const ultimoUsuario = await coleccion.findOne(
        {},
        { sort: { id: -1 } }
    );

    const nuevoId = ultimoUsuario ? ultimoUsuario.id + 1 : 1;

    // Generamos el hash de la contraseña antes de guardarla.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Creamos el nuevo usuario.
    const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre.trim(),
        email: emailNormalizado,
        password: passwordHash
    };

    // Insertamos el usuario en MongoDB.
    await coleccion.insertOne(nuevoUsuario);

    return nuevoUsuario;
}

// ======================================================
// EDITAR USUARIOS
// ======================================================

/**
 * Actualiza los datos de un usuario existente.
 *
 * Comprueba que el usuario exista, valida los campos que se desean
 * modificar, verifica la unicidad del correo y cifra la contraseña
 * si se solicita su actualización. Guarda los cambios en MongoDB.
 *
 * @async
 * @param {number|string} id - Identificador del usuario que se modifica.
 * @param {Object} datos - Campos que se desean actualizar.
 * @param {string} [datos.nombre] - Nuevo nombre del usuario.
 * @param {string} [datos.email] - Nuevo correo electrónico del usuario.
 * @param {string} [datos.password] - Nueva contraseña del usuario.
 * @returns {Promise<Object>} Promesa que devuelve el usuario actualizado.
 * @throws {Error} Si el ID es inválido, el usuario no existe, los campos no son válidos, el correo está duplicado o no se indican cambios.
 */
export async function editarUsuario(id, datos) {
    const db = obtenerDB();
    const coleccion = db.collection('usuarios');

    // Validamos el identificador.
    const idNumerico = validarId(id);

    // Comprobamos que se hayan recibido los datos.
    if (!datos || typeof datos !== 'object') {
        throw new Error('Los datos de actualización no son válidos');
    }

    // Buscamos el usuario que queremos modificar.
    const usuario = await buscarUsuario(idNumerico);

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    // Preparamos los campos que se van a actualizar.
    const cambios = {};

    // Validamos el correo si se quiere modificar.
    if (datos.email !== undefined) {
        if (typeof datos.email !== 'string' || !datos.email.trim()) {
            throw new Error('El correo no puede estar vacío');
        }

        const emailNormalizado = datos.email.trim().toLowerCase();

        // Comprobamos que otro usuario no tenga ese correo.
        const emailExiste = await coleccion.findOne({
            email: emailNormalizado,
            id: { $ne: idNumerico }
        });

        if (emailExiste) {
            throw new Error('Ya existe otro usuario con ese correo electrónico');
        }

        cambios.email = emailNormalizado;
    }

    // Validamos y actualizamos el nombre.
    if (datos.nombre !== undefined) {
        if (typeof datos.nombre !== 'string' || !datos.nombre.trim()) {
            throw new Error('El nombre no puede estar vacío');
        }

        cambios.nombre = datos.nombre.trim();
    }

    // Validamos y actualizamos la contraseña.
    if (datos.password !== undefined) {
        if (typeof datos.password !== 'string' || !datos.password.trim()) {
            throw new Error('La contraseña no puede estar vacía');
        }

        // Generamos un nuevo hash para la contraseña modificada.
        cambios.password = await bcrypt.hash(
            datos.password,
            SALT_ROUNDS
        );
    }

    // Evitamos ejecutar una actualización sin ningún cambio.
    if (Object.keys(cambios).length === 0) {
        throw new Error('No se han indicado campos para actualizar');
    }

    // Guardamos los cambios en MongoDB.
    await coleccion.updateOne(
        { id: idNumerico },
        { $set: cambios }
    );

    // Devolvemos el usuario actualizado.
    return await buscarUsuario(idNumerico);
}

// ======================================================
// ELIMINAR USUARIOS
// ======================================================

/**
 * Elimina un usuario y sus datos relacionados.
 *
 * Localiza al usuario, elimina los favoritos relacionados con sus
 * intercambios, elimina dichos intercambios y finalmente elimina
 * el documento del usuario en MongoDB.
 *
 * @async
 * @param {number|string} id - Identificador del usuario que se elimina.
 * @returns {Promise<Object>} Promesa que devuelve el usuario eliminado.
 * @throws {Error} Si el identificador no es válido o el usuario no existe.
 */
export async function eliminarUsuario(id) {
    const db = obtenerDB();

    const idNumerico = validarId(id);

    const usuarios = db.collection('usuarios');
    const intercambios = db.collection('intercambios');
    const seleccionados = db.collection('seleccionados');

    // Buscamos el usuario que queremos eliminar.
    const usuario = await usuarios.findOne({
        id: idNumerico
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    // Buscamos los intercambios publicados por ese usuario.
    const intercambiosUsuario = await intercambios.find({
        usuarioId: usuario.id
    }).toArray();

    // Obtenemos los identificadores de sus intercambios.
    const idsIntercambios = intercambiosUsuario.map(
        intercambio => intercambio.id
    );

    // Eliminamos de favoritos los intercambios relacionados.
    if (idsIntercambios.length > 0) {
        await seleccionados.deleteMany({
            id: { $in: idsIntercambios }
        });
    }

    // Eliminamos los intercambios publicados por el usuario.
    await intercambios.deleteMany({
        usuarioId: usuario.id
    });

    // Eliminamos y devolvemos el usuario.
    await usuarios.deleteOne({
        id: usuario.id
    });

    return usuario;
}
