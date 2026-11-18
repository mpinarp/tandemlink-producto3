/**
 * @fileoverview Esquema GraphQL de TandemLink (Types, Queries y Mutations).
 * Define la estructura de datos y las operaciones disponibles en la API.
 */

// buildSchema es la función de la librería graphql que traduce la definición en texto (SDL) a un esquema ejecutable por el servidor
import {buildSchema} from "graphql";

// Definición del esquema GraphQL utilizando la sintaxis de GraphQL SDL (Schema Definition Language)

export const schema = buildSchema(`
    # Modelo de usuario registrado. La exclamación (!) indica campo obligatorio (no nulo). No exponemos password.
    type Usuario {
        id: Int!
        nombre: String!
        email: String!
    }


    # Modelo de oferta o petición de idioma. 
    # Los campos sin (!) son opcionales para mantenir compatibilidad con los datos iniciales.
    type Intercambio {
        id: Int!
        usuarioId: Int
        tipo: String!
        idiomaOfrecido: String!
        idiomaBuscado: String!
        modalidad: String!
        descripcion: String
        fechaCreacion: String
        email: String
    }
    
    # Objeto de respuesta al iniciar sesión: devuelve confirmación, los datos del usuario y su token.
    type AuthPayload {
        token: String!
        usuario: Usuario!
        mensaje: String!
    }
    
    # Consultas de lectura (equivalentes a los GET o funciones de consulta de almacenaje.js)
    type Query {

        # Devuelve el listado completo de usuarios    
        obtenerUsuarios: [Usuario!]!

        # Devuelve todos los intercambios publicados
        obtenerIntercambios: [Intercambio!]!

        # Busca un intercambio concreto por su ID numérico
        obtenerIntercambioPorId(id: Int!): Intercambio

        # Busca un usuario por su correo electrónico
        obtenerUsuarioPorEmail(email: String!): Usuario

        # Devuelve los intercambios marcados como favoritos/seleccionados
        obtenerSeleccionados: [Intercambio!]!

        # Devuelve el usuario con sesión activa actualmente (o null si no hay nadie conectado)
        obtenerUsuarioConectado: Usuario
    }
    

    # Operaciones que crean, modifican, eliminan datos o gestionan la sesión
    type Mutation {

        # Registra un nuevo usuario en el sistema
        crearUsuario(nombre: String!, email: String!, password: String!): Usuario!

        # Valida credenciales, inicia sesión y devuelve el AuthPayload con token
        loginUsuario(email: String!, password:String!): AuthPayload!

        # Elimina un usuario existente a partir de su ID
        eliminarUsuario(id: Int!): String!

        # Crea un nuevo intercambio validando que el email pertenezca a un usuario registrado
        crearIntercambio(tipo: String!, email: String!, idiomaOfrecido: String!, idiomaBuscado: String!, modalidad: String!, descripcion: String, fechaCreacion: String): Intercambio!

        # Borra un intercambio por su ID
        eliminarIntercambio(id: Int!): String!

        # Añade un intercambio existente a la lista de seleccionados
        guardarSeleccionado(intercambioId: Int!): Intercambio!

        # Quita un intercambio de la lista de seleccionados
        eliminarSeleccionado(id: Int!): String!

        # Cierra la sesión del usuario activo
        cerrarSesion: String!
        }
        `)

