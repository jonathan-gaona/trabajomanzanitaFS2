import { useState } from 'react'
import { Link } from 'react-router-dom'
import Contador from './Contador'

function Card({ productos, onAgregarAlCarro }) {
  const [cantidades, setCantidades] = useState({})

  const getCantidad = (id) => cantidades[id] || 1

  const setCantidad = (id, valor) => {
    setCantidades((prev) => ({ ...prev, [id]: valor }))
  }

  return (
    <div className="row">
      {productos.map((producto) => (
        <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center" key={producto.id}>
          <div className="card border-secondary shadow-sm w-100" style={{ maxWidth: '22rem', backgroundColor: '#fce4ec' }}>
            <img
              src={producto.imagen}
              className="card-img-top border-bottom border-secondary"
              alt={producto.nombre}
              style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="fw-bold">{producto.nombre}</h5>
              <p>{producto.descripcion}</p>
              <p className="fw-bold fs-5" style={{ color: '#5d4037' }}>
                ${producto.precio.toLocaleString('es-CL')}
              </p>

              <div className="mb-2">
                <Contador
                  cantidad={getCantidad(producto.id)}
                  onCambiar={(nueva) => setCantidad(producto.id, nueva)}
                />
              </div>

              <div className="mt-auto d-flex flex-column gap-2">
                <Link
                  to={`/producto/${producto.id}`}
                  className="btn w-100 fw-bold py-2 btn-outline-dark"
                  style={{ borderColor: '#5d4037', color: '#5d4037' }}
                >
                  Ver detalles
                </Link>

                <button
                  onClick={() => onAgregarAlCarro(producto, getCantidad(producto.id))}
                  className="btn w-100 text-white fw-bold py-2"
                  style={{ backgroundColor: '#5d4037', border: '1px solid #fce4ec' }}
                >
                  Comprar / Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Card