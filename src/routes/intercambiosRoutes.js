// # Rutas REST de Express

/**
 * @fileoverview Rutas de ExpressJS para gestionar los intercambios en memoria.
 * Replica las validaciones y estructura de datos definidas en el Producto 2.
 */
import {Router} from "express";
import { obtenerTodos, crearIntercambio, eliminarIntercambio} from "../controllers/intercambiosController.js";

const router = Router();

// Ruta para obtener todos los intercambios
// Cuando se hace una petición GET a /intercambios, se llama al controlador obtenerTodos para devolver todos los intercambios en memoria.
router.get("/intercambios", obtenerTodos); 

// Ruta para crear un nuevo intercambio
// Cuando se hace una petición POST a /intercambios, se llama al controlador crearIntercambio para crear un nuevo intercambio en memoria.
router.post("/intercambios", crearIntercambio);

// Ruta para eliminar un intercambio
// Cuando se hace una petición DELETE a /intercambios/:id, se llama al controlador eliminarIntercambio para eliminar un intercambio específico en memoria.
router.delete("/intercambios/:id", eliminarIntercambio);

// Exporta el router para que pueda ser utilizado en otros archivos, como el archivo principal de la aplicación (por ejemplo, app.js o index.js).
export default router;
