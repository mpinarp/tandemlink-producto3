
// Importamos los datos y la función para generar identificadores.
import { usuarios, generarUsuarioId } from '../data/memoria.js';

// Devuelve todos los usuarios registrados.
export function consultarUsuarios() {
    return usuarios;
}

// Busca un usuario por su identificador.
export function buscarUsuario(id) {
    return usuarios.find(usuario => usuario.id === String(id));
}

// Crea un usuario nuevo.
export function crearUsuario(datos) {
    const { nombre, email, password } = datos;

    // Comprobamos que los campos obligatorios estén informados.
    if (!nombre || !email || !password) {
        throw new Error('Nombre, email y contraseña son obligatorios');
    }

    // Evitamos registrar dos usuarios con el mismo correo.
    const emailExiste = usuarios.some(
        usuario => usuario.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExiste) {
        throw new Error('Ya existe un usuario con ese correo electrónico');
    }

    // Creamos el nuevo usuario.
    const nuevoUsuario = {
        id: generarUsuarioId(),
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password
    };

    usuarios.push(nuevoUsuario);

    return nuevoUsuario;
}

// Modifica los datos de un usuario existente.
export function editarUsuario(id, datos) {
    const usuario = buscarUsuario(id);

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    // Si se cambia el correo, comprobamos que no esté utilizado.
    if (datos.email) {
        const emailExiste = usuarios.some(
            otro => otro.id !== usuario.id &&
                otro.email.toLowerCase() === datos.email.trim().toLowerCase()
        );

        if (emailExiste) {
            throw new Error('Ya existe otro usuario con ese correo electrónico');
        }
    }

    // Actualizamos únicamente los campos permitidos.
    if (datos.nombre !== undefined) {
        if (!datos.nombre.trim()) {
            throw new Error('El nombre no puede estar vacío');
        }
        usuario.nombre = datos.nombre.trim();
    }

    if (datos.email !== undefined) {
        if (!datos.email.trim()) {
            throw new Error('El correo no puede estar vacío');
        }
        usuario.email = datos.email.trim().toLowerCase();
    }

    if (datos.password !== undefined) {
        if (!datos.password) {
            throw new Error('La contraseña no puede estar vacía');
        }
        usuario.password = datos.password;
    }

    return usuario;
}

// Elimina un usuario por su identificador.
export function eliminarUsuario(id) {
    const indice = usuarios.findIndex(
        usuario => usuario.id === String(id)
    );

    if (indice === -1) {
        throw new Error('Usuario no encontrado');
    }

    return usuarios.splice(indice, 1)[0];
}
