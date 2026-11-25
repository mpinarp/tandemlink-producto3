
import { MongoClient } from 'mongodb';

// Variables para gestionar la conexión.
let cliente;
let baseDatos;

/**
 * Establece la conexión con MongoDB y selecciona la base de datos.
 *
 * Obtiene la URI de conexión y el nombre de la base de datos
 * desde las variables de entorno. Crea un cliente de MongoDB,
 * establece la conexión y guarda la instancia de la base de datos
 * para que pueda utilizarse desde otros módulos.
 *
 * @async
 * @returns {Promise<import('mongodb').Db>} Promesa que devuelve la instancia de la base de datos conectada.
 * @throws {Error} Si falta alguna variable de configuración o se produce un error de conexión.
 */
export async function conectarDB() {
    try {
        // Leemos las variables de entorno cuando ya están cargadas.
        const uri = process.env.MONGODB_URI;
        const nombreBD = process.env.MONGODB_DATABASE;

        // Comprobamos que la configuración existe.
        if (!uri || !nombreBD) {
            throw new Error('Falta la configuración de MongoDB en .env');
        }

        // Creamos el cliente y conectamos con MongoDB.
        cliente = new MongoClient(uri);
        await cliente.connect();

        // Seleccionamos la base de datos del proyecto.
        baseDatos = cliente.db(nombreBD);

        console.log('Conexión con MongoDB establecida correctamente.');

        return baseDatos;

    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        throw error;
    }
}

/**
 * Devuelve la instancia de la base de datos previamente conectada.
 *
 * Permite acceder a MongoDB desde los controladores y otros módulos
 * sin tener que crear una nueva conexión cada vez.
 *
 * @returns {import('mongodb').Db} Instancia de la base de datos conectada.
 * @throws {Error} Si se intenta acceder a la base de datos antes de establecer la conexión.
 */
export function obtenerDB() {
    if (!baseDatos) {
        throw new Error('La base de datos todavía no está conectada.');
    }

    return baseDatos;
}
