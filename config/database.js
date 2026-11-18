import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Obtenemos los datos de conexión desde el archivo .env
const usuario = encodeURIComponent(process.env.MONGO_ROOT_USERNAME);
const password = encodeURIComponent(process.env.MONGO_ROOT_PASSWORD);
const baseDatos = process.env.MONGO_DATABASE;
const host = process.env.MONGO_HOST || "localhost";

// Construimos la dirección de conexión
const uri = `mongodb://${usuario}:${password}@${host}:27017/${baseDatos}?authSource=admin`;

// Creamos el cliente de MongoDB
const cliente = new MongoClient(uri);

let db;

/**
 * Establece la conexión con MongoDB.
 * @returns {Promise<import("mongodb").Db>} Base de datos conectada.
 */
export async function conectarBaseDatos() {
    await cliente.connect();

    db = cliente.db(baseDatos);

    // Comprobamos que la conexión funciona
    await db.command({ ping: 1 });

    console.log("Conexión con MongoDB establecida correctamente.");

    return db;
}

/**
 * Devuelve la instancia de la base de datos.
 * @returns {import("mongodb").Db} Base de datos activa.
 */
export function obtenerBaseDatos() {
    if (!db) {
        throw new Error("La base de datos no está conectada.");
    }

    return db;
}

/**
 * Cierra la conexión con MongoDB.
 */
export async function cerrarConexion() {
    await cliente.close();
    db = null;
}