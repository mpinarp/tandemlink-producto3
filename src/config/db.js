// # Conexión nativa a MongoDB (Driver oficial, sin Mongoose)

/**
 * @fileoverview Este archivo gestiona la conexión única a MongoDB mediante Driver nativo MongoClient e inicializa índices y validaciones. 
 */

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/tandemlink";

const client = new MongoClient(uri);
let db = null;

async function configurarColecciones (database){
    // 1. Índice único en email para impedir usuarios duplicados en MongoDB
    await database.collection("usuarios").createIndex({ email: 1 }, { unique : true });

    // 2. Comprobamos si existe la colección intercambios; si no, la creamos con validación nativa
    const colecciones = await database.listCollections({ name: "intercambios" }).toArray();
    if (colecciones.length === 0) {
        await database.createCollection ("intercambios", {
            validator: {
                $jsonSchema:{
                    bsonType: "object",
                    required: ["tipo", "idiomaOfrecido", "idiomaBuscado", "modalidad"],
                    properties: {
                        tipo: { enum : ["oferta", "petición"] }, 
                        modalidad: { enum: ["Online", "Presencial"] }
                    }
                }
            }
        });
    }

}

export async function conectarDB() {
    if (db) return db;

    try {
        await client.connect();
        db = client.db("tandemlink");
        await configurarColecciones(db);
        console.log("Conectado a MongoDB (Driver Nativo) correctamente");
        return db;
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
}

export function obtenerDB() {
    if (!db) {
        throw new Error("La base de datos no está conectada.");
    }
    return db;
}

