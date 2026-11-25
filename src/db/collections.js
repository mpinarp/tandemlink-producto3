import { db } from "./mongo.js";

export const usuariosCollection = db.collection("usuarios");
export const intercambiosCollection = db.collection("intercambios");
