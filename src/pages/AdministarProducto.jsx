import { useState, useEffect } from 'react'
import productosIniciales from '../Data/productos.json'

function AdminProductos() {
  // Inicializamos el estado cargando desde localStorage, o usamos el JSON si está vacío
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem('admin_productos')
    return guardados ? JSON.parse(guardados) : productosIniciales
  })

  // Estado para el formulario (Crear o Editar)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [idEditando, setIdEditando] = useState(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    imagen: '',
    descripcion: ''
  })

  // Guardar en localStorage cada vez que la lista de productos cambie
  useEffect(() => {
    localStorage.setItem('admin_productos', JSON.stringify(productos))
  }, [productos])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Manejar el envío del formulario (Crear o Actualizar)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.precio || !formData.imagen) {
      alert('Por favor, completa al menos el nombre, precio y la imagen.')
      return
    }

    if (modoEdicion) {
      // Actualizar producto existente
      setProductos(productos.map(p => 
        p.id === idEditando 
          ? { ...p, ...formData, precio: Number(formData.precio) } 
          : p
      ))
      setModoEdicion(false)
      setIdEditando(null)
    } else {
      // Crear nuevo producto
      const nuevoProducto = {
        id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
        nombre: formData.nombre,
        precio: Number(formData.precio),
        imagen: formData.imagen,
        descripcion: formData.descripcion
      }
      setProductos([...productos, nuevoProducto])
    }

    // Limpiar formulario
    setFormData({ nombre: '', precio: '', imagen: '', descripcion: '' })
  }

  // Preparar datos para editar
  const handleEditar = (producto) => {
    setModoEdicion(true)
    setIdEditando(producto.id)
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      descripcion: producto.descripcion || ''
    })
  }

  // Eliminar producto
  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id))
    }
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: '#5d4037' }}>Panel de Administración: Productos</h2>

      {/* Formulario de Agregar / Modificar */}
      <div className="card shadow-sm border-secondary mb-5" style={{ backgroundColor: '#fce4ec' }}>
        <div className="card-header text-white fw-bold py-2" style={{ backgroundColor: '#5d4037' }}>
          {modoEdicion ? 'Modificar Producto' : 'Agregar Nuevo Producto'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Nombre del Producto</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-control border-secondary"
                  placeholder="Ej: Kisaragi Saya"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Precio (CLP)</label>
                <input 
                  type="number" 
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  className="form-control border-secondary"
                  placeholder="Ej: 20000"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Ruta de la Imagen</label>
                <input 
                  type="text" 
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  className="form-control border-secondary"
                  placeholder="Ej: /img/bloodc.jpg"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Descripción</label>
                <textarea 
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-control border-secondary"
                  rows="2"
                  placeholder="Breve descripción..."
                ></textarea>
              </div>

              <div className="col-12 d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn text-white fw-bold px-4" 
                  style={{ backgroundColor: '#5d4037' }}
                >
                  {modoEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
                {modoEdicion && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setModoEdicion(false)
                      setIdEditando(null)
                      setFormData({ nombre: '', precio: '', imagen: '', descripcion: '' })
                    }}
                    className="btn btn-secondary fw-bold px-4"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla de Productos Existentes */}
      <div className="card shadow-sm border-secondary">
        <div className="card-header text-white fw-bold py-2 text-uppercase" style={{ backgroundColor: '#5d4037' }}>
          Lista de Productos Registrados
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0 align-middle">
              <thead className="table-light border-bottom border-secondary">
                <tr>
                  <th>Imagen</th>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No hay productos registrados.</td>
                  </tr>
                ) : (
                  productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <img 
                          src={prod.imagen} 
                          alt={prod.nombre} 
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%' }} 
                          className="border border-secondary"
                        />
                      </td>
                      <td className="fw-bold">{prod.id}</td>
                      <td>{prod.nombre}</td>
                      <td className="fw-bold" style={{ color: '#5d4037' }}>
                        ${Number(prod.precio).toLocaleString('es-CL')}
                      </td>
                      <td className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                        {prod.descripcion}
                      </td>
                      <td className="text-center">
                        <button 
                          onClick={() => handleEditar(prod)} 
                          className="btn btn-sm btn-outline-dark me-2 fw-bold"
                        >
                          Modificar
                        </button>
                        <button 
                          onClick={() => handleEliminar(prod.id)} 
                          className="btn btn-sm btn-danger fw-bold"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProductos