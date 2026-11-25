import { usuarios, intercambios } from "../data/memoria.js";

let nextUserId = Math.max(...usuarios.map((u) => u.id), 0) + 1;
let nextIntercambioId = Math.max(...intercambios.map((i) => i.id), 0) + 1;

const resolvers = {
    Query: {
        usuarios: () => usuarios,
        usuario: (_, { id }) => usuarios.find((u) => u.id === parseInt(id)),
        intercambios: () => intercambios,
        intercambio: (_, { id }) =>
            intercambios.find((i) => i.id === parseInt(id)),
    },
    Mutation: {
        addUsuario: (_, { nombre, email, password }) => {
            const newUser = { id: nextUserId++, nombre, email, password };
            usuarios.push(newUser);
            return newUser;
        },
        updateUsuario: (_, { id, nombre, email, password }) => {
            const user = usuarios.find((u) => u.id === parseInt(id));
            if (!user) throw new Error("Usuario no encontrado");
            if (nombre !== undefined) user.nombre = nombre;
            if (email !== undefined) user.email = email;
            if (password !== undefined) user.password = password;
            return user;
        },
        deleteUsuario: (_, { id }) => {
            const idx = usuarios.findIndex((u) => u.id === parseInt(id));
            if (idx === -1) return false;
            usuarios.splice(idx, 1);
            return true;
        },
        addIntercambio: (
            _,
            {
                tipo,
                usuarioId,
                idiomaOfrecido,
                idiomaBuscado,
                modalidad,
                descripcion,
                fechaCreacion,
            },
        ) => {
            const newInter = {
                id: nextIntercambioId++,
                tipo,
                usuarioId: parseInt(usuarioId),
                idiomaOfrecido,
                idiomaBuscado,
                modalidad,
                descripcion,
                fechaCreacion,
            };
            intercambios.push(newInter);
            return newInter;
        },
        updateIntercambio: (
            _,
            {
                id,
                tipo,
                usuarioId,
                idiomaOfrecido,
                idiomaBuscado,
                modalidad,
                descripcion,
                fechaCreacion,
            },
        ) => {
            const inter = intercambios.find((i) => i.id === parseInt(id));
            if (!inter) throw new Error("Intercambio no encontrado");
            if (tipo !== undefined) inter.tipo = tipo;
            if (usuarioId !== undefined) inter.usuarioId = parseInt(usuarioId);
            if (idiomaOfrecido !== undefined)
                inter.idiomaOfrecido = idiomaOfrecido;
            if (idiomaBuscado !== undefined)
                inter.idiomaBuscado = idiomaBuscado;
            if (modalidad !== undefined) inter.modalidad = modalidad;
            if (descripcion !== undefined) inter.descripcion = descripcion;
            if (fechaCreacion !== undefined)
                inter.fechaCreacion = fechaCreacion;
            return inter;
        },
        deleteIntercambio: (_, { id }) => {
            const idx = intercambios.findIndex((i) => i.id === parseInt(id));
            if (idx === -1) return false;
            intercambios.splice(idx, 1);
            return true;
        },
    },
};

export default resolvers;
