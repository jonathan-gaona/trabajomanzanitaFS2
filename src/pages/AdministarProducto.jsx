import { useState, useEffect } from 'react'
import productosIniciales from '../Data/productos.json'

function AdminProductos() {
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem('admin_productos')
    return guardados ? JSON.parse(guardados) : productosIniciales
  })

  const [modoEdicion, setModoEdicion] = useState(false)
  const [idEditando, setIdEditando] = useState(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    imagen: '',
    descripcion: ''
  })

  // Estado para la vista previa y el arrastre de imagen
  const [previewImagen, setPreviewImagen] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    localStorage.setItem('admin_productos', JSON.stringify(productos))
  }, [productos])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Procesar imagen mediante el middleware de Vite para guardarla en public/img/productos/
  const procesarArchivoImagen = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecciona o arrastra un archivo de imagen válido.')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: file.name,
            imagenBase64: reader.result
          })
        })

        const resultado = await response.json()
        if (resultado.success) {
          setFormData(prev => ({
            ...prev,
            imagen: resultado.path
          }))
          setPreviewImagen(resultado.path)
        } else {
          alert('Error al guardar la imagen en el servidor.')
        }
      } catch (error) {
        console.error('Error de red al subir la imagen:', error)
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      procesarArchivoImagen(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      procesarArchivoImagen(e.target.files[0])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.precio || !formData.imagen) {
      alert('Por favor, completa al menos el nombre, precio y selecciona una imagen.')
      return
    }

    if (modoEdicion) {
      setProductos(productos.map(p => 
        p.id === idEditando 
          ? { ...p, ...formData, precio: Number(formData.precio) } 
          : p
      ))
      setModoEdicion(false)
      setIdEditando(null)
    } else {
      const nuevoProducto = {
        id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
        nombre: formData.nombre,
        precio: Number(formData.precio),
        imagen: formData.imagen,
        descripcion: formData.descripcion
      }
      setProductos([...productos, nuevoProducto])
    }

    setFormData({ nombre: '', precio: '', imagen: '', descripcion: '' })
    setPreviewImagen('')
  }

  const handleEditar = (producto) => {
    setModoEdicion(true)
    setIdEditando(producto.id)
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      descripcion: producto.descripcion || ''
    })
    setPreviewImagen(producto.imagen)
  }

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

              {/* Zona de Arrastre de Imagen respetando la estructura visual */}
              <div className="col-12">
                <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Imagen del Producto (Arrastra o haz clic)</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-2 border-dashed rounded-3 p-3 text-center position-relative bg-white ${isDragging ? 'border-dark bg-light' : 'border-secondary'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => document.getElementById('fileInputProducto').click()}
                >
                  <input 
                    id="fileInputProducto"
                    type="file" 
                    accept="image/*" 
                    className="d-none" 
                    onChange={handleFileSelect}
                  />

                  {previewImagen ? (
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <img 
                        src={previewImagen} 
                        alt="Vista previa" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} 
                        className="border border-secondary shadow-sm"
                      />
                      <div className="text-start">
                        <span className="small text-success fw-bold d-block">Imagen cargada correctamente</span>
                        <span className="small text-muted">{formData.imagen}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-muted">
                      <p className="mb-0 small fw-bold">Arrastra una imagen aquí o haz clic para seleccionarla</p>
                    </div>
                  )}
                </div>
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
                      setPreviewImagen('')
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