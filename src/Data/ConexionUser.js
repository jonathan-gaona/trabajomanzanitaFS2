// URL base de tu API de usuarios (ajusta el puerto/ruta según corresponda)
const API_URL = 'https://bakneduserf2.onrender.com/api'; 

/**
 * @typedef {Object} CreateUser
 * @property {string} nombre
 * @property {string} [apellido]
 * @property {string} [rol]
 * @property {string} email
 * @property {string} paswword
 */

/**
 * @typedef {Object} UpdateUser
 * @property {string} nombre
 * @property {string} [apellido]
 * @property {string} [rol]
 * @property {string} email
 * @property {string} paswword
 * @property {any} historialCompras
 */

export const userApi = {
    // 1. Obtener todos los usuarios -> GET /users
    async getUsers() {
        const response = await fetch(`${API_URL}/users`);
        const json = await response.json();
        if (!json.success) throw new Error("Error al obtener usuarios");
        return json.data; // Retorna el array de dtoResponse
    },

    // 2. Obtener roles -> GET /roles
    async getRoles() {
        const response = await fetch(`${API_URL}/roles`);
        const json = await response.json();
        if (!json.succes && !json.success) throw new Error("Error al obtener roles");
        return json.data;
    },

    // 3. Obtener usuario por email -> GET /user/:email
    async getUserByEmail(email) {
        const response = await fetch(`${API_URL}/user/${email}`);
        const json = await response.json();
        if (!json.success) throw new Error(`No se encontró el usuario con email: ${email}`);
        return json.data;
    },

    // 4. Crear usuario -> POST /user
    /** @param {CreateUser} userData */
    async createUser(userData) {
        const response = await fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Error al crear usuario");
        return json.data;
    },

    // 5. Actualizar usuario -> PUT /user/Update
    /** @param {UpdateUser} userData */
    // Ejemplo dentro de tu archivo de conexión (ej. ConexionUser.js)
async updateUser(userData) {
    const response = await fetch(`${API_URL}/user/Update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    
    const json = await response.json();
    
    // Si la API responde con error, lanzamos un Error con el mensaje exacto del backend
    if (!json.success) {
        const mensajeError = json.message || (json.errors ? json.errors.join(', ') : 'Error al actualizar usuario');
        throw new Error(mensajeError);
    }
    
    return json.data;
},
    
/** @param {any} userData */
    async deleteUser(userData) {
        // Aseguramos que enviamos un objeto JSON con la estructura que el backend espera en req.body
        const bodyPayload = typeof userData === 'string' ? { email: userData } : userData;

        const response = await fetch(`${API_URL}/users/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload),
        });
        
        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Error al eliminar usuario");
        return json.data;
    },
    
    // 7. Validar login -> POST /user/login
    async login(email, paswword) {
        const response = await fetch(`${API_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, paswword }),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Credenciales inválidas");
        return json.data;
    }
};