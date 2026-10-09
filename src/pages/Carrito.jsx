import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import TablaProductos, { formatear } from '../components/TablaProductos'

// Probabilidad de que el pago simulado sea exitoso.
// Para la demo: 1 = siempre éxito, 0 = siempre error.
const PROBABILIDAD_EXITO = 0.7

const REGIONES = {
  'Región Metropolitana de Santiago': ['Cerrillos', 'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'Puente Alto'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
  'Región del Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán'],
}

const CLIENTE_VACIO = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  departamento: '',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Cerrillos',
  indicaciones: '',
}

const generarCodigoOrden = () => `ORDER${Math.floor(10000 + Math.random() * 90000)}`

const generarNroCompra = () => {
  const hoy = new Date()
  const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`
  return `#${fecha}${Math.floor(100 + Math.random() * 900)}`
}

function Carrito({ carrito = [], onEliminarDelCarro }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Si venimos de un pago fallido, recuperamos los datos que el cliente ya había escrito
  const [cliente, setCliente] = useState(location.state?.cliente ?? CLIENTE_VACIO)
  const [errores, setErrores] = useState({})
  const [procesando, setProcesando] = useState(false)

  const totalPagar = carrito.reduce((total, p) => total + p.precio * p.cantidad, 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCliente((prev) => {
      const nuevo = { ...prev, [name]: value }
      // Al cambiar la región, la comuna se reinicia a la primera de esa región
      if (name === 'region') nuevo.comuna = REGIONES[value][0]
      return nuevo
    })
    setErrores((prev) => ({ ...prev, [name]: undefined }))
  }

  const validar = () => {
    const e = {}
    if (!cliente.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!cliente.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios'
    if (!cliente.correo.trim()) e.correo = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo)) e.correo = 'Correo inválido'
    if (!cliente.calle.trim()) e.calle = 'La calle es obligatoria'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handlePagar = (e) => {
    e.preventDefault()
    if (!validar()) return

    setProcesando(true)

    // Simulación de pago: espera 1.5 s y decide éxito o error.
    // Cuando tu compañero tenga el endpoint, reemplaza este setTimeout por un fetch
    // y usa su respuesta para definir "exito", "codigoOrden" y "nroCompra".
    setTimeout(() => {
      const exito = Math.random() < PROBABILIDAD_EXITO
      navigate('/resultado-pago', {
        state: {
          exito,
          cliente,
          items: carrito,
          total: totalPagar,
          codigoOrden: generarCodigoOrden(),
          nroCompra: generarNroCompra(),
        },
      })
    }, 1500)
  }

  // Helper para no repetir el markup de cada input
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
        className={`form-control ${errores[name] ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={cliente[name]}
        onChange={handleChange}
      />
      {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
    </div>
  )

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card text-dark shadow-lg border-secondary p-4" style={{ backgroundColor: '#fce4ec' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
              <div>
                <h1>🛒 Carrito de compra</h1>
                {carrito.length > 0 && <h4 className="fw-bold">Total a pagar: {formatear(totalPagar)}</h4>}
              </div>
              <Link to="/ventas" className="btn btn-sm fw-bold text-dark border border-dark" style={{ backgroundColor: '#bde0fe' }}>
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
              <>
                <p className="text-muted">Completa la siguiente información</p>
                <TablaProductos items={carrito} onEliminar={onEliminarDelCarro} />

                <form onSubmit={handlePagar} noValidate className="mt-4">
                  <h3 className="border-top border-secondary pt-4">Información del cliente</h3>
                  <p className="text-muted">Completa la siguiente información</p>

                  <div className="row">
                    <div className="col-md-4">{campo('nombre', 'Nombre', { requerido: true })}</div>
                    <div className="col-md-4">{campo('apellidos', 'Apellidos', { requerido: true })}</div>
                    <div className="col-md-4">{campo('correo', 'Correo', { requerido: true, type: 'email' })}</div>
                  </div>

                  <h3 className="mt-3">Dirección de entrega de los productos</h3>
                  <p className="text-muted">Ingrese dirección de forma detallada</p>

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
                    <label htmlFor="indicaciones" className="form-label fw-semibold">Indicaciones para la entrega (opcional)</label>
                    <textarea
                      id="indicaciones"
                      name="indicaciones"
                      rows="3"
                      className="form-control"
                      placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
                      value={cliente.indicaciones}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="text-end">
                    <button type="submit" className="btn btn-dark fw-bold px-4 py-2" disabled={procesando}>
                      {procesando ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Procesando pago...
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