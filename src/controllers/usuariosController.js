import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { obtenerDB } from "../config/db.js";

let usuarioConectado = null;

export const obtenerUsuarios = async () => {
    return await obtenerDB().collection("usuarios").find({}, { projection: { password: 0 } }).toArray();
};

export const obtenerUsuarioPorEmail = async ({ email }) => {
    return await obtenerDB().collection("usuarios").findOne({ email: email.toLowerCase() }, { projection: { password: 0 } });
};

export const obtenerUsuarioConectado = () => usuarioConectado;

export const crearUsuario = async ({ nombre, email, password }) => {
    if (!nombre || !email || !password) {
        throw new Error("Todos los campos son obligatorios.");
    }

    const col = obtenerDB().collection("usuarios");
    const existe = await col.findOne({ email: email.toLowerCase() });
    if (existe) {
        throw new Error("El email ya está registrado.");
    }

    const ultimo = await col.find().sort({ id: -1 }).limit(1).toArray();
    const nuevoId = ultimo.length > 0 ? ultimo[0].id + 1 : 1;

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
        id: nuevoId,
        nombre,
        email: email.toLowerCase(),
        password: passwordHash
    };

    await col.insertOne(nuevoUsuario);
    return { id: nuevoId, nombre, email: email.toLowerCase() };
};

export const loginUsuario = async ({ email, password }) => {
    const col = obtenerDB().collection("usuarios");
    const usuario = await col.findOne({ email: email.toLowerCase() });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        throw new Error("Correo o contraseña incorrectos.");
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || "clave_secreta_tandemlink_2026",
        { expiresIn: "2h" }
    );

    usuarioConectado = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
    };

    return {
        mensaje: "Inicio de sesión correcto",
        usuario: usuarioConectado,
        token
    };
};

export const eliminarUsuario = async ({ id }) => {
    const col = obtenerDB().collection("usuarios");
    const resultado = await col.deleteOne({ id });

    if (resultado.deletedCount === 0) {
        throw new Error("Usuario no encontrado.");
    }

    return "Usuario eliminado correctamente";
};

export const cerrarSesion = () => {
    usuarioConectado = null;
    return "Sesión cerrada correctamente";
};