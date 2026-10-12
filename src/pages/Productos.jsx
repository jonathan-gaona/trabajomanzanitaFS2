import { useState, useEffect } from 'react'
import Card from '../components/cartas'
import { Link } from 'react-router-dom'
import { productApi } from '../Data/ConexionProducto'

function Productos({ onAgregarAlCarro, carrito }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoading(true)
        const datos = await productApi.getProducts()
        setProductos(datos || [])
      } catch (error) {
        console.error('Error al obtener productos:', error)
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    obtenerProductos()
  }, [])

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Catálogo de Productos</h1>
          <p>Explora y añade tus coleccionables favoritos. ꒰ঌ(˶ˆᗜˆ˵)໒꒱ .ᐟ.ᐟ</p>
        </div>
      </div>

      <hr className="border-secondary mb-4" />

      {/* Si está cargando mostramos un indicador, de lo contrario renderizamos las cartas */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </div>
        </div>
      ) : (
        <Card productos={productos} onAgregarAlCarro={onAgregarAlCarro} />
      )}
    </div>
  )
}

export default Productos