// URL base de tu API (puedes ajustar el puerto o dominio si es diferente)
const API_URL = 'https://boleta-pedido.onrender.com/api'; // O la URL base de tu backend


export const documentoApi = {
    // Crear Documento (Boleta o Pedido) -> POST /documento
    async crearDocumento(documentoData) {
        const response = await fetch(`${API_URL}/documento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(documentoData),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Error al crear el documento");
        return json.data;
    },

    // Obtener Documento por ID -> GET /documento/:id
    async obtenerDocumento(id) {
        const response = await fetch(`${API_URL}/documento/${id}`);
        const json = await response.json();
        if (!json.success) throw new Error("Error al obtener el documento");
        return json.data;
    },

    // Listar Documentos -> GET /documento?tipo=...
    async listarDocumentos(tipo = '') {
        const url = tipo ? `${API_URL}/documento?tipo=${tipo}` : `${API_URL}/documento`;
        const response = await fetch(url);
        const json = await response.json();
        if (!json.success) throw new Error("Error al listar los documentos");
        return json.data;
    },

    // Obtener pedidos pendientes -> GET /documentos/pendientes
    async obtenerPendientes() {
        const response = await fetch(`${API_URL}/documentos/pendientes`);
        const json = await response.json();
        if (!json.success) throw new Error("Error al obtener pedidos pendientes");
        return json.data;
    },

    // Despachar pedido -> PATCH /documento/:id/despachar
    async despacharPedido(id) {
        const response = await fetch(`${API_URL}/documento/${id}/despachar`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
        if (!json.success) throw new Error("Error al despachar el pedido");
        return json.data;
    }
};