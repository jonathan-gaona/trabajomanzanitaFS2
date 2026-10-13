import { useState, useEffect } from 'react'
import { documentoApi } from '../Data/ConexionBoletas'
import { useNavigate } from 'react-router-dom'

function BoletasAdmind() {
  const navigate = useNavigate()
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)

  useEffect(() => {
    const cargarDocumentos = async () => {
      try {
        setLoading(true)
        const data = await documentoApi.listarDocumentos()
        setDocumentos(data || [])
      } catch (error) {
        console.error('Error al cargar documentos:', error)
        setDocumentos([])
      } finally {
        setLoading(false)
      }
    }

    cargarDocumentos()
  }, [])

  const documentosFiltrados = documentos.filter(doc => {
    if (filtroTipo === 'todos') return true
    return (doc.tipo || '').toLowerCase() === filtroTipo.toLowerCase()
  })

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">📄 Gestión de Boletas y Pedidos</h1>
          <p className="text-muted mb-0">Vista general de transacciones registradas en el sistema.</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="btn-group">
            <button 
              className={`btn btn-outline-dark ${filtroTipo === 'todos' ? 'active' : ''}`} 
              onClick={() => setFiltroTipo('todos')}
            >
              Todos
            </button>
            <button 
              className={`btn btn-outline-dark ${filtroTipo === 'boleta' ? 'active' : ''}`} 
              onClick={() => setFiltroTipo('boleta')}
            >
              Boletas
            </button>
            <button 
              className={`btn btn-outline-dark ${filtroTipo === 'pedido' ? 'active' : ''}`} 
              onClick={() => setFiltroTipo('pedido')}
            >
              Pedidos
            </button>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="btn btn-outline-dark fw-bold shadow-sm"
            style={{ backgroundColor: '#fff', borderColor: '#5d4037', color: '#5d4037' }}
          >
            🏠 Volver al Admin Home
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-secondary p-3" style={{ backgroundColor: '#fce4ec' }}>
            <h4 className="fw-bold mb-3" style={{ color: '#5d4037' }}>Lista de Documentos</h4>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-dark" role="status" />
              </div>
            ) : documentosFiltrados.length === 0 ? (
              <p className="text-muted text-center py-4">No hay documentos registrados para este filtro.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle bg-white rounded overflow-hidden">
                  <thead className="table-dark">
                    <tr>
                      <th>ID / Ticket</th>
                      <th>Cliente / Estado</th>
                      <th>Fecha</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentosFiltrados.map((doc, index) => {
                      const docId = doc._id || doc.tikect || index
                      return (
                        <tr 
                          key={docId} 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => setDocumentoSeleccionado(doc)}
                        >
                          <td className="fw-bold small">{doc.tikect || doc._id || 'N/A'}</td>
                          <td>
                            <span className="badge bg-secondary text-uppercase me-1">{doc.tipo}</span>
                            <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                              {doc.observaciones || 'Sin observaciones'}
                            </span>
                          </td>
                          <td className="small">{doc.fecha ? new Date(doc.fecha).toLocaleDateString() : 'Reciente'}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary fw-bold">
                              Ver
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-5 mt-4 mt-lg-0">
          <div className="card shadow-sm border-secondary p-4 bg-white">
            <h4 className="fw-bold mb-3" style={{ color: '#5d4037' }}>Detalle Completo</h4>
            
            {documentoSeleccionado ? (
              <div>
                <div className="mb-3 border-bottom pb-2">
                  <span className="badge bg-dark mb-1 text-uppercase">{documentoSeleccionado.tipo}</span>
                  <p className="small mb-1"><strong>Ticket ID:</strong> {documentoSeleccionado.tikect || documentoSeleccionado._id}</p>
                  
                  {documentoSeleccionado.tipo === 'pedido' && (
                    <p className="small mb-1">
                      <strong>Estado Despacho:</strong> {documentoSeleccionado.despachado ? '✅ Despachado' : '⏳ Pendiente'}
                    </p>
                  )}
                </div>

                <div className="mb-3 border-bottom pb-2">
                  <h6 className="fw-bold">Información y Observaciones:</h6>
                  <p className="small text-muted bg-light p-2 rounded">{documentoSeleccionado.observaciones || 'Sin datos adicionales.'}</p>
                </div>

                <h6 className="fw-bold mb-2">Productos Comprados:</h6>
                <ul className="list-group list-group-flush mb-3 small">
                  {documentoSeleccionado.productos?.map((prod, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <div>
                        <strong>{prod.nombre}</strong> <span className="text-muted">(Cant: {prod.cantidad})</span>
                        <br/><small className="text-muted">Código: {prod.codigoB} | Cat: {prod.categoria}</small>
                      </div>
                      <span className="fw-bold">${(prod.precioU * prod.cantidad).toLocaleString('es-CL')}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="fw-bold text-end mt-3" style={{ color: '#5d4037' }}>
                  Total: ${Number(documentoSeleccionado.total).toLocaleString('es-CL')}
                </h4>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <p>👈 Selecciona un documento de la tabla para ver todos sus datos completos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoletasAdmind