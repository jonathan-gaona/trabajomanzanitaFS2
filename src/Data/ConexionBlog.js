
// ConexionBlog.js - Conexión con la API del Backend para Noticias y Blog

const API_URL = 'https://bog-cqqu.onrender.com/api/noticias' // O tu URL base completa (ej: 'http://localhost:3000/api/noticias')

export const noticiaApi = {
  // Obtener todas las noticias
  getNoticias: async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      // Dependiendo de si tu backend devuelve un arreglo directo o un objeto con propiedad data
      return Array.isArray(data) ? data : (data.data || [])
    } catch (error) {
      console.error('Error al obtener noticias:', error)
      return []
    }
  },

  // Obtener una noticia específica por su slug
  getNoticiaBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_URL}/slug/${slug}`)
      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error(`Error al obtener la noticia con slug ${slug}:`, error)
      return null
    }
  },

  // Crear una nueva noticia (POST)
  createNoticia: async (payloadDTO) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadDTO)
      })

      const resultado = await response.json()
      if (!response.ok) {
        throw new Error(resultado.message || 'Error al crear la noticia')
      }
      return resultado
    } catch (error) {
      console.error('Error en createNoticia:', error)
      throw error
    }
  },

  // Actualizar una noticia usando el slug como identificador principal
  updateNoticia: async (slug, payloadDTO) => {
    try {
      const response = await fetch(`${API_URL}/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadDTO)
      })

      const resultado = await response.json()
      if (!response.ok) {
        throw new Error(resultado.message || 'Error al actualizar la noticia')
      }
      return resultado
    } catch (error) {
      console.error(`Error en updateNoticia para el slug ${slug}:`, error)
      throw error
    }
  },

  // Eliminar una noticia usando el slug como identificador principal
  deleteNoticia: async (slug) => {
    try {
      const response = await fetch(`${API_URL}/${slug}`, {
        method: 'DELETE'
      })

      const resultado = await response.json()
      if (!response.ok) {
        throw new Error(resultado.message || 'Error al eliminar la noticia')
      }
      return resultado
    } catch (error) {
      console.error(`Error en deleteNoticia para el slug ${slug}:`, error)
      throw error
    }
  }
}