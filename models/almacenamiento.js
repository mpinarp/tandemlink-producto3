import { usuarios, intercambios } from "./datos.js";
import { obtenerBaseDatos } from "../config/database.js";

/**
 * Obtiene las colecciones utilizadas por la aplicación.
 * @returns {object} Colecciones de MongoDB.
 */
function obtenerColecciones() {
    const db = obtenerBaseDatos();

    return {
        usuarios: db.collection("usuarios"),
        intercambios: db.collection("intercambios"),
        seleccionados: db.collection("seleccionados"),
        contadores: db.collection("contadores")
    };
}

/**
 * Inicializa las colecciones, índices y datos iniciales.
 */
export async function inicializarAlmacenamiento() {
    const colecciones = obtenerColecciones();

    await colecciones.usuarios.createIndex({ email: 1 }, { unique: true });
    await colecciones.seleccionados.createIndex({ id: 1 }, { unique: true });

    // Insertamos los usuarios iniciales si la colección está vacía.
    if (await colecciones.usuarios.countDocuments() === 0) {
        const usuariosIniciales = usuarios.map(({ id, nombre, email }) => ({
            id,
            nombre,
            email: email.toLowerCase()
        }));

        if (usuariosIniciales.length > 0) {
            await colecciones.usuarios.insertMany(usuariosIniciales);
        }
    }

    // Insertamos los intercambios iniciales si la colección está vacía.
    if (await colecciones.intercambios.countDocuments() === 0) {
        if (intercambios.length > 0) {
            await colecciones.intercambios.insertMany(intercambios);
        }
    }

    // Sincronizamos los contadores con los identificadores existentes.
    const totalUsuarios = await colecciones.usuarios.find().toArray();
    const totalIntercambios = await colecciones.intercambios.find().toArray();

    await colecciones.contadores.updateOne(
        { _id: "usuarios" },
        { $max: { secuencia: Math.max(0, ...totalUsuarios.map(usuario => usuario.id)) } },
        { upsert: true }
    );

    await colecciones.contadores.updateOne(
        { _id: "intercambios" },
        { $max: { secuencia: Math.max(0, ...totalIntercambios.map(intercambio => intercambio.id)) } },
        { upsert: true }
    );

    console.log("Colecciones e índices de MongoDB preparados correctamente.");
}

/**
 * Genera el siguiente identificador numérico.
 * @param {string} nombre Nombre del contador.
 * @returns {Promise<number>} Nuevo identificador.
 */
async function obtenerNuevoId(nombre) {
    const { contadores } = obtenerColecciones();

    const resultado = await contadores.findOneAndUpdate(
        { _id: nombre },
        { $inc: { secuencia: 1 } },
        { upsert: true, returnDocument: "after" }
    );

    return resultado.secuencia;
}

// ==============================
// GESTIÓN DE USUARIOS
// ==============================

/**
 * Obtiene todos los usuarios.
 * @returns {Promise<Array>} Lista de usuarios.
 */
export async function obtenerUsuarios() {
    const { usuarios } = obtenerColecciones();
    return usuarios.find().sort({ id: 1 }).toArray();
}

/**
 * Busca un usuario por su identificador.
 * @param {number} id Identificador del usuario.
 * @returns {Promise<object|null>} Usuario encontrado.
 */
export async function obtenerUsuarioPorId(id) {
    const { usuarios } = obtenerColecciones();
    return usuarios.findOne({ id });
}

/**
 * Busca un usuario por su correo electrónico.
 * @param {string} email Correo electrónico.
 * @returns {Promise<object|null>} Usuario encontrado.
 */
export async function obtenerUsuarioPorEmail(email) {
    const { usuarios } = obtenerColecciones();

    return usuarios.findOne({
        email: email.trim().toLowerCase()
    });
}

/**
 * Guarda un usuario nuevo.
 * @param {object} usuario Datos del usuario.
 * @returns {Promise<object>} Usuario creado.
 */
export async function guardarUsuario(usuario) {
    const { usuarios } = obtenerColecciones();
    const nuevoId = await obtenerNuevoId("usuarios");

    const nuevoUsuario = {
        id: nuevoId,
        ...usuario
    };

    await usuarios.insertOne(nuevoUsuario);

    return nuevoUsuario;
}

/**
 * Actualiza los datos de un usuario.
 * @param {number} id Identificador del usuario.
 * @param {object} datosActualizados Nuevos datos.
 * @returns {Promise<object|null>} Usuario actualizado.
 */
export async function actualizarUsuario(id, datosActualizados) {
    const { usuarios } = obtenerColecciones();

    return usuarios.findOneAndUpdate(
        { id },
        { $set: datosActualizados },
        { returnDocument: "after" }
    );
}

/**
 * Elimina un usuario.
 * @param {number} id Identificador del usuario.
 * @returns {Promise<boolean>} Resultado de la eliminación.
 */
export async function eliminarUsuario(id) {
    const { usuarios } = obtenerColecciones();
    const resultado = await usuarios.deleteOne({ id });

    return resultado.deletedCount > 0;
}

// ==============================
// GESTIÓN DE INTERCAMBIOS
// ==============================

/**
 * Obtiene todos los intercambios.
 * @returns {Promise<Array>} Lista de intercambios.
 */
export async function obtenerIntercambios() {
    const { intercambios } = obtenerColecciones();
    return intercambios.find().sort({ id: 1 }).toArray();
}

/**
 * Busca un intercambio por su identificador.
 * @param {number} id Identificador del intercambio.
 * @returns {Promise<object|null>} Intercambio encontrado.
 */
export async function obtenerIntercambioPorId(id) {
    const { intercambios } = obtenerColecciones();
    return intercambios.findOne({ id });
}

/**
 * Guarda un intercambio nuevo.
 * @param {object} intercambio Datos del intercambio.
 * @returns {Promise<object>} Intercambio creado.
 */
export async function guardarIntercambio(intercambio) {
    const { intercambios } = obtenerColecciones();
    const nuevoId = await obtenerNuevoId("intercambios");

    const nuevoIntercambio = {
        id: nuevoId,
        ...intercambio
    };

    await intercambios.insertOne(nuevoIntercambio);

    return nuevoIntercambio;
}

/**
 * Actualiza un intercambio.
 * @param {number} id Identificador del intercambio.
 * @param {object} datosActualizados Nuevos datos.
 * @returns {Promise<object|null>} Intercambio actualizado.
 */
export async function actualizarIntercambio(id, datosActualizados) {
    const { intercambios } = obtenerColecciones();

    return intercambios.findOneAndUpdate(
        { id },
        { $set: datosActualizados },
        { returnDocument: "after" }
    );
}

/**
 * Elimina un intercambio.
 * @param {number} id Identificador del intercambio.
 * @returns {Promise<boolean>} Resultado de la eliminación.
 */
export async function eliminarIntercambio(id) {
    const { intercambios } = obtenerColecciones();
    const resultado = await intercambios.deleteOne({ id });

    return resultado.deletedCount > 0;
}

// ==============================
// GESTIÓN DE INTERCAMBIOS SELECCIONADOS
// ==============================

/**
 * Obtiene los intercambios seleccionados.
 * @returns {Promise<Array>} Lista de seleccionados.
 */
export async function obtenerSeleccionados() {
    const { seleccionados } = obtenerColecciones();
    return seleccionados.find().sort({ id: 1 }).toArray();
}

/**
 * Guarda un intercambio como seleccionado sin duplicarlo.
 * @param {object} intercambio Intercambio seleccionado.
 * @returns {Promise<object>} Intercambio guardado.
 */
export async function guardarSeleccionado(intercambio) {
    const { seleccionados } = obtenerColecciones();

    return seleccionados.findOneAndUpdate(
        { id: intercambio.id },
        { $setOnInsert: intercambio },
        { upsert: true, returnDocument: "after" }
    );
}

/**
 * Elimina un intercambio de los seleccionados.
 * @param {number} id Identificador del intercambio.
 * @returns {Promise<boolean>} Resultado de la eliminación.
 */
export async function eliminarSeleccionado(id) {
    const { seleccionados } = obtenerColecciones();
    const resultado = await seleccionados.deleteOne({ id });

    return resultado.deletedCount > 0;
}