import { useEffect, useState, useRef } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import TablaProductos, { formatear } from '../components/TablaProductos'
import { productApi } from '../Data/ConexionProducto'
import { documentoApi } from '../Data/ConexionBoletas'
import { userApi } from '../Data/ConexionUser'

function ResultadoPago({ onVaciarCarrito, usuarioLogueado }) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [correoEnviado, setCorreoEnviado] = useState(false)
  const [ticketGenerado, setTicketGenerado] = useState('')
  
  // Ref para asegurar que la compra se procese una sola vez
  const procesadoRef = useRef(false)

  // Si no hay state (porque recargaron la página), los mandamos directo al Index o al carrito
  if (!state) {
    return <Navigate to="/" replace />
  }

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
    const procesarCompraExitosa = async () => {
      if (exito && items && !procesadoRef.current) {
        procesadoRef.current = true
        onVaciarCarrito?.()
        
        try {
          // 1. Actualizamos el stock en la base de datos de productos
          await productApi.actualizarStockDespuesDeCompra(items)

          // 2. Preparamos el DTO exacto para la boleta (MongoDB)
          const productosFormateados = items.map(item => ({
            nombre: item.nombre || 'Sin nombre',
            categoria: item.categoria || 'General',
            codigoB: item.cBarras || item.Cbarras || item.codigoBarras || 'N/A',
            cantidad: Number(item.cantidad) || 1,
            precioU: Number(item.precio) || 0
          }))

          const documentoDTO = {
            tipo: 'boleta',
            productos: productosFormateados,
            total: Number(total) || 0
          }

          // 3. Guardamos la boleta en MongoDB
          const respuestaDoc = await documentoApi.crearDocumento(documentoDTO)

          if (respuestaDoc) {
            const idTicketReal = respuestaDoc.tikect || respuestaDoc.ticket || respuestaDoc._id || codigoOrden
            setTicketGenerado(idTicketReal)

            // 4. Obtenemos el usuario activo (prop o respaldo de localStorage)
            let usuarioActivo = usuarioLogueado
            if (!usuarioActivo) {
              const guardado = localStorage.getItem('usuarioLogueado')
              if (guardado) {
                try { usuarioActivo = JSON.parse(guardado) } catch (e) { /* ignore */ }
              }
            }

            const emailUsuario = usuarioActivo?.email || usuarioActivo?.correo

            if (usuarioActivo && emailUsuario) {
              await userApi.agregarHistorialCompra(emailUsuario, idTicketReal)
            }
          }
        } catch (err) {
          console.error('❌ ERROR CRÍTICO CAPTURADO EN EL PROCESO DE PAGO:', err)
          setTicketGenerado(codigoOrden)
        }
      }
    }

    procesarCompraExitosa()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dato = (label, valor) => (
    <div className="mb-2">
      <div className="fw-semibold">{label}</div>
      <div>{valor || '—'}</div>
    </div>
  )

  let usuarioEnPantalla = usuarioLogueado
  if (!usuarioEnPantalla) {
    try {
      const g = localStorage.getItem('usuarioLogueado')
      if (g) usuarioEnPantalla = JSON.parse(g)
    } catch (e) { /* ignore */ }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card text-dark shadow-lg border-secondary p-4" style={{ backgroundColor: '#fce4ec' }}>
            {exito ? (
              <div className="alert alert-success">
                <h2 className="mb-1">✅ Ticket / N° Orden: {ticketGenerado || 'Generando...'}</h2>
                <p className="mb-0 fw-semibold">Se ha realizado la compra con éxito. N° {nroCompra}</p>
              </div>
            ) : (
              <div className="alert alert-danger">
                <h2 className="mb-1">❌ No se pudo realizar el pago. N° {nroCompra}</h2>
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
                  <div>
                    {usuarioEnPantalla 
                      ? `Logueado como: ${usuarioEnPantalla.nombre || ''} (${usuarioEnPantalla.email || usuarioEnPantalla.correo})` 
                      : 'No logueado'}
                  </div>
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
                {/* Botón opcional para salir de la pasarela de pago de forma segura */}
                <button className="btn btn-primary fw-bold ms-auto" onClick={() => navigate('/')}>
                  Volver al Inicio
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