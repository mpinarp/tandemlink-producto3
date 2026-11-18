import { obtenerDB } from "../config/db.js";

export const obtenerSeleccionados = async () => {
    return await obtenerDB().collection("seleccionados").find({}).toArray();
};

export const guardarSeleccionado = async ({ intercambioId }, context ) => {
    if (!context || !context.usuario){
        throw new Error("Acceso denegado: debes iniciar sesión y enviar un token JWT válido.");
    }
    const intercambio = await obtenerDB().collection("intercambios").findOne({ id: intercambioId });

    if (!intercambio) {
        throw new Error("Intercambio no encontrado.");
    }

    const colSeleccionados = obtenerDB().collection("seleccionados");
    const yaExiste = await colSeleccionados.findOne({ id: intercambioId });
    if (yaExiste) {
        throw new Error("Este intercambio ya está en seleccionados.");
    }

    const { _id, ...intercambioLimpio } = intercambio;
    await colSeleccionados.insertOne(intercambioLimpio);
    return intercambioLimpio;
};

export const eliminarSeleccionado = async ({ id }) => {
    const col = obtenerDB().collection("seleccionados");
    const resultado = await col.deleteOne({ id });

    if (resultado.deletedCount === 0) {
        throw new Error("Seleccionado no encontrado.");
    }

    return "Seleccionado eliminado correctamente";
};