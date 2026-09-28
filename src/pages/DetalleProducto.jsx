import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import productosJson from '../Data/productos.json'
import Contador from '../components/Contador'

function DetalleProducto({ onAgregarAlCarro }) {
  const { id } = useParams()
  const [cantidad, setCantidad] = useState(1)

  // Buscamos el producto utilizando el id de la URL
  const producto = productosJson.find(p => p.id === Number(id))

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

  return (
    <div className="container py-5">
      {/* Migas de pan / Navegación rápida */}
      <nav className="mb-4 small">
        <Link to="/" className="text-decoration-none text-muted">Home</Link> / 
        <Link to="/Ventas" className="text-decoration-none text-muted"> Catálogo</Link> / 
        <span className="text-dark fw-bold"> {producto.nombre}</span>
      </nav>

      <div className="row g-5 align-items-center">
        {/* Imagen principal y galería simulada */}
        <div className="col-12 col-lg-6">
          <div className="card border-secondary shadow-sm mb-3" style={{ backgroundColor: '#fce4ec' }}>
            <img 
              src={producto.imagen} 
              alt={producto.nombre} 
              className="img-fluid rounded border-bottom border-secondary" 
              style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="d-flex gap-2">
            <div className="border border-secondary p-1 rounded bg-white" style={{ width: '70px', height: '70px' }}>
              <img src={producto.imagen} alt="thumb" className="w-100 h-100 object-fit-cover rounded" />
            </div>
          </div>
        </div>

        {/* Detalles, precio y selector */}
        <div className="col-12 col-lg-6">
          <h2 className="fw-bold mb-2 text-dark">{producto.nombre}</h2>
          <h3 className="fw-bold mb-4 fs-3" style={{ color: '#5d4037' }}>
            ${producto.precio.toLocaleString('es-CL')}
          </h3>

          <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
            {producto.descripcion}. Pieza coleccionable de alta calidad, perfecta para exhibición y fanáticos del anime.
          </p>

          <hr className="border-secondary mb-4" />

          {/* Selector de cantidad */}
          <div className="mb-4">
            <label className="form-label fw-bold text-dark small d-block">Cantidad</label>
            <Contador
              cantidad={cantidad}
              onCambiar={setCantidad}
            />
          </div>

          {/* Botón de compra detallada */}
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