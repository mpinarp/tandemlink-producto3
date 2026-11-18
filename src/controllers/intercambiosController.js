// # Controladores REST (Fase 1: ExpressJS) y MongoDB (Fase 3: GraphQL)

/**
 * @fileoverview Controladores de ExpressJS (REST en memoria) y GraphQL (MongoDB) para gestionar los intercambios.
 * Replica las validaciones y estructura de datos definidas en el Producto 2.
 */

import { intercambios, usuarios } from "../data/memoria.js";
import { obtenerDB } from "../config/db.js";

// =========================================================================
// FASE 1: CONTROLADORES REST EN MEMORIA (ExpressJS)
// =========================================================================

/**
 * Obtiene todos los intercambios en memoria.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const obtenerTodos = (req, res) => { 
    try {
        res.status(200).json(intercambios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los intercambios", detalle: error.message });
    }
};

/**
 * Crea un nuevo intercambio en memoria validando campos y usuario existente.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const crearIntercambio = (req, res) => { 
    try {
        const { tipo, email, usuarioId, idiomaOfrecido, idiomaBuscado, modalidad, descripcion, fechaCreacion } = req.body; 
        
        if (!tipo || !idiomaOfrecido || !idiomaBuscado || !modalidad || !email) {
            return res.status(400).json({ error: "Faltan campos obligatorios (tipo, email, idiomaOfrecido, idiomaBuscado, modalidad)" });
        }
        
        const usuarioRegistrado = usuarios.find(u =>
            (email && u.email.toLowerCase() === email.toLowerCase()) ||
            (usuarioId && u.id === Number(usuarioId))
        );

        if (!usuarioRegistrado) {
            return res.status(400).json({ error: "El correo electrónico no pertenece a ningún usuario registrado." });
        }

        const nuevoId = intercambios.length > 0
            ? Math.max(...intercambios.map(intercambio => intercambio.id)) + 1
            : 1;
        
        const nuevoIntercambio = {
            id: nuevoId,
            usuarioId: usuarioRegistrado.id,
            fechaCreacion: fechaCreacion || new Date().toISOString().split('T')[0],
            tipo,
            idiomaOfrecido,
            idiomaBuscado,
            modalidad,
            descripcion
        };

        intercambios.push(nuevoIntercambio);
        res.status(201).json(nuevoIntercambio);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el intercambio", detalle: error.message });
    }
};

/**
 * Elimina un intercambio existente en memoria.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const eliminarIntercambio = (req, res) => {
    try {
        const id = Number(req.params.id);
        const index = intercambios.findIndex(intercambio => intercambio.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Intercambio no encontrado" });
        }

        if (intercambios.splice(index, 1)) {
            res.status(200).json({ message: "Intercambio eliminado correctamente" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el intercambio", detalle: error.message });
    }
};

// =========================================================================
// FASE 3: CONTROLADORES PERSISTENTES EN MONGODB (GraphQL)
// =========================================================================

export const obtenerIntercambiosMongo = async () => {
    return await obtenerDB().collection("intercambios").find({}).toArray();
};

export const obtenerIntercambioPorIdMongo = async ({ id }) => {
    return await obtenerDB().collection("intercambios").findOne({ id });
};

export const crearIntercambioMongo = async ({ tipo, email, idiomaOfrecido, idiomaBuscado, modalidad, descripcion, fechaCreacion }) => {
    const usuario = await obtenerDB().collection("usuarios").findOne({ email: email.toLowerCase() });
    if (!usuario) {
        throw new Error("El correo electrónico no pertenece a ningún usuario registrado.");
    }

    const colIntercambios = obtenerDB().collection("intercambios");
    const ultimo = await colIntercambios.find().sort({ id: -1 }).limit(1).toArray();
    const nuevoId = ultimo.length > 0 ? ultimo[0].id + 1 : 1;

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

    await colIntercambios.insertOne(nuevoIntercambio);
    return nuevoIntercambio;
};

export const eliminarIntercambioMongo = async ({ id }) => {
    const col = obtenerDB().collection("intercambios");
    const resultado = await col.deleteOne({ id });

    if (resultado.deletedCount === 0) {
        throw new Error("Intercambio no encontrado.");
    }

    return "Intercambio eliminado correctamente";
};