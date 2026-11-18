// Importamos los diferentes módulos de resolvers
import { usuarioResolvers } from "./usuarioResolvers.js";
import { intercambioResolvers } from "./intercambioResolvers.js";
import { autenticacionResolvers } from "./autenticacionResolvers.js";

/**
 * Unificamos todos los resolvers de GraphQL.
 */
export const resolvers = {
    Query: {
        ...usuarioResolvers.Query,
        ...intercambioResolvers.Query
    },

    Mutation: {
        ...usuarioResolvers.Mutation,
        ...intercambioResolvers.Mutation,
        ...autenticacionResolvers.Mutation
    }
};