import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Contador from '../components/Contador'
import { productApi } from '../Data/ConexionProducto'

function DetalleProducto({ onAgregarAlCarro }) {
  // El parámetro de la URL ahora es el nombre del producto
  const { id } = useParams() // Nota: Aunque se llame 'id' en el router, ahora contiene el nombre
  
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    const buscarProductoPorNombre = async () => {
      try {
        setLoading(true)
        // 1. Obtenemos todos los productos desde la API
        const listaProductos = await productApi.getProducts() || []
        
        // 2. Decodificamos el nombre que viene por la URL
        const nombreBusqueda = decodeURIComponent(id || '').trim().toLowerCase()

        // 3. Buscamos el producto haciendo match exacto con el nombre
        const encontrado = listaProductos.find(p => {
          const nombreProd = (p.nombre || '').trim().toLowerCase()
          return nombreProd === nombreBusqueda
        })

        setProducto(encontrado || null)
      } catch (error) {
        console.error('Error al buscar el detalle del producto:', error)
      } finally {
        setLoading(false)
      }
    }

    buscarProductoPorNombre()
  }, [id])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando detalle...</span>
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger fw-bold">Producto no encontrado</h3>
        <Link to="/Ventas" className="btn mt-3 text-white fw-bold" style={{ backgroundColor: '#5d4037' }}>
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const handleAgregarCantidad = () => {
    onAgregarAlCarro(producto, cantidad)
    alert(`¡Se han añadido ${cantidad} unidad(es) al carrito!`)
  }

  const imagenSrc = producto.imagen || producto.imagenPath || 'https://via.placeholder.com/400'

  return (
    <div className="container py-5">
      {/* Migas de pan */}
      <nav className="mb-4 small">
        <Link to="/" className="text-decoration-none text-muted">Home</Link> / 
        <Link to="/Ventas" className="text-decoration-none text-muted"> Catálogo</Link> / 
        <span className="text-dark fw-bold"> {producto.nombre}</span>
      </nav>

      <div className="row g-5 align-items-center">
        <div className="col-12 col-lg-6">
          <div className="card border-secondary shadow-sm mb-3" style={{ backgroundColor: '#fce4ec' }}>
            <img 
              src={imagenSrc} 
              alt={producto.nombre} 
              className="img-fluid rounded border-bottom border-secondary" 
              style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <h2 className="fw-bold mb-2 text-dark">{producto.nombre}</h2>
          <h3 className="fw-bold mb-4 fs-3" style={{ color: '#5d4037' }}>
            ${Number(producto.precio).toLocaleString('es-CL')}
          </h3>

          <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
            {producto.descripcion || 'Pieza coleccionable de alta calidad, perfecta para exhibición y fanáticos del anime.'}
          </p>

          <hr className="border-secondary mb-4" />

          <div className="mb-4">
            <label className="form-label fw-bold text-dark small d-block">Cantidad</label>
            <Contador cantidad={cantidad} onCambiar={setCantidad} />
          </div>

          <button 
            onClick={handleAgregarCantidad}
            className="btn text-white w-100 py-3 fw-bold shadow-sm"
            style={{ backgroundColor: '#5d4037', border: '1px solid #fce4ec' }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto