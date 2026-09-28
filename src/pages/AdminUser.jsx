import { useState, useEffect } from 'react'
import usuariosJson from '../Data/user.json'

function AdminUser() {
  // Siempre iniciamos cargando el archivo JSON directamente
  const [usuarios, setUsuarios] = useState(usuariosJson)
  const [seleccionado, setSeleccionado] = useState(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: ''
  })

  const handleSelectRow = (usuario) => {
    setSeleccionado(usuario)
    setFormData({
      nombre: usuario.nombre || '',
      correo: usuario.correo || '',
      password: usuario.password || ''
    })
  }

  const handleLimpiar = () => {
    setSeleccionado(null)
    setFormData({ nombre: '', correo: '', password: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (seleccionado) {
      setUsuarios(usuarios.map(u => u.id === seleccionado.id ? { ...formData, id: seleccionado.id } : u))
      alert('¡Usuario modificado con éxito!')
    } else {
      const nuevo = { ...formData, id: Date.now() }
      setUsuarios([...usuarios, nuevo])
      alert('¡Usuario agregado con éxito!')
    }
    handleLimpiar()
  }

  return (
    <div className="w-100 pb-5">
      <h2 className="mb-4 text-dark fw-bold text-uppercase">Gestión de Usuarios</h2>

      <div className="row g-4">
        
        {/* COLUMNA IZQUIERDA: Tabla de usuarios */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#5d4037' }}>
              <span className="fw-bold text-uppercase">Listado de Usuarios (Desde JSON)</span>
              <button className="btn btn-sm btn-light text-dark fw-bold" onClick={handleLimpiar}>
                + Nuevo Usuario
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Contraseña</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map((usu) => (
                        <tr 
                          key={usu.id} 
                          onClick={() => handleSelectRow(usu)}
                          style={{ 
                            cursor: 'pointer', 
                            backgroundColor: seleccionado?.id === usu.id ? '#fce4ec' : 'transparent' 
                          }}
                        >
                          <td className="fw-bold">{usu.nombre}</td>
                          <td>{usu.correo}</td>
                          <td>{usu.password}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No hay usuarios registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario dinámico */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0" style={{ backgroundColor: '#fce4ec' }}>
            <div className="card-header text-white fw-bold py-2 text-uppercase" style={{ backgroundColor: '#5d4037' }}>
              {seleccionado ? 'Modificar Usuario' : 'Nuevo Usuario'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Nombre</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Contraseña</label>
                  <input 
                    type="text" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn text-white fw-bold py-2"
                    style={{ backgroundColor: '#5d4037' }}
                  >
                    {seleccionado ? 'Modificar' : 'Agregar'}
                  </button>

                  {seleccionado && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleLimpiar}
                    >
                      Cancelar selección
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminUser