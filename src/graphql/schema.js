
/**
 * Módulo encargado de definir el esquema de la API GraphQL.
 *
 * Declara los tipos de datos, las consultas, las mutaciones
 * y los inputs que permiten interactuar con usuarios,
 * intercambios y favoritos.
 *
 * El esquema se construye mediante buildSchema de GraphQL
 * utilizando la sintaxis SDL (Schema Definition Language).
 *
 * @module graphql/schema
 */

 // Importamos la herramienta para construir el esquema GraphQL.
import { buildSchema } from 'graphql';

/**
 * Esquema de la API GraphQL de TandemLink.
 *
 * Define los tipos públicos, los tipos de entrada,
 * las consultas de lectura y las mutaciones de modificación.
 *
 * @type {import('graphql').GraphQLSchema}
 */
export const schema = buildSchema(`
    # ======================================================
    # TIPOS DE DATOS
    # ======================================================

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

    # ======================================================
    # TIPOS DE ENTRADA
    # ======================================================

    # Datos necesarios para crear un usuario.
    input UsuarioInput {
        nombre: String!
        email: String!
        password: String!
    }

    # Datos que pueden modificarse en un usuario.
    # Todos los campos son opcionales.
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
    # Todos los campos son opcionales.
    input IntercambioActualizarInput {
        tipo: String
        usuarioId: ID
        idiomaOfrecido: String
        idiomaBuscado: String
        modalidad: String
        descripcion: String
    }

    # ======================================================
    # CONSULTAS
    # ======================================================

    # Consultas disponibles para recuperar información.
    type Query {

        # Recupera todos los usuarios.
        usuarios: [Usuario!]!

        # Busca un usuario por su identificador.
        usuario(id: ID!): Usuario

        # Busca un usuario por su correo.
        usuarioPorEmail(email: String!): Usuario

        # Recupera todos los intercambios.
        intercambios: [Intercambio!]!

        # Busca un intercambio por su identificador.
        intercambio(id: ID!): Intercambio

        # Recupera todos los intercambios seleccionados.
        seleccionados: [Intercambio!]!
    }

    # ======================================================
    # MUTACIONES
    # ======================================================

    # Operaciones para modificar los datos.
    type Mutation {

        # Crea un usuario.
        crearUsuario(datos: UsuarioInput!): Usuario!

        # Actualiza los datos de un usuario.
        editarUsuario(id: ID!, datos: UsuarioActualizarInput!): Usuario!

        # Elimina un usuario.
        eliminarUsuario(id: ID!): Usuario!

        # Crea un intercambio.
        crearIntercambio(datos: IntercambioInput!): Intercambio!

        # Actualiza los datos de un intercambio.
        editarIntercambio(id: ID!, datos: IntercambioActualizarInput!): Intercambio!

        # Elimina un intercambio.
        eliminarIntercambio(id: ID!): Intercambio!

        # Guarda o actualiza un intercambio en favoritos.
        guardarSeleccionado(id: ID!): Intercambio!

        # Elimina un intercambio de favoritos.
        eliminarSeleccionado(id: ID!): Intercambio!
    }
`);
