import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import TablaProductos, { formatear } from '../components/TablaProductos'
import { productApi } from '../Data/ConexionProducto'
import { documentoApi } from '../Data/ConexionBoletas'

function ResultadoPago({ onVaciarCarrito, usuarioLogueado }) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [correoEnviado, setCorreoEnviado] = useState(false)

  if (!state) return <Navigate to="/carrito" replace />

  const { cliente, tarjeta, items, total, codigoOrden, nroCompra } = state

  const tarjetaVacia = !tarjeta || (
    !tarjeta.numeroTarjeta.trim() &&
    !tarjeta.nombreTitular.trim() &&
    !tarjeta.rut.trim() &&
    !tarjeta.expiracion.trim() &&
    !tarjeta.cvv.trim()
  )

  const exito = !tarjetaVacia

  useEffect(() => {
    if (exito && items) {
      onVaciarCarrito?.()
      // 1. Actualizamos el stock en la base de datos
      productApi.actualizarStockDespuesDeCompra(items)

      // 2. Preparamos el DTO exacto que pide tu backend (Documento / Producto)
      const productosFormateados = items.map(item => ({
        nombre: item.nombre || 'Sin nombre',
        categoria: item.categoria || 'General',
        codigoB: item.cBarras || item.Cbarras || item.codigoBarras || 'N/A',
        cantidad: Number(item.cantidad) || 1,
        precioU: Number(item.precio) || 0
      }))

      // Verificamos si el usuario está logueado o no para asignarlo a observaciones/estado
      const estadoSesionUsuario = usuarioLogueado ? `Logueado como: ${usuarioLogueado.email || usuarioLogueado.correo}` : 'No logueado'

      const documentoDTO = {
        tipo: 'boleta', // O 'pedido' según prefieras registrar
        productos: productosFormateados,
        total: Number(total) || 0,
        despachado: false,
        // Como es MongoDB y el DTO principal admite flexibilidad, guardamos datos adicionales del cliente y sesión aquí:
        observaciones: `Cliente: ${cliente.nombre} ${cliente.apellidos || ''} (${cliente.correo}) | Sesión: ${estadoSesionUsuario} | Orden: ${codigoOrden} | Compra: ${nroCompra}`
      }

      documentoApi.crearDocumento(documentoDTO).catch(err => {
        console.error('Error al guardar la boleta en MongoDB:', err)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                <p className="mb-0 fw-semibold">Se ha realizado la compra con éxito. nro {nroCompra}</p>
              </div>
            ) : (
              <div className="alert alert-danger">
                <h2 className="mb-1">❌ No se pudo realizar el pago. nro {nroCompra}</h2>
                <p className="mb-0">Los datos de la tarjeta estaban vacíos. Tu carrito sigue guardado, puedes intentarlo nuevamente.</p>
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
                {dato('Apellidos', cliente.apellidos)}
                {dato('Correo*', cliente.correo)}
                <div className="mb-2">
                  <div className="fw-semibold">Estado de Sesión</div>
                  <div>{usuarioLogueado ? 'Usuario Logueado' : 'No logueado'}</div>
                </div>
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

            <h3 className="fw-bold mt-4">{exito ? 'Total pagado:' : 'Total a pagar:'} {formatear(total)}</h3>

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