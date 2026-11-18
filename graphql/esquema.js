import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers/index.js";

// Definimos los tipos y las consultas GraphQL
const typeDefs = `
    # Tipo que representa un usuario
    type Usuario {
        id: Int!
        nombre: String!
        email: String!
    }

    # Tipo que representa la respuesta de autenticación
    type Autenticacion {
        token: String!
    }

    # Tipo que representa un intercambio
    type Intercambio {
        id: Int!
        tipo: String!
        usuarioId: Int!
        idiomaOfrecido: String!
        idiomaBuscado: String!
        modalidad: String!
        descripcion: String!
        fechaCreacion: String!
    }

    # Datos necesarios para crear o actualizar un usuario
    input UsuarioInput {
        nombre: String!
        email: String!
    }

    # Datos necesarios para crear o actualizar un intercambio
    input IntercambioInput {
        tipo: String!
        usuarioId: Int!
        idiomaOfrecido: String!
        idiomaBuscado: String!
        modalidad: String!
        descripcion: String!
        fechaCreacion: String!
    }

    # Consultas disponibles
    type Query {
        usuarios: [Usuario!]!
        usuario(id: Int!): Usuario
        usuarioPorEmail(email: String!): Usuario

        intercambios: [Intercambio!]!
        intercambio(id: Int!): Intercambio
        seleccionados: [Intercambio!]!
    }
    
    # Operaciones para modificar los datos
    type Mutation {
        # Iniciamos sesión como administrador
        loginAdministrador(email: String!, password: String!): Autenticacion
        crearUsuario(datos: UsuarioInput!): Usuario
        actualizarUsuario(id: Int!, datos: UsuarioInput!): Usuario
        eliminarUsuario(id: Int!): Boolean!

        crearIntercambio(datos: IntercambioInput!): Intercambio
        actualizarIntercambio(id: Int!, datos: IntercambioInput!): Intercambio
        eliminarIntercambio(id: Int!): Boolean!
        guardarSeleccionado(id: Int!): Intercambio
        eliminarSeleccionado(id: Int!): Boolean!
    }
`;

// Creamos y exportamos el esquema
export const esquema = makeExecutableSchema({
    typeDefs,
    resolvers
});