
// Importamos los datos y la función para generar identificadores.
import {
    intercambios,
    generarIntercambioId
} from '../data/memoria.js';

// Devuelve todos los intercambios publicados.
export function consultarIntercambios() {
    return intercambios;
}

// Busca un intercambio por su identificador.
export function buscarIntercambio(id) {
    return intercambios.find(
        intercambio => intercambio.id === String(id)
    );
}

// Crea un intercambio nuevo.
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
        !usuarioId ||
        !idiomaOfrecido ||
        !idiomaBuscado ||
        !modalidad ||
        !descripcion
    ) {
        throw new Error('Todos los campos del intercambio son obligatorios');
    }

    // Validamos el tipo de intercambio.
    if (!['oferta', 'peticion'].includes(tipo.toLowerCase())) {
        throw new Error('El tipo debe ser oferta o petición');
    }

    // Validamos la modalidad.
    if (!['presencial', 'online', 'ambas'].includes(modalidad.toLowerCase())) {
        throw new Error('La modalidad debe ser presencial, online o ambas');
    }

    // Creamos el nuevo intercambio.
    const nuevoIntercambio = {
        id: generarIntercambioId(),
        tipo: tipo.toLowerCase(),
        usuarioId: String(usuarioId),
        idiomaOfrecido: idiomaOfrecido.trim(),
        idiomaBuscado: idiomaBuscado.trim(),
        modalidad: modalidad.toLowerCase(),
        descripcion: descripcion.trim(),
        fechaCreacion: new Date().toISOString()
    };

    intercambios.push(nuevoIntercambio);

    return nuevoIntercambio;
}

// Modifica los datos de un intercambio existente.
export function editarIntercambio(id, datos) {
    const intercambio = buscarIntercambio(id);

    if (!intercambio) {
        throw new Error('Intercambio no encontrado');
    }

    // Actualizamos el tipo si se ha proporcionado.
    if (datos.tipo !== undefined) {
        const tipo = datos.tipo.toLowerCase();

        if (!['oferta', 'petición'].includes(tipo)) {
            throw new Error('El tipo debe ser oferta o petición');
        }

        intercambio.tipo = tipo;
    }

    // Actualizamos el identificador del usuario.
    if (datos.usuarioId !== undefined) {
        intercambio.usuarioId = String(datos.usuarioId);
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
        const modalidad = datos.modalidad.toLowerCase();

        if (!['presencial', 'online', 'ambas'].includes(modalidad)) {
            throw new Error('La modalidad debe ser presencial, online o ambas');
        }

        intercambio.modalidad = modalidad;
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

// Elimina un intercambio por su identificador.
export function eliminarIntercambio(id) {
    const indice = intercambios.findIndex(
        intercambio => intercambio.id === String(id)
    );

    if (indice === -1) {
        throw new Error('Intercambio no encontrado');
    }

    return intercambios.splice(indice, 1)[0];
}

