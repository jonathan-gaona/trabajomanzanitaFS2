import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TablaProductos, { formatear } from '../components/TablaProductos'

const REGIONES = {
  'Región Metropolitana de Santiago': ['Cerrillos', 'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'Puente Alto'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
  'Región del Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán'],
}

const generarCodigoOrden = () => `ORDER${Math.floor(10000 + Math.random() * 90000)}`

const generarNroCompra = () => {
  const hoy = new Date()
  const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`
  return `#${fecha}${Math.floor(100 + Math.random() * 900)}`
}

function Carrito({ carrito = [], onEliminarDelCarro, usuarioLogueado }) {
  const navigate = useNavigate()

  const [cliente, setCliente] = useState({
    nombre: usuarioLogueado?.nombre || '',
    apellidos: usuarioLogueado?.apellidos || '',
    correo: usuarioLogueado?.email || usuarioLogueado?.correo || '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: '',
  })

  const [tarjetaForm, setTarjetaForm] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    expiracion: '',
    cvv: '',
    rut: '',
  })

  const [errorForm, setErrorForm] = useState('')
  const [procesando, setProcesando] = useState(false)

  const totalPagar = carrito.reduce((total, p) => total + p.precio * p.cantidad, 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCliente((prev) => {
      const nuevo = { ...prev, [name]: value }
      if (name === 'region') nuevo.comuna = REGIONES[value][0]
      return nuevo
    })
  }

  const handleTarjetaChange = (e) => {
    const { name, value } = e.target
    setTarjetaForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePagar = (e) => {
    e.preventDefault()
    setErrorForm('')

    // Validación de stock
    const productoSinStock = carrito.find(p => (Number(p.stock) || 0) <= 0 || (Number(p.cantidad) > Number(p.stock)))
    if (productoSinStock) {
      setErrorForm(`❌ Error de inventario: El producto "${productoSinStock.nombre}" no tiene stock suficiente.`)
      return
    }

    // Validación básica de datos del cliente
    if (!cliente.nombre.trim() || !cliente.correo.trim() || !cliente.calle.trim()) {
      setErrorForm('Por favor completa los campos obligatorios del cliente y la dirección.')
      return
    }

    setProcesando(true)

    setTimeout(() => {
      // Enviamos todo a ResultadoPago, incluyendo los datos de la tarjeta para que allá se evalúe el éxito/error
      navigate('/resultado-pago', {
        state: {
          cliente,
          tarjeta: tarjetaForm,
          items: carrito,
          total: totalPagar,
          codigoOrden: generarCodigoOrden(),
          nroCompra: generarNroCompra(),
        },
      })
      setProcesando(false)
    }, 800)
  }

  const campo = (name, label, { requerido = false, placeholder = '', type = 'text' } = {}) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {label}
        {requerido && '*'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={cliente[name]}
        onChange={handleChange}
      />
    </div>
  )

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card text-dark shadow-lg border-secondary p-4" style={{ backgroundColor: '#fce4ec' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
              <div>
                <h1>🛒 Carrito de compra y Pago</h1>
                {carrito.length > 0 && <h4 className="fw-bold">Total a pagar: {formatear(totalPagar)}</h4>}
              </div>
              <Link to="/ventas" className="btn btn-sm fw-bold text-dark border border-dark" style={{ backgroundColor: '#bde0fe' }}>
                ← Volver a Productos
              </Link>
            </div>

            {errorForm && (
              <div className="alert alert-danger fw-bold my-3" role="alert">
                {errorForm}
              </div>
            )}

            {carrito.length === 0 ? (
              <div className="text-center py-5">
                <p>Tu carrito está vacío.</p>
                <Link to="/ventas" className="btn btn-dark fw-bold mt-2">
                  Ir a comprar productos
                </Link>
              </div>
            ) : (
              <>
                <p className="text-muted">Revisa tus productos y completa la información de entrega y pago</p>
                <TablaProductos items={carrito} onEliminar={onEliminarDelCarro} />

                <form onSubmit={handlePagar} className="mt-4">
                  <h3 className="border-top border-secondary pt-4" style={{ color: '#5d4037' }}>Información del cliente</h3>
                  <div className="row">
                    <div className="col-md-4">{campo('nombre', 'Nombre', { requerido: true })}</div>
                    <div className="col-md-4">{campo('apellidos', 'Apellidos (opcional)')}</div>
                    <div className="col-md-4">{campo('correo', 'Correo', { requerido: true, type: 'email' })}</div>
                  </div>

                  <h3 className="mt-3" style={{ color: '#5d4037' }}>Dirección de entrega</h3>
                  <div className="row">
                    <div className="col-md-8">{campo('calle', 'Calle', { requerido: true })}</div>
                    <div className="col-md-4">{campo('departamento', 'Departamento (opcional)', { placeholder: 'Ej: 603' })}</div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="region" className="form-label fw-semibold">Región*</label>
                      <select id="region" name="region" className="form-select" value={cliente.region} onChange={handleChange}>
                        {Object.keys(REGIONES).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="comuna" className="form-label fw-semibold">Comuna*</label>
                      <select id="comuna" name="comuna" className="form-select" value={cliente.comuna} onChange={handleChange}>
                        {REGIONES[cliente.region].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="indicaciones" className="form-label fw-semibold">Indicaciones (opcional)</label>
                    <textarea
                      id="indicaciones"
                      name="indicaciones"
                      rows="3"
                      className="form-control"
                      value={cliente.indicaciones}
                      onChange={handleChange}
                    />
                  </div>

                  {/* TARJETA (SI SE DEJA VACÍA, RESULTADO DE PAGO DARÁ ERROR 100%) */}
                  <div className="card mt-4 p-3 border-secondary bg-white">
                    <h3 className="fw-bold mb-3 fs-5" style={{ color: '#5d4037' }}>Medio de Pago: Tarjeta Débito / Crédito</h3>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Número de Tarjeta</label>
                        <input
                          type="text"
                          name="numeroTarjeta"
                          className="form-control border-secondary"
                          value={tarjetaForm.numeroTarjeta}
                          onChange={handleTarjetaChange}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Nombre del Titular</label>
                        <input
                          type="text"
                          name="nombreTitular"
                          className="form-control border-secondary"
                          value={tarjetaForm.nombreTitular}
                          onChange={handleTarjetaChange}
                          placeholder="Como figura en la tarjeta"
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="form-label small fw-bold">RUN / RUT del Titular</label>
                        <input
                          type="text"
                          name="rut"
                          className="form-control border-secondary"
                          value={tarjetaForm.rut}
                          onChange={handleTarjetaChange}
                          placeholder="12.345.678-K"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label small fw-bold">Fecha Expiración</label>
                        <input
                          type="text"
                          name="expiracion"
                          className="form-control border-secondary"
                          value={tarjetaForm.expiracion}
                          onChange={handleTarjetaChange}
                          placeholder="MM/AA"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label small fw-bold">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          className="form-control border-secondary"
                          value={tarjetaForm.cvv}
                          onChange={handleTarjetaChange}
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button type="submit" className="btn btn-danger fw-bold px-5 py-2" disabled={procesando}>
                      {procesando ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Procesando...
                        </>
                      ) : (
                        `Pagar ahora ${formatear(totalPagar)}`
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito