import { intercambiosCollection } from "../db/collections.js";

/**
 * Helper to generate next numeric id in a collection
 */
const getNextId = async (collection) => {
    const last = await collection.find().sort({ id: -1 }).limit(1).toArray();
    return last[0] ? last[0].id + 1 : 1;
};

/**
 * Get all exchanges
 */
export const getAllIntercambios = async (req, res, next) => {
    try {
        const intercambios = await intercambiosCollection.find().toArray();
        res.json(intercambios);
    } catch (err) {
        next(err);
    }
};

/**
 * Get an exchange by ID
 */
export const getIntercambioById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const intercambio = await intercambiosCollection.findOne({ id });
        if (!intercambio)
            return res.status(404).json({ message: "Exchange not found" });

        res.json(intercambio);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new exchange
 */
export const createIntercambio = async (req, res, next) => {
    try {
        const {
            tipo,
            usuarioId,
            idiomaOfrecido,
            idiomaBuscado,
            modalidad,
            descripcion,
            fechaCreacion,
        } = req.body;
        if (
            !tipo ||
            !usuarioId ||
            !idiomaOfrecido ||
            !idiomaBuscado ||
            !modalidad ||
            !descripcion ||
            !fechaCreacion
        ) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const newId = await getNextId(intercambiosCollection);
        const newIntercambio = {
            id: newId,
            tipo,
            usuarioId: parseInt(usuarioId, 10),
            idiomaOfrecido,
            idiomaBuscado,
            modalidad,
            descripcion,
            fechaCreacion,
        };
        await intercambiosCollection.insertOne(newIntercambio);
        res.status(201).json(newIntercambio);
    } catch (err) {
        next(err);
    }
};

/**
 * Update an existing exchange
 */
export const updateIntercambio = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const updateFields = { ...req.body };
        if ("id" in updateFields) delete updateFields.id;
        if ("usuarioId" in updateFields)
            updateFields.usuarioId = parseInt(updateFields.usuarioId, 10);

        if (Object.keys(updateFields).length > 0) {
            const { matchedCount } = await intercambiosCollection.updateOne(
                { id },
                { $set: updateFields },
            );
            if (matchedCount === 0)
                return res.status(404).json({ message: "Exchange not found" });
        }

        const intercambio = await intercambiosCollection.findOne({ id });
        if (!intercambio)
            return res.status(404).json({ message: "Exchange not found" });

        res.json(intercambio);
    } catch (err) {
        next(err);
    }
};

/**
 * Delete an exchange by ID
 */
export const deleteIntercambio = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const result = await intercambiosCollection.deleteOne({ id });
        if (result.deletedCount === 0)
            return res.status(404).json({ message: "Exchange not found" });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
