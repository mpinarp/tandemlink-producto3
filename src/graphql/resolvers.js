//# Lógica de resolución (Fase 2 memoria -> Fase 3 MongoDB)

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { obtenerDB } from "../config/db.js";


let usuarioConectado = null; 

export const resolvers = {

    obtenerUsuarios: async () => await obtenerDB().collection("usuarios").find({}, { projection: { password: 0 } }).toArray(),
    obtenerUsuarioPorEmail: async ({ email }) =>await obtenerDB().collection("usuarios").findOne({ email: email.toLowerCase() }, { projection: { password: 0 } }),
    obtenerUsuarioConectado: () => usuarioConectado,
    obtenerIntercambios: async () => await obtenerDB().collection("intercambios").find({}).toArray(),
    obtenerIntercambioPorId: async ({ id }) => await obtenerDB().collection("intercambios").findOne({ id }),
    obtenerSeleccionados: async () => await obtenerDB().collection("seleccionados").find({}).toArray(),

    crearUsuario: async ({ nombre, email, password }) => {
        // 1. Validamos campos obligatorios
        if (!nombre || !email || !password) {
            throw new Error("Todos los campos son obligatorios.");
        }
        // 2. Obtenemos la colección y comprobamos que el email no exista en MongoDB
         const col = obtenerDB().collection("usuarios");
         const existe = await col.findOne({ email: email.toLowerCase() });
        if (existe) {
            throw new Error("El email ya está registrado")
         }

       
        // 3. Calculamos el siguiente ID numérico consultando el más alto en MongoDB
        const ultimo = await col.find().sort({ id: -1 }).limit(1).toArray();
        const nuevoId = ultimo.length > 0 ? ultimo[0].id + 1 : 1;

        // 4. Encriptamos la contraseña, insertamos en MongoDB y devolvemos el usuario sin password
        const passwordHash = await bcrypt.hash(password, 10);
        const nuevoUsuario = {
            id: nuevoId,
            nombre,
            email: email.toLowerCase(),
            password: passwordHash
        };
        await col.insertOne(nuevoUsuario);
        return { id: nuevoId, nombre, email: email.toLowerCase() };
    },
    

    loginUsuario: async ({ email, password }) => {
       // 1. Buscamos el usuario por correo en la colección 'usuarios' de MongoDB
      
       const col = obtenerDB().collection("usuarios");
       const usuario = await col.findOne({ email: email.toLowerCase() });

        // 2. Si no existe o la contraseña no coincide con el hash guardado, lanzamos error
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            throw new Error("Correo o contraseña incorrectos.")
         }


         // 3. Generamos el token JWT firmado con la clave secreta del entorno
         const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET || "clave_secreta_tandemlink_2026",
            {expiresIn: "2h" }
         );

        // 4. Guardamos la sesión activa (sin exponer el hash del password) y devolvemos AuthPayload
         usuarioConectado = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
         }; 

        return {
             mensaje: "Inicio de sessión correcto",
             usuario: usuarioConectado,
             token
             };
    },

    eliminarUsuario: async ({ id }) =>{      

        const col = obtenerDB().collection("usuarios");
        const resultado = await col.deleteOne({ id });
               
        if (resultado.deletedCount === 0) {
            throw new Error("Usuario no encontrado.");
        }
        
        return "Usuario eliminado correctamente";
    },

    crearIntercambio: async ({tipo, email, idiomaOfrecido, idiomaBuscado, modalidad, descripcion, fechaCreacion }) => {
        // 1. Verificamos que el correo pertenezca a un usuario registrado en MongoDB
        const usuario = await obtenerDB().collection("usuarios").findOne({ email: email.toLowerCase() });
        if (!usuario) {
            throw new Error("El correo electrónico no pertenece a ningún usuario registrado.")
         }

        // 2. Calculamos el siguiente ID numérico en la colección 'intercambios'
        const colIntercambios = obtenerDB().collection("intercambios");
        const ultimo = await colIntercambios.find().sort({ id: -1 }).limit(1).toArray();
        const nuevoId = ultimo.length > 0 ? ultimo[0].id + 1 : 1;
       
        // 3. Construimos el documento e insertamos en MongoDB
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

        await colIntercambios.insertOne(nuevoIntercambio)
        return nuevoIntercambio;
    },

    eliminarIntercambio: async ({ id }) => {

        const col = obtenerDB().collection("intercambios");
        const resultado = await col.deleteOne ({ id });

        if (resultado.deletedCount === 0) {
            throw new Error("Intercambio no encontrado.");
        }

        
        return "Intercambio eliminado correctamente";

    },

    guardarSeleccionado: async ({ intercambioId }) => {

        const intercambio =  await obtenerDB().collection("intercambios").findOne({ id: intercambioId });

        if (!intercambio) {
            throw new Error(" Intercambio no encontrado")
        }

        const colSeleccionados = obtenerDB().collection("seleccionados"); 
        const yaExiste = await colSeleccionados.findOne({ id: intercambioId });
        if (yaExiste) {
            throw new Error("Este intercambio ya está en seleccionados.");
        }

        const { _id, ...intercambioLimpio } = intercambio;
        await colSeleccionados.insertOne(intercambioLimpio);
        return intercambioLimpio;

    },

    eliminarSeleccionado: async ({ id }) => {

        const col = obtenerDB().collection("seleccionados");
        const resultado = await col.deleteOne ( { id });

        if (resultado.deleteCount === 0) {
            throw new Error("Seleccionado no encontrado");
        }

        return "Seleccionado eliminado correctamente"
    },

    cerrarSesion: () => {
        usuarioConectado = null;
        return "Sesión cerrada correctamente";
    }

}

    

 


