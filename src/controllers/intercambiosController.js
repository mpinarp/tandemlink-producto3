
import { obtenerDB } from '../config/db.js';

// ======================================================
// CONSULTAR Y BUSCAR INTERCAMBIOS
// ======================================================

// Devuelve todos los intercambios de MongoDB.
export async function consultarIntercambios() {
    const db = obtenerDB();

    return await db.collection('intercambios')
        .find({})
        .toArray();
}

// Busca un intercambio por su identificador numérico.
export async function buscarIntercambio(id) {
    const db = obtenerDB();

    return await db.collection('intercambios').findOne({
        id: Number(id)
    });
}

// ======================================================
// VALIDACIONES
// ======================================================

// Comprueba y normaliza el tipo de intercambio.
function validarTipo(tipo) {
    const valor = tipo?.trim().toLowerCase();

    if (valor === 'oferta') return 'oferta';

    // Admitimos la palabra con y sin tilde.
    if (valor === 'petición' || valor === 'peticion') {
        return 'petición';
    }

    throw new Error('El tipo debe ser oferta o petición');
}

// Comprueba y normaliza la modalidad.
function validarModalidad(modalidad) {
    const valor = modalidad?.trim().toLowerCase();

    if (valor === 'presencial') return 'Presencial';
    if (valor === 'online') return 'Online';
    if (valor === 'ambas') return 'Ambas';

    throw new Error('La modalidad debe ser presencial, online o ambas');
}

// Comprueba de forma asíncrona que el usuario asociado exista.
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
