import { useState } from 'react'
import { Link } from 'react-router-dom'
import Contador from './Contador'

function Card({ productos, onAgregarAlCarro }) {
  const [cantidades, setCantidades] = useState({})

  const getCantidad = (key) => cantidades[key] || 1

  const setCantidad = (key, valor) => {
    setCantidades((prev) => ({ ...prev, [key]: valor }))
  }

  if (!productos || productos.length === 0) {
    return <div className="text-center py-4 text-muted">No hay productos disponibles.</div>
  }

  return (
    <div className="row">
      {productos.map((producto, index) => {
        const nombreProducto = producto.nombre || 'Sin nombre'
        const keyUnica = producto.cBarras || producto.Cbarras || producto.codigoBarras || producto.id || nombreProducto || index
        const imgPath = producto.imagen || producto.imagenPath || 'https://via.placeholder.com/300'
        const precioVal = Number(producto.precio) || 0
        const stockVal = Number(producto.stock) || 0

        // Oferta aplicada automáticamente si el stock es mayor a 10
        const tieneOferta = stockVal > 10
        const precioOferta = tieneOferta ? Math.round(precioVal * 0.9) : precioVal

        return (
          <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center" key={keyUnica}>
            <div className="card border-secondary shadow-sm w-100 position-relative" style={{ maxWidth: '22rem', backgroundColor: '#fce4ec' }}>
              
              {/* Insignia visual automática para el usuario final */}
              {tieneOferta && (
                <span className="position-absolute top-0 start-0 bg-danger text-white fw-bold px-3 py-1 rounded-end shadow-sm" style={{ zIndex: 1, fontSize: '0.85rem' }}>
                  🔥 10% OFF AUTOMÁTICO
                </span>
              )}

              <img
                src={imgPath}
                className="card-img-top border-bottom border-secondary"
                alt={nombreProducto}
                style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold">{nombreProducto}</h5>
                <p>{producto.descripcion || 'Pieza coleccionable de alta calidad.'}</p>

                {/* Precios: Muestra el precio tachado y el descuento de forma limpia */}
                <div className="mb-2">
                  {tieneOferta ? (
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-decoration-line-through text-muted fs-6">
                        ${precioVal.toLocaleString('es-CL')}
                      </span>
                      <span className="fw-bold fs-4 text-danger">
                        ${precioOferta.toLocaleString('es-CL')}
                      </span>
                    </div>
                  ) : (
                    <p className="fw-bold fs-5 mb-0" style={{ color: '#5d4037' }}>
                      ${precioVal.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>

                <p className="small text-muted mb-3">Stock disponible: {producto.stock ?? 'N/A'}</p>

                <div className="mb-2">
                  <Contador
                    cantidad={getCantidad(keyUnica)}
                    onCambiar={(nueva) => setCantidad(keyUnica, nueva)}
                  />
                </div>

                <div className="mt-auto d-flex flex-column gap-2">
                  <Link
                    to={`/producto/${encodeURIComponent(nombreProducto)}`} 
                    className="btn btn-outline-dark fw-bold w-100"
                    style={{ borderColor: '#5d4037', color: '#5d4037' }}
                  >
                    Ver detalles
                  </Link>

                  <button
                    onClick={() => {
                      // Envía el producto con el precio de oferta aplicado automáticamente
                      const productoAAgregar = { ...producto, precio: precioOferta }
                      onAgregarAlCarro(productoAAgregar, getCantidad(keyUnica))
                    }}
                    className="btn w-100 text-white fw-bold py-2"
                    style={{ backgroundColor: '#5d4037', border: '1px solid #fce4ec' }}
                  >
                    Comprar / Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Card