import { useState } from 'react'
import { Link } from 'react-router-dom'
import Contador from './Contador'

function Card({ productos, onAgregarAlCarro }) {
  const [cantidades, setCantidades] = useState({})

  // Usamos el nombre del producto o índice como clave segura para el contador, ya que la API no entrega ID numérico
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
        const keyUnica = producto.cBarras || producto.Cbarras || producto.codigoBarras || nombreProducto || index
        const imgPath = producto.imagen || producto.imagenPath || 'https://via.placeholder.com/300'
        const precioVal = Number(producto.precio) || 0

        return (
          <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center" key={keyUnica}>
            <div className="card border-secondary shadow-sm w-100" style={{ maxWidth: '22rem', backgroundColor: '#fce4ec' }}>
              <img
                src={imgPath}
                className="card-img-top border-bottom border-secondary"
                alt={nombreProducto}
                style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold">{nombreProducto}</h5>
                <p>{producto.descripcion || 'Pieza coleccionable de alta calidad.'}</p>
                <p className="fw-bold fs-5" style={{ color: '#5d4037' }}>
                  ${precioVal.toLocaleString('es-CL')}
                </p>

                <div className="mb-2">
                  <Contador
                    cantidad={getCantidad(nombreProducto)}
                    onCambiar={(nueva) => setCantidad(nombreProducto, nueva)}
                  />
                </div>

                <div className="mt-auto d-flex flex-column gap-2">
                  {/* Corregido: Usamos producto.nombre en lugar de prod.nombre */}
                  <Link
                    to={`/producto/${encodeURIComponent(nombreProducto)}`} 
                    className="btn btn-outline-dark fw-bold w-100"
                    style={{ borderColor: '#5d4037', color: '#5d4037' }}
                  >
                    Ver detalles
                  </Link>

                  <button
                    onClick={() => onAgregarAlCarro(producto, getCantidad(nombreProducto))}
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