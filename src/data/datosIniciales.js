
/**
 * @fileoverview Datos iniciales de TandemLink recuperados del Producto 2.
 * Contiene los usuarios y los intercambios utilizados como datos de ejemplo.
 */

/**
 * Usuarios iniciales de la aplicación.
 *
 * @type {Array<Object>}
 */
export const usuariosIniciales = [
    {
        id: 1,
        nombre: "Ana García",
        email: "ana@example.com",
        password: "ana123"
    },
    {
        id: 2,
        nombre: "Carlos López",
        email: "carlos@example.com",
        password: "carlos123"
    },
    {
        id: 3,
        nombre: "Lucía Martín",
        email: "lucia@example.com",
        password: "lucia123"
    }
];

/**
 * Intercambios iniciales de la aplicación.
 *
 * Cada intercambio contiene información sobre el tipo de publicación,
 * los idiomas, la modalidad, la descripción y su fecha de creación.
 *
 * @type {Array<Object>}
 */
export const intercambiosIniciales = [
    {
        id: 1,
        tipo: "oferta",
        usuarioId: 1,
        idiomaOfrecido: "Español",
        idiomaBuscado: "Inglés",
        modalidad: "Presencial",
        descripcion: "Quiero practicar a hablar en inglés.",
        fechaCreacion: "2026-10-10"
    },
    {
        id: 2,
        tipo: "petición",
        usuarioId: 2,
        idiomaOfrecido: "Inglés",
        idiomaBuscado: "Francés",
        modalidad: "Online",
        descripcion: "Busco practicar francés con otra persona.",
        fechaCreacion: "2026-10-14"
    },
    {
        id: 3,
        tipo: "oferta",
        usuarioId: 3,
        idiomaOfrecido: "Francés",
        idiomaBuscado: "Español",
        modalidad: "Online",
        descripcion: "Puedo ayudar con francés a cambio de español.",
        fechaCreacion: "2026-10-17"
    }
];
