import { useState, useEffect } from 'react'
import { productApi } from '../Data/ConexionProducto'
import { validarProducto, validarCategoria } from '../validaciones/validacionesProductos'

function GestionInventario() {
  // Estado para controlar qué pestaña está activa: 'productos' o 'categorias'
  const [tabActiva, setTabActiva] = useState('productos')

  // Estados compartidos y de productos
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [modoEdicionProd, setModoEdicionProd] = useState(false)
  const [idEditandoProd, setIdEditandoProd] = useState(null)
  
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    cBarras: '',
    descripcion: '',
    imagen: ''
  })

  const [previewImagen, setPreviewImagen] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  // Estados de categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [nombreAnterior, setNombreAnterior] = useState('')

  // Cargar datos iniciales desde la API
  const cargarDatos = async () => {
    try {
      let listaProductos = []
      let listaCategorias = []

      try {
        listaProductos = await productApi.getProducts()
      } catch (e) {
        console.warn('Sin productos o base de datos vacía')
      }

      try {
        listaCategorias = await productApi.getCategories()
      } catch (e) {
        console.warn('Sin categorías o base de datos vacía')
      }

      setProductos(listaProductos || [])
      setCategorias(listaCategorias || [])

      if (listaCategorias && listaCategorias.length > 0 && !formProducto.categoria) {
        const primeraCat = listaCategorias[0].cnombre || listaCategorias[0].nombre || ''
        setFormProducto(prev => ({ ...prev, categoria: primeraCat }))
      }
    } catch (error) {
      console.error('Error al cargar datos del inventario:', error)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // --- MANEJADORES DE PRODUCTOS ---
  const handleFormProductoChange = (e) => {
    setFormProducto({
      ...formProducto,
      [e.target.name]: e.target.value
    })
  }

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
          setFormProducto(prev => ({ ...prev, imagen: resultado.path }))
          setPreviewImagen(resultado.path)
        } else {
          alert('Error al guardar la imagen en el servidor.')
        }
      } catch (error) {
        console.error('Error de red al subir la imagen:', error)
      }
    }
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => { setIsDragging(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      procesarArchivoImagen(e.dataTransfer.files[0])
    }
  }

  const handleSubmitProducto = async (e) => {
    e.preventDefault()
    const error = validarProducto(formProducto)
    if (error) {
      alert(error)
      return
    }

    try {
      const payload = {
        ...formProducto,
        precio: Number(formProducto.precio),
        stock: Number(formProducto.stock)
      }

      if (modoEdicionProd) {
        await productApi.updateProduct(payload)
        alert('¡Producto actualizado con éxito!')
        setModoEdicionProd(false)
        setIdEditandoProd(null)
      } else {
        await productApi.createProduct(payload)
        alert('¡Producto creado con éxito!')
      }

      await cargarDatos()
      limpiarFormProducto()
    } catch (err) {
      console.error('Error al guardar producto:', err)
      alert(`Ocurrió un error: ${err.message || 'Error en la solicitud'}`)
    }
  }

  const limpiarFormProducto = () => {
    const primeraCat = categorias.length > 0 ? (categorias[0].cnombre || categorias[0].nombre || '') : ''
    setFormProducto({
      nombre: '',
      precio: '',
      stock: '',
      categoria: primeraCat,
      cBarras: '',
      descripcion: '',
      imagen: ''
    })
    setPreviewImagen('')
    setModoEdicionProd(false)
    setIdEditandoProd(null)
  }

  const handleEditarProducto = (prod) => {
    setModoEdicionProd(true)
    setIdEditandoProd(prod.id)

    // Soportamos todas las posibles variantes de nombres devueltos por la BD/Backend
    const codigoBarrasReal = prod.cBarras || prod.codigoBarras || prod.Cbarras || ''
    const imagenReal = prod.imagen || prod.imagenPath || ''

    setFormProducto({
      nombre: prod.nombre || '',
      precio: prod.precio || '',
      stock: prod.stock || '',
      categoria: prod.categoria || (categorias[0]?.cnombre || categorias[0]?.nombre || ''),
      cBarras: codigoBarrasReal,
      descripcion: prod.descripcion || '',
      imagen: imagenReal
    })
    setPreviewImagen(imagenReal)
  }

  const handleEliminarProducto = async (prod) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${prod.nombre}"?`)) {
      try {
        await productApi.deleteProduct(prod)
        alert('¡Producto eliminado con éxito!')
        await cargarDatos()
      } catch (err) {
        console.error('Error al eliminar producto:', err)
        alert(`No se pudo eliminar: ${err.message || 'Error de red'}`)
      }
    }
  }

  // --- MANEJADORES DE CATEGORÍAS ---
  const handleSelectCategoriaRow = (cat) => {
    setCategoriaSeleccionada(cat)
    const nombreReal = cat.cnombre || cat.nombre || ''
    setNombreCategoria(nombreReal)
    setNombreAnterior(nombreReal)
  }

  const limpiarFormCategoria = () => {
    setCategoriaSeleccionada(null)
    setNombreCategoria('')
    setNombreAnterior('')
  }

  const handleSubmitCategoria = async (e) => {
    e.preventDefault()
    const error = validarCategoria(nombreCategoria)
    if (error) {
      alert(error)
      return
    }

    try {
      if (categoriaSeleccionada) {
        await productApi.updateCategory(nombreAnterior, nombreCategoria)
        alert('¡Categoría modificada con éxito!')
      } else {
        await productApi.createCategory(nombreCategoria)
        alert('¡Categoría creada con éxito!')
      }

      await cargarDatos()
      limpiarFormCategoria()
    } catch (err) {
      console.error('Error al guardar categoría:', err)
      alert(`Ocurrió un error: ${err.message || 'Error en la solicitud'}`)
    }
  }

  const handleEliminarCategoria = async () => {
    if (!categoriaSeleccionada) return

    const nombreActual = categoriaSeleccionada.cnombre || categoriaSeleccionada.nombre

    if (window.confirm(`¿Estás seguro de eliminar la categoría "${nombreActual}"?`)) {
      try {
        await productApi.deleteCategory(nombreActual)
        alert('¡Categoría eliminada con éxito!')
        await cargarDatos()
        limpiarFormCategoria()
      } catch (err) {
        console.error('Error al eliminar categoría:', err)
        alert(`No se pudo eliminar: ${err.message || 'Error de red'}`)
      }
    }
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: '#5d4037' }}>Panel de Administración: Inventario</h2>

      {/* Botones de Pestañas (Tabs) estilo moderno */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold px-4 ${tabActiva === 'productos' ? 'text-white' : 'text-dark border border-secondary'}`}
            style={{ backgroundColor: tabActiva === 'productos' ? '#5d4037' : 'transparent' }}
            onClick={() => setTabActiva('productos')}
          >
            Gestión de Productos
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold px-4 ${tabActiva === 'categorias' ? 'text-white' : 'text-dark border border-secondary'}`}
            style={{ backgroundColor: tabActiva === 'categorias' ? '#5d4037' : 'transparent' }}
            onClick={() => setTabActiva('categorias')}
          >
            Gestión de Categorías
          </button>
        </li>
      </ul>

      {/* --- VISTA DE PRODUCTOS --- */}
      {tabActiva === 'productos' && (
        <div>
          {/* Formulario de Agregar / Modificar Producto */}
          <div className="card shadow-sm border-secondary mb-5" style={{ backgroundColor: '#fce4ec' }}>
            <div className="card-header text-white fw-bold py-2" style={{ backgroundColor: '#5d4037' }}>
              {modoEdicionProd ? 'Modificar Producto' : 'Agregar Nuevo Producto'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmitProducto}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Nombre del Producto</label>
                    <input 
                      type="text" 
                      name="nombre"
                      value={formProducto.nombre}
                      onChange={handleFormProductoChange}
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
                      value={formProducto.precio}
                      onChange={handleFormProductoChange}
                      className="form-control border-secondary"
                      placeholder="Ej: 20000"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Stock</label>
                    <input 
                      type="number" 
                      name="stock"
                      value={formProducto.stock}
                      onChange={handleFormProductoChange}
                      className="form-control border-secondary"
                      placeholder="Ej: 15"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Categoría</label>
                    <select 
                      name="categoria"
                      value={formProducto.categoria}
                      onChange={handleFormProductoChange}
                      className="form-select border-secondary w-100"
                      required
                    >
                      {categorias.map((cat, idx) => {
                        const nombreCat = cat.cnombre || cat.nombre || ''
                        return (
                          <option key={cat.id || idx} value={nombreCat}>
                            {nombreCat}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Código de Barras (cBarras)</label>
                    <input 
                      type="text" 
                      name="cBarras"
                      value={formProducto.cBarras}
                      onChange={handleFormProductoChange}
                      className="form-control border-secondary"
                      placeholder="Ej: 780123456789"
                      required
                    />
                  </div>

                  {/* Zona de Arrastre de Imagen */}
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
                        onChange={(e) => e.target.files?.[0] && procesarArchivoImagen(e.target.files[0])}
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
                            <span className="small text-muted">{formProducto.imagen}</span>
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
                      value={formProducto.descripcion}
                      onChange={handleFormProductoChange}
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
                      {modoEdicionProd ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                    {modoEdicionProd && (
                      <button 
                        type="button" 
                        onClick={limpiarFormProducto}
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

          {/* Tabla de Productos */}
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
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>cBarras</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">No hay productos registrados.</td>
                      </tr>
                    ) : (
                      productos.map((prod) => {
                        const imgPath = prod.imagen || prod.imagenPath || ''
                        const cbarrasVal = prod.cBarras || prod.codigoBarras || prod.Cbarras || 'N/A'
                        const nombreCat = prod.categoria || ''

                        return (
                          <tr key={prod.id || cbarrasVal}>
                            <td>
                              {imgPath ? (
                                <img 
                                  src={imgPath} 
                                  alt={prod.nombre} 
                                  style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%' }} 
                                  className="border border-secondary"
                                />
                              ) : (
                                <span className="badge bg-light text-dark border">Sin Img</span>
                              )}
                            </td>
                            <td className="fw-bold">{prod.nombre}</td>
                            <td><span className="badge bg-secondary">{nombreCat}</span></td>
                            <td className="fw-bold" style={{ color: '#5d4037' }}>
                              ${Number(prod.precio).toLocaleString('es-CL')}
                            </td>
                            <td>{prod.stock}</td>
                            <td className="small text-muted">{cbarrasVal}</td>
                            <td className="text-center">
                              <button 
                                onClick={() => handleEditarProducto(prod)} 
                                className="btn btn-sm btn-outline-dark me-2 fw-bold"
                              >
                                Modificar
                              </button>
                              <button 
                                onClick={() => handleEliminarProducto(prod)} 
                                className="btn btn-sm btn-danger fw-bold"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- VISTA DE CATEGORÍAS --- */}
      {tabActiva === 'categorias' && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#5d4037' }}>
                <span className="fw-bold text-uppercase">Listado de Categorías</span>
                <button className="btn btn-sm btn-light text-dark fw-bold" onClick={limpiarFormCategoria}>
                  + Nueva Categoría
                </button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre de la Categoría</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.length > 0 ? (
                        categorias.map((cat, index) => {
                          const nombreCat = cat.cnombre || cat.nombre || ''
                          const isSelected = (categoriaSeleccionada?.cnombre || categoriaSeleccionada?.nombre) === nombreCat
                          return (
                            <tr 
                              key={cat.id || index} 
                              onClick={() => handleSelectRow(cat)}
                              style={{ 
                                cursor: 'pointer', 
                                backgroundColor: isSelected ? '#fce4ec' : 'transparent' 
                              }}
                            >
                              <td className="fw-bold">{cat.id || index + 1}</td>
                              <td>{nombreCat}</td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center py-4 text-muted">
                            No hay categorías registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card shadow-sm border-0" style={{ backgroundColor: '#fce4ec' }}>
              <div className="card-header text-white fw-bold py-2 text-uppercase" style={{ backgroundColor: '#5d4037' }}>
                {categoriaSeleccionada ? 'Modificar Categoría' : 'Nueva Categoría'}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitCategoria}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Nombre de la Categoría</label>
                    <input 
                      type="text" 
                      value={nombreCategoria}
                      onChange={(e) => setNombreCategoria(e.target.value)}
                      className="form-control border-secondary"
                      placeholder="Ej: Anime, Ropa, etc."
                      required
                    />
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn text-white fw-bold py-2"
                      style={{ backgroundColor: '#5d4037' }}
                    >
                      {categoriaSeleccionada ? 'Modificar Categoría' : 'Guardar Categoría'}
                    </button>

                    {categoriaSeleccionada && (
                      <>
                        <button 
                          type="button" 
                          className="btn btn-danger fw-bold py-2"
                          onClick={handleEliminarCategoria}
                        >
                          Eliminar Categoría
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-sm mt-1"
                          onClick={limpiarFormCategoria}
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
      )}
    </div>
  )
}

export default GestionInventario