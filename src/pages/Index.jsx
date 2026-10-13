import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/cartas.jsx'
import Hero from '../components/Hero.jsx'
// Importamos la conexión de productos
import { productApi } from '../Data/ConexionProducto.js'

function Index({ onAgregarAlCarro }) {
  const navigate = useNavigate()
  const [productosDestacados, setProductosDestacados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        setLoading(true)
        const datos = await productApi.getProducts()
        setProductosDestacados(datos || [])
      } catch (error) {
        console.error('Error al cargar productos destacados:', error)
        setProductosDestacados([])
      } finally {
        setLoading(false)
      }
    }

    cargarDestacados()
  }, [])

  return (
    <div className="container py-4">
      <Hero />

      <h3 className="mb-4">✦·͙⁺̩-̩̩-̩v-̩̩-̩⁺-̩͙·✦ Nuestros Productos</h3>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando destacados...</span>
          </div>
        </div>
      ) : (
        <Card productos={productosDestacados.slice(0, 3)} onAgregarAlCarro={onAgregarAlCarro} />
      )}
    </div>
  )
}

export default Index