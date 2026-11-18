//# Lógica de resolución (Fase 2 memoria -> Fase 3 MongoDB)

import { usuarios, intercambios, seleccionados } from "../data/memoria.js"

let usuarioConectado = null; 

export const resolvers = {

    obtenerUsuarios: () => usuarios,
    obtenerUsuarioPorEmail: ({ email }) => usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()),
    obtenerUsuarioConectado: () => usuarioConectado,
    obtenerIntercambios: () => intercambios,
    obtenerIntercambioPorId: ({ id }) => intercambios.find(i => i.id === id),
    obtenerSeleccionados: () => seleccionados,

    crearUsuario: ({ nombre, email, password }) => {
        if (!nombre || !email || !password) {
            throw new Error("Todos los campos son obligatorios.");
        }
        const existe = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (existe) {
            throw new Error("El correo electrónico ya está registrado.");
        }
        const nuevoId = usuarios.length > 0
            ? Math.max(...usuarios.map(u => u.id)) +1
            : 1;
        const nuevoUsuario = { id: nuevoId, nombre, email, password };
        usuarios.push(nuevoUsuario);
        return nuevoUsuario;
    },

    loginUsuario: ({ email, password }) => {
        // 1. Buscamos el usuario que coincida tanto en email como en password
        const usuario = usuarios.find( u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        ); 

         // 2. Si no encontró ninguno (usuario es undefined), lanzamos error
         if (!usuario) {
        throw new Error("Correo o contraseña incorrectos.")
         }

         // 3. Guardamos la sesión activa y devolvemos el AuthPayload exacto que pide schema.js
         usuarioConectado = usuario;
        return {
             mensaje: "Inicio de sessión correcto",
             usuario: usuario,
             token: `token-tandemlink-${usuario.id}`
             };
    },

    eliminarUsuario: ({ id }) =>{                   

        const index = usuarios.findIndex(u => u.id === id);
        
        if (index === -1) {
            throw new Error("Usuario no encontrado.");
        }
        
        usuarios.splice(index, 1) ;
        return "Usuario eliminado correctamente";
    },

    crearIntercambio: ({tipo, email, idiomaOfrecido, idiomaBuscado, modalidad, descripcion, fechaCreacion }) => {

        const usuario = usuarios.find( u => u.email.toLowerCase() === email.toLowerCase());

        if (!usuario) {
            throw new Error("El correco electronico no pertenece a ningún usuario regitrado");
        }

        const nuevoId = intercambios.length > 0
            ? Math.max(...intercambios.map(i => i.id)) +1
            : 1;
       
        const nuevoIntercambio = {
        id: nuevoId,
        usuarioId: usuario.id,
        email: usuario.email,
        tipo,   
        idiomaOfrecido,
        idiomaBuscado,
        modalidad,
        descripcion,
        fechaCreacion: fechaCreacion || new Date().toISOString().split("T")[0]
        };

        intercambios.push(nuevoIntercambio);
        return nuevoIntercambio;
    },

    eliminarIntercambio: ({ id }) => {

        const index = intercambios.findIndex(i => i.id === id); 

        if (index === -1) {
            throw new Error("Intercambio no encontrado.");
        }

        intercambios.splice(index,1) ;
        return "Intercambio eliminado correctamente";

    },

    guardarSeleccionado: ({ intercambioId }) => {

        const intercambio = intercambios.find( i => i.id === intercambioId);

        if (!intercambio) {
            throw new Error(" Intercambio no encontrado")
        }

        if (seleccionados.some(s => s.id === intercambioId)) {
            throw new Error("Este intercambio ya está en seleccionados");
        }

        seleccionados.push(intercambio);
        return intercambio;

    },

    eliminarSeleccionado: ({ id }) => {

        const index = seleccionados.findIndex( s => s.id === id);

        if (index === -1) {
            throw new Error("Seleccionado no encontrado");
        }

        seleccionados.splice(index, 1);
        return "Seleccionado eliminado correctamente"
    },

    cerrarSesion: () => {
        usuarioConectado = null;
        return "Sesión cerrada correctamente";
    }

}

    

 


