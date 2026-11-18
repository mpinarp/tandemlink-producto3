// # Controladores REST (Fase 1: ExpressJS)

/**
 * @fileoverview Controladores de ExpressJS para gestionar los intercambios en memoria.
 * Replica las validaciones y estructura de datos definidas en el Producto 2.
 */

/* aquí traes los arrays desde memoria.js que actúan como base de datos temporal en la RAM del servidor.*/
import { intercambios, usuarios } from "../data/memoria.js";

/**
 * Obtiene todos los intercambios en memoria.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export const obtenerTodos = (req, res) => { 
    try {
        res.status(200).json(intercambios); // envía el código HTTP 200 OK junto con el array de intercambios en formato JSON
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los intercambios", detalle: error.message }); // captura cualquier error y envía un código HTTP 500 Internal Server Error con un mensaje de error
    }}

    /**
 * Crea un nuevo intercambio validando campos y usuario existente.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

// Crear un nuevo intercambio
export const crearIntercambio = (req, res) => { 
    try {
        const { tipo, email, usuarioId, idiomaOfrecido, idiomaBuscado, modalidad, descripcion, fechaCreacion } = req.body; 
        // req.body contiene el cuerpo JSON que envía el cliente (Postman) en la petición POST, y que aquí lo desestructuras para leer cada campo por separado.
        
        // validación de campos obligatorios existentes en el objeto req.body, si falta alguno, se devuelve un error 400 Bad Request con un mensaje de error.
        if(!tipo || !idiomaOfrecido || !idiomaBuscado || !modalidad || !email) {
            return res.status(400).json({ error: "Faltan campos obligatorios (tipo, email, idiomaOfrecido, idiomaBuscado, modalidad)" });
        }
        
        //Verificas si el correo (pasado a minúsculas con .toLowerCase() para evitar fallos por mayúsculas) o el ID coinciden con algún usuario registrado.
        const usuarioRegistrado = usuarios.find(u =>
        (email && u.email.toLowerCase() === email.toLowerCase()) ||
        (usuarioId && u.id === Number(usuarioId))
        );
        // Si no se encuentra un usuario registrado con el correo o ID proporcionado, se devuelve un error 400 Bad Request con un mensaje de error.
        if (!usuarioRegistrado) {
            return res.status(400).json({ error: "El correo electrónico no pertenece a ningún usuario registrado." });
        }

        // Generación de un nuevo ID único para el intercambio. Si no hay intercambios, se asigna 1; si hay, se toma el máximo ID existente y se incrementa en 1.
        const nuevoId = intercambios.length > 0
            ? Math.max(...intercambios.map(function (intercambio) { // Se utiliza una función anónima para mapear los IDs de los intercambios existentes y obtener el máximo.
                return intercambio.id;
            })) + 1 // Se incrementa el máximo ID en 1 para obtener el nuevo ID único.
            : 1;
        
        // Creación del nuevo objeto de intercambio con los datos proporcionados y el ID generado. La fecha de creación se establece en la fecha actual si no se proporciona. 
         const nuevoIntercambio = {
            id: nuevoId,
            usuarioId: usuarioRegistrado.id,
            fechaCreacion: fechaCreacion || new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
            tipo: tipo,
            idiomaOfrecido: idiomaOfrecido,
            idiomaBuscado: idiomaBuscado,
            modalidad: modalidad,
            descripcion: descripcion
        };
        intercambios.push(nuevoIntercambio); // Se agrega el nuevo intercambio al array de intercambios en memoria.
        res.status(201).json(nuevoIntercambio); // Se devuelve un código HTTP 201 Created junto con el objeto del nuevo intercambio en formato JSON.
    }catch (error) {
        res.status(500).json({ error: "Error al crear el intercambio", detalle: error.message }); // captura cualquier error y envía un código HTTP 500 Internal Server Error con un mensaje de error
        }
}

/**
 * Elimina un intercambio existente.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const eliminarIntercambio = (req, res) => {
            try {
                const id = Number(req.params.id);
                const index = intercambios.findIndex(intercambio => intercambio.id === id);
                if (index === -1) {
                    return res.status(404).json({ error: "Intercambio no encontrado" });
                }

                if (intercambios.splice(index, 1)) {
                    res.status(200).json({ message: "Intercambio eliminado correctamente" });
                }
            } catch (error) {
                res.status(500).json({ error: "Error al eliminar el intercambio", detalle: error.message });
            }
}
