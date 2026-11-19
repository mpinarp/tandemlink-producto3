
import {
    usuarios,
    intercambios,
    seleccionados,
    generarUsuarioId
} from '../data/memoria.js';

// ======================================================
// CONSULTAR Y BUSCAR USUARIOS
// ======================================================

// Devuelve todos los usuarios registrados.
export function consultarUsuarios() {
    return usuarios;
}

// Busca un usuario por su identificador numérico.
export function buscarUsuario(id) {
    return usuarios.find(usuario => usuario.id === Number(id));
}


// Buscar usuario por email.
export function buscarUsuarioPorEmail(email) {
    // Comprobamos que se haya proporcionado un correo.
    if (!email?.trim()) {
        throw new Error('El correo electrónico es obligatorio');
    }

    // Buscamos el usuario sin distinguir mayúsculas y minúsculas.
    const emailNormalizado = email.trim().toLowerCase();

    return usuarios.find(
        usuario => usuario.email.toLowerCase() === emailNormalizado
    );
}

// ======================================================
// CREAR USUARIOS
// ======================================================

export function crearUsuario(datos) {
    const { nombre, email, password } = datos;

    // Comprobamos los campos obligatorios.
    if (!nombre?.trim() || !email?.trim() || !password) {
        throw new Error('Nombre, email y contraseña son obligatorios');
    }

    // Comprobamos que el correo no esté registrado.
    const emailNormalizado = email.trim().toLowerCase();

    const emailExiste = usuarios.some(
        usuario => usuario.email.toLowerCase() === emailNormalizado
    );

    if (emailExiste) {
        throw new Error('Ya existe un usuario con ese correo electrónico');
    }

    // Creamos el nuevo usuario.
    const nuevoUsuario = {
        id: generarUsuarioId(),
        nombre: nombre.trim(),
        email: emailNormalizado,
        password
    };

    usuarios.push(nuevoUsuario);

    return nuevoUsuario;
}

// ======================================================
// EDITAR USUARIOS
// ======================================================

export function editarUsuario(id, datos) {
    const usuario = buscarUsuario(id);

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    // Validamos el correo si se quiere modificar.
    if (datos.email !== undefined) {
        if (!datos.email.trim()) {
            throw new Error('El correo no puede estar vacío');
        }

        const emailNormalizado = datos.email.trim().toLowerCase();

        const emailExiste = usuarios.some(
            otro => otro.id !== usuario.id &&
                otro.email.toLowerCase() === emailNormalizado
        );

        if (emailExiste) {
            throw new Error('Ya existe otro usuario con ese correo electrónico');
        }

        usuario.email = emailNormalizado;
    }

    // Actualizamos el nombre si se ha proporcionado.
    if (datos.nombre !== undefined) {
        if (!datos.nombre.trim()) {
            throw new Error('El nombre no puede estar vacío');
        }

        usuario.nombre = datos.nombre.trim();
    }

    // Actualizamos la contraseña si se ha proporcionado.
    if (datos.password !== undefined) {
        if (!datos.password) {
            throw new Error('La contraseña no puede estar vacía');
        }

        usuario.password = datos.password;
    }

    return usuario;
}

// ======================================================
// ELIMINAR USUARIOS
// ======================================================

export function eliminarUsuario(id) {
    // Buscamos el usuario que queremos eliminar.
    const indice = usuarios.findIndex(
        usuario => usuario.id === Number(id)
    );

    if (indice === -1) {
        throw new Error('Usuario no encontrado');
    }

    // Guardamos el ID del usuario antes de eliminarlo.
    const usuarioId = usuarios[indice].id;

    // Buscamos los intercambios publicados por ese usuario.
    const intercambiosUsuario = intercambios
        .filter(intercambio => intercambio.usuarioId === usuarioId);

    // Eliminamos de favoritos los intercambios de ese usuario.
    intercambiosUsuario.forEach(intercambio => {
        const indiceSeleccionado = seleccionados.findIndex(
            item => item.id === intercambio.id
        );

        if (indiceSeleccionado !== -1) {
            seleccionados.splice(indiceSeleccionado, 1);
        }
    });

    // Eliminamos los intercambios publicados por ese usuario.
    for (let i = intercambios.length - 1; i >= 0; i--) {
        if (intercambios[i].usuarioId === usuarioId) {
            intercambios.splice(i, 1);
        }
    }

    // Eliminamos y devolvemos el usuario.
    return usuarios.splice(indice, 1)[0];
}

