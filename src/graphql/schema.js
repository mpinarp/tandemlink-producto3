import { buildSchema } from "graphql";
import {
    usuariosCollection,
    intercambiosCollection,
} from "../db/collections.js";

export const schema = buildSchema(`
  type User {
    id: Int!
    nombre: String!
    email: String!
    password: String!
  }

  type Exchange {
    id: Int!
    tipo: String!
    usuarioId: Int!
    idiomaOfrecido: String!
    idiomaBuscado: String!
    modalidad: String!
    descripcion: String!
    fechaCreacion: String!
  }

  type Query {
    users: [User]!
    user(id: Int!): User
    exchanges: [Exchange]!
    exchange(id: Int!): Exchange
  }

  type Mutation {
    createUser(nombre: String!, email: String!, password: String!): User!
    updateUser(id: Int!, nombre: String, email: String, password: String): User!
    deleteUser(id: Int!): Boolean!

    createExchange(tipo: String!, usuarioId: Int!, idiomaOfrecido: String!, idiomaBuscado: String!, modalidad: String!, descripcion: String!, fechaCreacion: String!): Exchange!
    updateExchange(id: Int!, tipo: String, usuarioId: Int, idiomaOfrecido: String, idiomaBuscado: String, modalidad: String, descripcion: String, fechaCreacion: String): Exchange!
    deleteExchange(id: Int!): Boolean!
  }
`);

/**
 * Helper to generate next numeric id in a collection
 */
const getNextId = async (collection) => {
    const last = await collection.find().sort({ id: -1 }).limit(1).toArray();
    return last[0] ? last[0].id + 1 : 1;
};

/**
 * Keep only the fields that were actually sent (not undefined)
 */
const definedFields = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

/**
 * Update a document by numeric id and return the updated document.
 * Uses updateOne + findOne so it works the same on every driver version.
 */
const updateById = async (collection, id, fields, notFoundMessage) => {
    if (Object.keys(fields).length > 0) {
        const { matchedCount } = await collection.updateOne(
            { id },
            { $set: fields },
        );
        if (matchedCount === 0) throw new Error(notFoundMessage);
    }
    const doc = await collection.findOne({ id });
    if (!doc) throw new Error(notFoundMessage);
    return doc;
};

export const rootValue = {
    // ---- Queries ----
    users: async () => usuariosCollection.find().toArray(),

    user: async ({ id }) => {
        const user = await usuariosCollection.findOne({ id });
        if (!user) throw new Error("User not found");
        return user;
    },

    exchanges: async () => intercambiosCollection.find().toArray(),

    exchange: async ({ id }) => {
        const exchange = await intercambiosCollection.findOne({ id });
        if (!exchange) throw new Error("Exchange not found");
        return exchange;
    },

    // ---- User mutations ----
    createUser: async ({ nombre, email, password }) => {
        const newUser = {
            id: await getNextId(usuariosCollection),
            nombre,
            email,
            password,
        };
        await usuariosCollection.insertOne(newUser);
        return newUser;
    },

    updateUser: async ({ id, nombre, email, password }) =>
        updateById(
            usuariosCollection,
            id,
            definedFields({ nombre, email, password }),
            "User not found",
        ),

    deleteUser: async ({ id }) => {
        const { deletedCount } = await usuariosCollection.deleteOne({ id });
        if (deletedCount === 0) throw new Error("User not found");
        return true;
    },

    // ---- Exchange mutations ----
    createExchange: async ({
        tipo,
        usuarioId,
        idiomaOfrecido,
        idiomaBuscado,
        modalidad,
        descripcion,
        fechaCreacion,
    }) => {
        const newExchange = {
            id: await getNextId(intercambiosCollection),
            tipo,
            usuarioId,
            idiomaOfrecido,
            idiomaBuscado,
            modalidad,
            descripcion,
            fechaCreacion,
        };
        await intercambiosCollection.insertOne(newExchange);
        return newExchange;
    },

    updateExchange: async ({
        id,
        tipo,
        usuarioId,
        idiomaOfrecido,
        idiomaBuscado,
        modalidad,
        descripcion,
        fechaCreacion,
    }) =>
        updateById(
            intercambiosCollection,
            id,
            definedFields({
                tipo,
                usuarioId,
                idiomaOfrecido,
                idiomaBuscado,
                modalidad,
                descripcion,
                fechaCreacion,
            }),
            "Exchange not found",
        ),

    deleteExchange: async ({ id }) => {
        const { deletedCount } = await intercambiosCollection.deleteOne({ id });
        if (deletedCount === 0) throw new Error("Exchange not found");
        return true;
    },
};
