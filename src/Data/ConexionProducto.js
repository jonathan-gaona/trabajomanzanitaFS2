// URL base de tu API desplegada en Render
// const API_URL = 'https://pruductos.onrender.com/api'; 

/**
 * @typedef {Object} CreateProduct
 * @property {string} nombre
 * @property {number} precio
 * @property {number} stock
 * @property {string} categoria
 * @property {string} cBarras
 * @property {string|null} descripcion
 * @property {string} imagen
 */

/**
 * @typedef {Object} UpdateProduct
 * @property {string} nombre
 * @property {number} precio
 * @property {number} stock
 * @property {string} categoria
 * @property {string} cBarras
 * @property {string|null} descripcion
 * @property {string} imagen
 */

/**
 * @typedef {Object} categoria
 * @property {string} nombre
 */


export const productApi = {
    // 1. Obtener todos los productos -> GET /productos
    async getProducts() {
        const response = await fetch(`${API_URL}/productos`);
        const json = await response.json();
        if (!json.success) throw new Error("Error al obtener los productos");
        return json.data;
    },

    // 2. Obtener todas las categorías -> GET /categorias
    async getCategories() {
        const response = await fetch(`${API_URL}/categorias`);
        const json = await response.json();
        if (!json.success) throw new Error("Error al obtener las categorías");
        return json.data;
    },

    // 3. Crear Producto -> POST /productos
    /** @param {CreateProduct} productData */
    async createProduct(productData) {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Error al crear el producto");
        return json.data;
    },

    // 4. Actualizar Producto -> PUT /productos
    /** @param {UpdateProduct} productData */
    async updateProduct(productData) {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Error al actualizar el producto");
        return json.data;
    },

    // 5. Eliminar Producto -> DELETE /productos
    async deleteProduct(productData) {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Error al eliminar el producto");
        return json.data;
    },

  // Crear Categoría -> POST /categorias
async createCategory(nombreCategoria) {
    const response = await fetch(`${API_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviar 'cnombre' tal como lo exige el DTO 'categoriaC_U' del backend
        body: JSON.stringify({ cnombre: nombreCategoria }),
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Error al crear la categoría");
    return json.data;
},

// Eliminar Categoría -> DELETE /categorias
async deleteCategory(nombreCategoria) {
    const response = await fetch(`${API_URL}/categorias`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnombre: nombreCategoria }),
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Error al eliminar la categoría");
    return json.data;
},

// Actualizar Categoría -> PUT /categorias/:anterior
async updateCategory(nombreAnterior, nuevoNombre) {
    const response = await fetch(`${API_URL}/categorias/${encodeURIComponent(nombreAnterior)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnombre: nuevoNombre }),
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Error al actualizar la categoría");
    return json.data;
},
// Actualizar stock tras compra usando el método PUT general de tu API
  async actualizarStockDespuesDeCompra(itemsCarrito) {
    try {
      for (const item of itemsCarrito) {
        const stockActual = Number(item.stock) || 0
        const cantidadComprada = Number(item.cantidad) || 0
        const nuevoStock = Math.max(0, stockActual - cantidadComprada)

        // Preparamos el objeto completo tal como lo exige tu DTO y la función updateProduct
        const productoActualizado = {
          nombre: item.nombre,
          precio: Number(item.precio),
          stock: nuevoStock,
          categoria: item.categoria,
          cBarras: item.cBarras || item.Cbarras || item.codigoBarras,
          descripcion: item.descripcion || '',
          imagen: item.imagen || item.imagenPath || ''
        }

        // Llamamos a tu función updateProduct existente
        await this.updateProduct(productoActualizado)
      }
      return true
    } catch (error) {
      console.error('Error al actualizar el stock tras la compra:', error)
      return false
    }
  }
}