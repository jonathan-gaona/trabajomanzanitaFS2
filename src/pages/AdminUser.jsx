import { useState, useEffect } from 'react'
import { userApi } from '../Data/ConexionUser'

function AdminUser() {
  const [usuarios, setUsuarios] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)

  // Formulario estructurado según DTO de usuario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rol: 'cliente',
    email: '',
    paswword: ''
  })

  // Función para obtener la lista fresca desde la API
  const cargarUsuarios = async () => {
    try {
      const datos = await userApi.getUsers()
      setUsuarios(datos)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const handleSelectRow = (usuario) => {
    setSeleccionado(usuario)
    setFormData({
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      rol: usuario.rol || 'cliente',
      email: usuario.email || '',
      paswword: usuario.paswword || ''
    })
  }

  const handleLimpiar = () => {
    setSeleccionado(null)
    setFormData({
      nombre: '',
      apellido: '',
      rol: 'cliente',
      email: '',
      paswword: ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que la contraseña tenga al menos 10 caracteres al crear o si se está modificando
    if (!seleccionado && formData.paswword.length < 10) {
      alert('La contraseña debe tener al menos 10 caracteres.')
      return
    }

    try {
      if (seleccionado) {
        // Actualizar usuario en la BD
        await userApi.updateUser({
          ...formData,
          historialCompras: seleccionado.historialCompras || []
        })
        alert('¡Usuario modificado con éxito!')
      } else {
        // Crear usuario en la BD enviando historialCompras vacío
        await userApi.createUser({
          ...formData,
          historialCompras: []
        })
        alert('¡Usuario creado con éxito!')
      }

      await cargarUsuarios()
      handleLimpiar()
    } catch (error) {
      console.error('Error al guardar el usuario:', error)
      alert(`Ocurrió un error: ${error.message || 'Error en la solicitud'}`)
    }
  }

  // Función para eliminar usuario
  const handleEliminar = async () => {
    if (!seleccionado) return

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario ${seleccionado.nombre}?`
    )

    if (confirmar) {
      try {
        await userApi.deleteUser(seleccionado)
        alert('¡Usuario eliminado con éxito!')
        await cargarUsuarios()
        handleLimpiar()
      } catch (error) {
        console.error('Error al eliminar usuario:', error)
        alert(`No se pudo eliminar el usuario: ${error.message || 'Error de red'}`)
      }
    }
  }

  return (
    <div className="w-100 pb-5 overflow-hidden">
      <h2 className="mb-4 text-dark fw-bold text-uppercase">Gestión de Usuarios</h2>

      <div className="row g-4">
        
        {/* COLUMNA IZQUIERDA: Tabla de usuarios */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#5d4037' }}>
              <span className="fw-bold text-uppercase">Listado de Usuarios</span>
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
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios && usuarios.length > 0 ? (
                      usuarios.map((usu, index) => (
                        <tr 
                          key={usu.email || index} 
                          onClick={() => handleSelectRow(usu)}
                          style={{ 
                            cursor: 'pointer', 
                            backgroundColor: seleccionado?.email === usu.email ? '#fce4ec' : 'transparent' 
                          }}
                        >
                          <td className="fw-bold">{usu.nombre} {usu.apellido || ''}</td>
                          <td className="text-break">{usu.email}</td>
                          <td>
                            <span className={`badge ${usu.rol === 'administrador' ? 'bg-danger' : 'bg-secondary'}`}>
                              {usu.rol || 'cliente'}
                            </span>
                          </td>
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

        {/* COLUMNA DERECHA: Formulario DTO */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0" style={{ backgroundColor: '#fce4ec' }}>
            <div className="card-header text-white fw-bold py-2 text-uppercase" style={{ backgroundColor: '#5d4037' }}>
              {seleccionado ? 'Modificar Usuario' : 'Nuevo Usuario'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                
                {/* Campo Nombre */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Nombre</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ingresa el nombre"
                    required
                  />
                </div>

                {/* Campo Apellido */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Apellido</label>
                  <input 
                    type="text" 
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ingresa el apellido"
                  />
                </div>

                {/* Campo Rol */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Rol del Usuario</label>
                  <select 
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="form-select border-secondary w-100"
                    style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="cliente">cliente</option>
                    <option value="administrador">administrador</option>
                  </select>
                </div>

                {/* Campo Email */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Correo Electrónico (email)</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="usuario@correo.com"
                    disabled={Boolean(seleccionado)}
                    required
                  />
                </div>

                {/* Campo Password */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">Contraseña (Mínimo 10 caracteres)</label>
                  <input 
                    type="password" 
                    name="paswword"
                    value={formData.paswword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Mínimo 10 caracteres"
                    minLength={10}
                    required={!seleccionado}
                  />
                </div>

                {/* Acciones del formulario */}
                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn text-white fw-bold py-2"
                    style={{ backgroundColor: '#5d4037' }}
                  >
                    {seleccionado ? 'Modificar' : 'Agregar'}
                  </button>

                  {/* Botón de Eliminar perfil */}
                  {seleccionado && (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-danger fw-bold py-2"
                        onClick={handleEliminar}
                      >
                        Eliminar Perfil
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm mt-1"
                        onClick={handleLimpiar}
                      >
                        Cancelar selección
                      </button>
                    </>
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