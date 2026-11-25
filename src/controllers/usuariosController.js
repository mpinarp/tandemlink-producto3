import { usuariosCollection } from "../db/collections.js";

/**
 * Helper to generate next numeric id in a collection
 */
const getNextId = async (collection) => {
    const last = await collection.find().sort({ id: -1 }).limit(1).toArray();
    return last[0] ? last[0].id + 1 : 1;
};

/**
 * Get all users
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await usuariosCollection.find().toArray();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

/**
 * Get a user by ID
 */
export const getUserById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const user = await usuariosCollection.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new user
 */
export const createUser = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const newId = await getNextId(usuariosCollection);
        const newUser = { id: newId, nombre, email, password };
        await usuariosCollection.insertOne(newUser);
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};

/**
 * Update an existing user
 */
export const updateUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const updateFields = { ...req.body };
        if ("id" in updateFields) delete updateFields.id;

        if (Object.keys(updateFields).length > 0) {
            const { matchedCount } = await usuariosCollection.updateOne(
                { id },
                { $set: updateFields },
            );
            if (matchedCount === 0)
                return res.status(404).json({ message: "User not found" });
        }

        const user = await usuariosCollection.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const result = await usuariosCollection.deleteOne({ id });
        if (result.deletedCount === 0)
            return res.status(404).json({ message: "User not found" });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
