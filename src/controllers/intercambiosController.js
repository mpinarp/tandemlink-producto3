
import { obtenerDB } from '../config/db.js';

// ======================================================
// CONSULTAR Y BUSCAR INTERCAMBIOS
// ======================================================

/**
 * Obtiene todos los intercambios almacenados en MongoDB.
 *
 * @async
 * @returns {Promise<Object[]>} Lista de intercambios.
 */
export async function consultarIntercambios() {
    const db = obtenerDB();

    return await db.collection('intercambios')
        .find({})
        .toArray();
}

/**
 * Busca un intercambio mediante su identificador numérico.
 *
 * @async
 * @param {number|string} id - Identificador del intercambio.
 * @returns {Promise<Object|null>} Intercambio encontrado o null si no existe.
 */
export async function buscarIntercambio(id) {
    const db = obtenerDB();

    return await db.collection('intercambios').findOne({
        id: Number(id)
    });
}

// ======================================================
// VALIDACIONES
// ======================================================

/**
 * Valida y normaliza el tipo de intercambio.
 *
 * Admite los valores oferta y petición. Para petición,
 * acepta la palabra con o sin tilde.
 *
 * @param {string} tipo - Tipo de intercambio recibido.
 * @returns {string} Tipo de intercambio normalizado.
 * @throws {Error} Si el tipo no es oferta o petición.
 */
function validarTipo(tipo) {
    const valor = tipo?.trim().toLowerCase();

    if (valor === 'oferta') return 'oferta';

    // Admitimos la palabra con y sin tilde.
    if (valor === 'petición' || valor === 'peticion') {
        return 'petición';
    }

    throw new Error('El tipo debe ser oferta o petición');
}

/**
 * Valida y normaliza la modalidad de un intercambio.
 *
 * @param {string} modalidad - Modalidad recibida.
 * @returns {string} Modalidad normalizada.
 * @throws {Error} Si la modalidad no es presencial, online o ambas.
 */
function validarModalidad(modalidad) {
    const valor = modalidad?.trim().toLowerCase();

    if (valor === 'presencial') return 'Presencial';
    if (valor === 'online') return 'Online';
    if (valor === 'ambas') return 'Ambas';

    throw new Error('La modalidad debe ser presencial, online o ambas');
}

/**
 * Comprueba que exista el usuario asociado al intercambio.
 *
 * Consulta la colección de usuarios de MongoDB mediante
 * el identificador numérico proporcionado.
 *
 * @async
 * @param {number|string} usuarioId - Identificador del usuario.
 * @returns {Promise<void>} Promesa que finaliza si el usuario existe.
 * @throws {Error} Si el usuario asociado no existe.
 */
async function validarUsuario(usuarioId) {
    const db = obtenerDB();

    const usuarioExiste = await db.collection('usuarios').findOne({
        id: Number(usuarioId)
    });

    if (!usuarioExiste) {
        throw new Error('El usuario asociado no existe');
    }
}

// ======================================================
// CREAR INTERCAMBIOS
// ======================================================

/**
 * Crea un intercambio nuevo en MongoDB.
 *
 * Valida los campos, el tipo, la modalidad y el usuario asociado.
 * Genera un identificador numérico y registra la fecha de creación.
 *
 * @async
 * @param {Object} datos - Datos del intercambio que se va a crear.
 * @param {string} datos.tipo - Tipo de intercambio: oferta o petición.
 * @param {number|string} datos.usuarioId - Identificador del usuario.
 * @param {string} datos.idiomaOfrecido - Idioma que se ofrece.
 * @param {string} datos.idiomaBuscado - Idioma que se busca.
 * @param {string} datos.modalidad - Modalidad del intercambio.
 * @param {string} datos.descripcion - Descripción del intercambio.
 * @returns {Promise<Object>} Intercambio creado.
 * @throws {Error} Si faltan campos, las validaciones fallan
 * o el usuario asociado no existe.
 */
export async function crearIntercambio(datos) {
    const db = obtenerDB();
    const coleccion = db.collection('intercambios');

    const {
        tipo,
        usuarioId,
        idiomaOfrecido,
        idiomaBuscado,
        modalidad,
        descripcion
    } = datos;

    // Comprobamos los campos obligatorios.
    if (
        !tipo ||
        usuarioId === undefined ||
        usuarioId === null ||
        !idiomaOfrecido?.trim() ||
        !idiomaBuscado?.trim() ||
        !modalidad ||
        !descripcion?.trim()
    ) {
        throw new Error('Todos los campos del intercambio son obligatorios');
    }

    // Validamos el tipo, la modalidad y el usuario.
    const tipoValidado = validarTipo(tipo);
    const modalidadValidada = validarModalidad(modalidad);
    await validarUsuario(usuarioId);

    // Calculamos el siguiente identificador numérico.
    const ultimoIntercambio = await coleccion.findOne(
        {},
        { sort: { id: -1 } }
    );

    const nuevoId = ultimoIntercambio
        ? ultimoIntercambio.id + 1
        : 1;

    // Creamos el nuevo intercambio.
    const nuevoIntercambio = {
        id: nuevoId,
        tipo: tipoValidado,
        usuarioId: Number(usuarioId),
        idiomaOfrecido: idiomaOfrecido.trim(),
        idiomaBuscado: idiomaBuscado.trim(),
        modalidad: modalidadValidada,
        descripcion: descripcion.trim(),
        fechaCreacion: new Date().toISOString().split('T')[0]
    };

    // Insertamos el intercambio en MongoDB.
    await coleccion.insertOne(nuevoIntercambio);

    return nuevoIntercambio;
}

// ======================================================
// EDITAR INTERCAMBIOS
// ======================================================

/**
 * Actualiza los campos de un intercambio existente.
 *
 * Permite modificar el tipo, el usuario asociado, los idiomas,
 * la modalidad y la descripción.
 *
 * @async
 * @param {number|string} id - Identificador del intercambio.
 * @param {Object} datos - Campos que se quieren actualizar.
 * @param {string} [datos.tipo] - Nuevo tipo de intercambio.
 * @param {number|string} [datos.usuarioId] - Nuevo usuario asociado.
 * @param {string} [datos.idiomaOfrecido] - Nuevo idioma ofrecido.
 * @param {string} [datos.idiomaBuscado] - Nuevo idioma buscado.
 * @param {string} [datos.modalidad] - Nueva modalidad.
 * @param {string} [datos.descripcion] - Nueva descripción.
 * @returns {Promise<Object>} Intercambio actualizado.
 * @throws {Error} Si el intercambio no existe o alguno de los
 * campos proporcionados no es válido.
 */
export async function editarIntercambio(id, datos) {
    const db = obtenerDB();
    const coleccion = db.collection('intercambios');

    // Buscamos el intercambio que queremos modificar.
    const intercambio = await buscarIntercambio(id);

    if (!intercambio) {
        throw new Error('Intercambio no encontrado');
    }

    // Preparamos los campos que se van a actualizar.
    const cambios = {};

    // Actualizamos el tipo si se ha proporcionado.
    if (datos.tipo !== undefined) {
        cambios.tipo = validarTipo(datos.tipo);
    }

    // Actualizamos el usuario asociado.
    if (datos.usuarioId !== undefined) {
        await validarUsuario(datos.usuarioId);
        cambios.usuarioId = Number(datos.usuarioId);
    }

    // Actualizamos los idiomas.
    if (datos.idiomaOfrecido !== undefined) {
        if (!datos.idiomaOfrecido.trim()) {
            throw new Error('El idioma ofrecido no puede estar vacío');
        }

        cambios.idiomaOfrecido = datos.idiomaOfrecido.trim();
    }

    if (datos.idiomaBuscado !== undefined) {
        if (!datos.idiomaBuscado.trim()) {
            throw new Error('El idioma buscado no puede estar vacío');
        }

        cambios.idiomaBuscado = datos.idiomaBuscado.trim();
    }

    // Actualizamos la modalidad.
    if (datos.modalidad !== undefined) {
        cambios.modalidad = validarModalidad(datos.modalidad);
    }

    // Actualizamos la descripción.
    if (datos.descripcion !== undefined) {
        if (!datos.descripcion.trim()) {
            throw new Error('La descripción no puede estar vacía');
        }

        cambios.descripcion = datos.descripcion.trim();
    }

    // Guardamos los cambios en MongoDB.
    await coleccion.updateOne(
        { id: Number(id) },
        { $set: cambios }
    );

    // Devolvemos el intercambio actualizado.
    return await buscarIntercambio(id);
}

// ======================================================
// ELIMINAR INTERCAMBIOS
// ======================================================

/**
 * Elimina un intercambio y su registro de favoritos, si existe.
 *
 * Primero comprueba que el intercambio exista, elimina su registro
 * de seleccionados y finalmente elimina el intercambio.
 *
 * @async
 * @param {number|string} id - Identificador del intercambio.
 * @returns {Promise<Object>} Intercambio eliminado.
 * @throws {Error} Si el intercambio no existe.
 */
export async function eliminarIntercambio(id) {
    const db = obtenerDB();

    const intercambios = db.collection('intercambios');
    const seleccionados = db.collection('seleccionados');

    // Buscamos el intercambio que queremos eliminar.
    const intercambio = await intercambios.findOne({
        id: Number(id)
    });

    if (!intercambio) {
        throw new Error('Intercambio no encontrado');
    }

    // Eliminamos también el intercambio de favoritos, si existe.
    await seleccionados.deleteOne({
        id: Number(id)
    });

    // Eliminamos el intercambio de MongoDB.
    await intercambios.deleteOne({
        id: Number(id)
    });

    return intercambio;
}
