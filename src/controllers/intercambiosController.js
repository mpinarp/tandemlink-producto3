
import {
    usuarios,
    intercambios,
    seleccionados,
    generarIntercambioId
} from '../data/memoria.js';

// ======================================================
// CONSULTAR Y BUSCAR INTERCAMBIOS
// ======================================================

// Devuelve todos los intercambios publicados.
export function consultarIntercambios() {
    return intercambios;
}

// Busca un intercambio por su identificador numérico.
export function buscarIntercambio(id) {
    return intercambios.find(
        intercambio => intercambio.id === Number(id)
    );
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

// Comprueba que el usuario asociado exista.
function validarUsuario(usuarioId) {
    const usuarioExiste = usuarios.some(
        usuario => usuario.id === Number(usuarioId)
    );

    if (!usuarioExiste) {
        throw new Error('El usuario asociado no existe');
    }
}

// ======================================================
// CREAR INTERCAMBIOS
// ======================================================

export function crearIntercambio(datos) {
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
    validarUsuario(usuarioId);

    // Creamos el nuevo intercambio.
    const nuevoIntercambio = {
        id: generarIntercambioId(),
        tipo: tipoValidado,
        usuarioId: Number(usuarioId),
        idiomaOfrecido: idiomaOfrecido.trim(),
        idiomaBuscado: idiomaBuscado.trim(),
        modalidad: modalidadValidada,
        descripcion: descripcion.trim(),
        fechaCreacion: new Date().toISOString().split('T')[0]
    };

    intercambios.push(nuevoIntercambio);

    return nuevoIntercambio;
}

// ======================================================
// EDITAR INTERCAMBIOS
// ======================================================

export function editarIntercambio(id, datos) {
    const intercambio = buscarIntercambio(id);

    if (!intercambio) {
        throw new Error('Intercambio no encontrado');
    }

    // Actualizamos el tipo si se ha proporcionado.
    if (datos.tipo !== undefined) {
        intercambio.tipo = validarTipo(datos.tipo);
    }

    // Actualizamos el usuario asociado.
    if (datos.usuarioId !== undefined) {
        validarUsuario(datos.usuarioId);
        intercambio.usuarioId = Number(datos.usuarioId);
    }

    // Actualizamos los idiomas.
    if (datos.idiomaOfrecido !== undefined) {
        if (!datos.idiomaOfrecido.trim()) {
            throw new Error('El idioma ofrecido no puede estar vacío');
        }

        intercambio.idiomaOfrecido = datos.idiomaOfrecido.trim();
    }

    if (datos.idiomaBuscado !== undefined) {
        if (!datos.idiomaBuscado.trim()) {
            throw new Error('El idioma buscado no puede estar vacío');
        }

        intercambio.idiomaBuscado = datos.idiomaBuscado.trim();
    }

    // Actualizamos la modalidad.
    if (datos.modalidad !== undefined) {
        intercambio.modalidad = validarModalidad(datos.modalidad);
    }

    // Actualizamos la descripción.
    if (datos.descripcion !== undefined) {
        if (!datos.descripcion.trim()) {
            throw new Error('La descripción no puede estar vacía');
        }

        intercambio.descripcion = datos.descripcion.trim();
    }

    return intercambio;
}

// ======================================================
// ELIMINAR INTERCAMBIOS
// ======================================================

export function eliminarIntercambio(id) {
    // Buscamos el intercambio que queremos eliminar.
    const indice = intercambios.findIndex(
        intercambio => intercambio.id === Number(id)
    );

    if (indice === -1) {
        throw new Error('Intercambio no encontrado');
    }

    // Eliminamos también el intercambio de favoritos, si existe.
    const indiceSeleccionado = seleccionados.findIndex(
        item => item.id === Number(id)
    );

    if (indiceSeleccionado !== -1) {
        seleccionados.splice(indiceSeleccionado, 1);
    }

    // Eliminamos y devolvemos el intercambio.
    return intercambios.splice(indice, 1)[0];
}
