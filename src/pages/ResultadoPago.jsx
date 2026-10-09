import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import TablaProductos, { formatear } from '../components/TablaProductos'

function ResultadoPago({ onVaciarCarrito }) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [correoEnviado, setCorreoEnviado] = useState(false)

  // Si el pago fue exitoso, vaciamos el carrito. Si falló, se mantiene para reintentar.
  useEffect(() => {
    if (state?.exito) onVaciarCarrito?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Si alguien entra directo a /resultado-pago sin haber pagado, lo mandamos al carrito
  if (!state) return <Navigate to="/carrito" replace />

  const { exito, cliente, items, total, codigoOrden, nroCompra } = state

  const dato = (label, valor) => (
    <div className="mb-2">
      <div className="fw-semibold">{label}</div>
      <div>{valor || '—'}</div>
    </div>
  )

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card text-dark shadow-lg border-secondary p-4" style={{ backgroundColor: '#fce4ec' }}>
            {exito ? (
              <div className="alert alert-success">
                <h2 className="mb-1">✅ Código orden: {codigoOrden}</h2>
                <p className="mb-0 fw-semibold">Se ha realizado la compra. nro {nroCompra}</p>
              </div>
            ) : (
              <div className="alert alert-danger">
                <h2 className="mb-1">❌ No se pudo realizar el pago. nro {nroCompra}</h2>
                <p className="mb-0">Tu carrito sigue guardado, puedes intentarlo nuevamente.</p>
              </div>
            )}

            {!exito && <h3 className="mt-2">Detalle de compra</h3>}

            {exito && correoEnviado && (
              <div className="alert alert-info d-print-none">📧 Boleta enviada a {cliente.correo}</div>
            )}

            {!exito && (
              <div className="mb-4 d-print-none">
                <button
                  className="btn btn-danger fw-bold px-4 py-2"
                  onClick={() => navigate('/carrito', { state: { cliente } })}
                >
                  VOLVER A REALIZAR EL PAGO
                </button>
              </div>
            )}

            <div className="row mt-2">
              <div className="col-md-6">
                {dato('Nombre*', cliente.nombre)}
                {dato('Apellidos*', cliente.apellidos)}
                {dato('Correo*', cliente.correo)}
              </div>
              <div className="col-md-6">
                <h5 className="fw-bold">Dirección de entrega de los productos</h5>
                {dato('Calle*', cliente.calle)}
                {dato('Departamento (opcional)', cliente.departamento)}
                {dato('Región*', cliente.region)}
                {dato('Comuna*', cliente.comuna)}
                {dato('Indicaciones para la entrega (opcional)', cliente.indicaciones)}
              </div>
            </div>

            <div className="mt-3">
              <TablaProductos items={items} />
            </div>

            <h3 className="fw-bold mt-4">Total pagado: {formatear(total)}</h3>

            {exito && (
              <div className="d-flex gap-2 mt-3 d-print-none">
                <button className="btn btn-dark fw-bold" onClick={() => window.print()}>
                  Imprimir boleta en PDF
                </button>
                <button className="btn btn-outline-dark fw-bold" onClick={() => setCorreoEnviado(true)}>
                  Enviar boleta por email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultadoPago