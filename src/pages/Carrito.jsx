import { Link } from 'react-router-dom'

function Carrito({ carrito = [], onEliminarDelCarro }) {
  const totalPagar = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0)

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card text-dark shadow-lg border-secondary p-4" style={{ backgroundColor: '#fce4ec' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
              <div>
                <h1>🛒 Tu Carrito de Compras</h1>
                <p>Artículos agregados desde el catálogo.</p>
              </div>
              
              {/* CAMBIO AQUÍ: Botón celeste pastel suave (#bde0fe) con letras negras */}
              <Link 
                to="/ventas" 
                className="btn btn-sm fw-bold text-dark border border-dark" 
                style={{ backgroundColor: '#bde0fe' }}
              >
                ← Volver a Productos
              </Link>
            </div>

            {carrito.length === 0 ? (
              <div className="text-center py-5">
                <p>Tu carrito está vacío.</p>
                <Link to="/ventas" className="btn btn-dark fw-bold mt-2">
                  Ir a comprar productos
                </Link>
              </div>
            ) : (
              <div>
                <ul className="list-group list-group-flush mb-4 bg-transparent">
                  {carrito.map((item, index) => (
                    <li key={`${item.id}-${index}`} className="list-group-item bg-transparent text-dark border-secondary d-flex justify-content-between align-items-center py-3">
                      <div>
                        <h5 className="mb-1 fw-bold">{item.nombre}</h5>
                        <small className="text-dark-50 fw-semibold">ID: {item.id}</small>
                        <div className="mt-1">Cantidad: {item.cantidad}</div>
                        <div className="fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</div>
                      </div>
                      <button 
                        onClick={() => onEliminarDelCarro(index)}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-top border-secondary pt-4 d-flex justify-content-between align-items-center">
                  <h3 className="fw-bold">Total: ${totalPagar.toLocaleString('es-CL')}</h3>
                  <button 
                    onClick={() => alert('¡Compra procesada con éxito!')}
                    className="btn btn-dark fw-bold px-4 py-2"
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito