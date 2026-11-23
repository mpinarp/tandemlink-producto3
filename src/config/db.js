
import { MongoClient } from 'mongodb';

// Variables para gestionar la conexión.
let cliente;
let baseDatos;

// Función para conectar con MongoDB.
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

// Función para obtener la base de datos.
export function obtenerDB() {
    if (!baseDatos) {
        throw new Error('La base de datos todavía no está conectada.');
    }

    return baseDatos;
}
