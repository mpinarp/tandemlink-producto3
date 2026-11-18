
// Importamos la herramienta para construir el esquema GraphQL.
import { buildSchema } from 'graphql';

// Definimos los tipos, consultas y mutaciones de nuestra API.
export const schema = buildSchema(`
    # Datos públicos de un usuario.
    # No exponemos la contraseña en las consultas.
    type Usuario {
        id: ID!
        nombre: String!
        email: String!
    }

    # Datos de un intercambio.
    type Intercambio {
        id: ID!
        tipo: String!
        usuarioId: ID!
        idiomaOfrecido: String!
        idiomaBuscado: String!
        modalidad: String!
        descripcion: String!
        fechaCreacion: String!
    }

    # Datos necesarios para crear un usuario.
    input UsuarioInput {
        nombre: String!
        email: String!
        password: String!
    }

    # Datos que pueden modificarse en un usuario.
    input UsuarioActualizarInput {
        nombre: String
        email: String
        password: String
    }

    # Datos necesarios para crear un intercambio.
    input IntercambioInput {
        tipo: String!
        usuarioId: ID!
        idiomaOfrecido: String!
        idiomaBuscado: String!
        modalidad: String!
        descripcion: String!
    }

    # Datos que pueden modificarse en un intercambio.
    input IntercambioActualizarInput {
        tipo: String
        usuarioId: ID
        idiomaOfrecido: String
        idiomaBuscado: String
        modalidad: String
        descripcion: String
    }

    # Consultas disponibles en la API.
    type Query {
        usuarios: [Usuario!]!
        usuario(id: ID!): Usuario
        intercambios: [Intercambio!]!
        intercambio(id: ID!): Intercambio
    }

    # Operaciones para modificar los datos.
    type Mutation {
        crearUsuario(datos: UsuarioInput!): Usuario!
        editarUsuario(id: ID!, datos: UsuarioActualizarInput!): Usuario!
        eliminarUsuario(id: ID!): Usuario!

        crearIntercambio(datos: IntercambioInput!): Intercambio!
        editarIntercambio(id: ID!, datos: IntercambioActualizarInput!): Intercambio!
        eliminarIntercambio(id: ID!): Intercambio!
    }
`);
