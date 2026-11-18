
// Importamos las funciones necesarias
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Cargamos las variables de entorno
dotenv.config();

// Comprobamos las credenciales del administrador
export async function autenticarAdministrador(email, password) {
    const emailValido = email === process.env.ADMIN_EMAIL;

    if (!emailValido) {
        return null;
    }

    const passwordValida = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
    );

    if (!passwordValida) {
        return null;
    }

    // Generamos un token JWT
    return jwt.sign(
        { email, rol: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
}

// Verificamos el token JWT
export function verificarToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}