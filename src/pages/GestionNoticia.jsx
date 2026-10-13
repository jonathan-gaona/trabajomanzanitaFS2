import { useState, useEffect } from 'react'
import { noticiaApi } from '../Data/ConexionBlog'
import { useNavigate } from 'react-router-dom'

function GestionNoticias() {
  const navigate = useNavigate()
  const [noticias, setNoticias] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [loading, setLoading] = useState(false)

  const [tarjetaForm, setTarjetaForm] = useState({
    titulo: '',
    slug: '',
    resumen: '',
    imagenPortada: '',
    categoria: 'Novedades',
    autor: 'Equipo AnimeWord',
    destacado: false
  })

  const [previewImagen, setPreviewImagen] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [introduccion, setIntroduccion] = useState('')
  const [secciones, setSecciones] = useState([
    { tipo: 'parrafo', contenido: '', caption: '' }
  ])

  const cargarNoticias = async () => {
    try {
      setLoading(true)
      const datos = await noticiaApi.getNoticias()
      setNoticias(datos || [])
    } catch (error) {
      console.error('Error al cargar noticias:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarNoticias()
  }, [])

  const handleTituloChange = (e) => {
    const tituloVal = e.target.value
    const slugGenerado = tituloVal
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    setTarjetaForm(prev => ({
      ...prev,
      titulo: tituloVal,
      slug: slugGenerado
    }))
  }

  const procesarArchivoPortada = async (file) => {
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
            imagenBase64: reader.result,
            folder: 'Blog'
          })
        })

        const resultado = await response.json()
        if (resultado.success) {
          setTarjetaForm(prev => ({ ...prev, imagenPortada: resultado.path }))
          setPreviewImagen(resultado.path)
        } else {
          alert('Error al guardar la imagen en el servidor.')
        }
      } catch (error) {
        console.error('Error de red al subir la imagen:', error)
      }
    }
  }

  const procesarArchivoSeccion = async (file, index) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.')
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
            imagenBase64: reader.result,
            folder: 'Blog'
          })
        })

        const resultado = await response.json()
        if (resultado.success) {
          handleCambiarSeccion(index, 'contenido', resultado.path)
        } else {
          alert('Error al guardar la imagen de la sección.')
        }
      } catch (error) {
        console.error('Error de red al subir la imagen de la sección:', error)
      }
    }
  }

  const handleAgregarSeccion = (tipo = 'parrafo') => {
    setSecciones(prev => [...prev, { tipo, contenido: '', caption: '' }])
  }

  const handleCambiarSeccion = (index, campo, valor) => {
    setSecciones(prev => {
      const copia = [...prev]
      copia[index][campo] = valor
      return copia
    })
  }

  const handleEliminarSeccion = (index) => {
    if (secciones.length === 1) {
      alert('El artículo debe tener al menos una sección de contenido.')
      return
    }
    setSecciones(prev => prev.filter((_, i) => i !== index))
  }

  const handleSelectNoticia = (noticia) => {
    setSeleccionada(noticia)
    const imgPortada = noticia.tarjeta?.imagenPortada || ''

    if (noticia.tarjeta) {
      setTarjetaForm({
        titulo: noticia.tarjeta.titulo || '',
        slug: noticia.tarjeta.slug || '',
        resumen: noticia.tarjeta.resumen || '',
        imagenPortada: imgPortada,
        categoria: noticia.tarjeta.categoria || 'Novedades',
        autor: noticia.tarjeta.autor || 'Equipo AnimeWord',
        destacado: Boolean(noticia.tarjeta.destacado)
      })
      setPreviewImagen(imgPortada)
    }

    if (noticia.articulo) {
      setIntroduccion(noticia.articulo.introduccion || '')
      setSecciones(
        noticia.articulo.secciones && noticia.articulo.secciones.length > 0
          ? noticia.articulo.secciones
          : [{ tipo: 'parrafo', contenido: '', caption: '' }]
      )
    }
  }

  const handleLimpiarForm = () => {
    setSeleccionada(null)
    setTarjetaForm({
      titulo: '',
      slug: '',
      resumen: '',
      imagenPortada: '',
      categoria: 'Novedades',
      autor: 'Equipo AnimeWord',
      destacado: false
    })
    setPreviewImagen('')
    setIntroduccion('')
    setSecciones([{ tipo: 'parrafo', contenido: '', caption: '' }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tarjetaForm.titulo.trim() || !tarjetaForm.imagenPortada.trim()) {
      alert('Por favor, ingresa un título y una imagen de portada válida.')
      return
    }

    const payloadDTO = {
      tarjeta: { ...tarjetaForm },
      articulo: {
        introduccion: introduccion,
        secciones: secciones.filter(sec => sec.contenido.trim() !== '')
      }
    }

    try {
      if (seleccionada) {
        const slug = seleccionada.tarjeta?.slug || seleccionada.slug
        await noticiaApi.updateNoticia(slug, payloadDTO)
        alert('¡Noticia actualizada con éxito!')
      } else {
        await noticiaApi.createNoticia(payloadDTO)
        alert('¡Noticia publicada con éxito!')
      }

      await cargarNoticias()
      handleLimpiarForm()
    } catch (error) {
      console.error('Error al guardar la noticia:', error)
      alert(`Ocurrió un error: ${error.message || 'Error en la solicitud'}`)
    }
  }

  const handleEliminar = async () => {
    if (!seleccionada) return

    const slug = seleccionada.tarjeta?.slug || seleccionada.slug

    if (window.confirm(`¿Estás seguro de eliminar la noticia "${seleccionada.tarjeta?.titulo}"?`)) {
      try {
        await noticiaApi.deleteNoticia(slug)
        alert('¡Noticia eliminada correctamente!')
        await cargarNoticias()
        handleLimpiarForm()
      } catch (error) {
        console.error('Error al eliminar noticia:', error)
        alert(`No se pudo eliminar: ${error.message || 'Error de red'}`)
      }
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0" style={{ color: '#5d4037' }}>
          Panel de Administración: Noticias & Blog
        </h2>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-outline-dark fw-bold shadow-sm"
          style={{ backgroundColor: '#fff', borderColor: '#5d4037', color: '#5d4037' }}
        >
          🏠 Volver al Admin Home
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#5d4037' }}>
              <span className="fw-bold text-uppercase">Publicaciones ({noticias.length})</span>
              <button className="btn btn-sm btn-light text-dark fw-bold" onClick={handleLimpiarForm}>
                + Nueva Noticia
              </button>
            </div>
            <div className="card-body p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center py-4 text-muted">Cargando noticias...</div>
              ) : noticias.length === 0 ? (
                <div className="text-center py-4 text-muted">No hay publicaciones registradas.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {noticias.map((item, idx) => {
                    const isSelected = (seleccionada?.id && seleccionada.id === item.id) ||
                                       (seleccionada?.tarjeta?.slug && seleccionada.tarjeta.slug === item.tarjeta?.slug)
                    
                    const imgUrl = item.tarjeta?.imagenPortada || 'https://via.placeholder.com/60'

                    return (
                      <button
                        key={item.id || item.tarjeta?.slug || idx}
                        onClick={() => handleSelectNoticia(item)}
                        className={`list-group-item list-group-item-action p-3 ${isSelected ? 'bg-light border-start border-4 border-danger' : ''}`}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={imgUrl}
                            alt="Portada"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div>
                            <span className="badge bg-secondary mb-1">{item.tarjeta?.categoria || 'Blog'}</span>
                            <h6 className="mb-0 fw-bold text-truncate" style={{ maxWidth: '220px' }}>
                              {item.tarjeta?.titulo || 'Sin título'}
                            </h6>
                            <small className="text-muted">{item.tarjeta?.autor}</small>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0" style={{ backgroundColor: '#fce4ec' }}>
            <div className="card-header text-white fw-bold py-2 text-uppercase" style={{ backgroundColor: '#5d4037' }}>
              {seleccionada ? 'Editar Publicación' : 'Crear Nueva Publicación'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <h5 className="fw-bold mb-3" style={{ color: '#5d4037' }}>1. Datos de la Tarjeta (Feed)</h5>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Título de la Noticia</label>
                  <input
                    type="text"
                    value={tarjetaForm.titulo}
                    onChange={handleTituloChange}
                    className="form-control border-secondary"
                    placeholder="Ej: La vitrina de Carlos..."
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold">Categoría</label>
                    <select
                      value={tarjetaForm.categoria}
                      onChange={(e) => setTarjetaForm({ ...tarjetaForm, categoria: e.target.value })}
                      className="form-select border-secondary"
                    >
                      <option value="Novedades">Novedades</option>
                      <option value="Guías">Guías</option>
                      <option value="Comunidad">Comunidad</option>
                      <option value="Reseñas">Reseñas</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold">Autor</label>
                    <input
                      type="text"
                      value={tarjetaForm.autor}
                      onChange={(e) => setTarjetaForm({ ...tarjetaForm, autor: e.target.value })}
                      className="form-control border-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold" style={{ color: '#5d4037' }}>Imagen de Portada</label>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      if (e.dataTransfer.files?.[0]) procesarArchivoPortada(e.dataTransfer.files[0])
                    }}
                    className={`border border-2 border-dashed rounded-3 p-3 text-center position-relative bg-white ${isDragging ? 'border-dark bg-light' : 'border-secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => document.getElementById('fileInputBlogPortada').click()}
                  >
                    <input 
                      id="fileInputBlogPortada"
                      type="file" 
                      accept="image/*" 
                      className="d-none" 
                      onChange={(e) => e.target.files?.[0] && procesarArchivoPortada(e.target.files[0])}
                    />

                    {previewImagen ? (
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        <img 
                          src={previewImagen} 
                          alt="Vista previa" 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                          className="border border-secondary shadow-sm"
                        />
                        <div className="text-start">
                          <span className="small text-success fw-bold d-block">Imagen cargada correctamente</span>
                          <span className="small text-muted">{tarjetaForm.imagenPortada}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-muted">
                        <p className="mb-0 small fw-bold">Arrastra una imagen aquí o haz clic para seleccionarla</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Resumen corto</label>
                  <textarea
                    value={tarjetaForm.resumen}
                    onChange={(e) => setTarjetaForm({ ...tarjetaForm, resumen: e.target.value })}
                    className="form-control border-secondary"
                    rows="2"
                    placeholder="Breve vista previa para el listado..."
                    required
                  ></textarea>
                </div>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3" style={{ color: '#5d4037' }}>2. Cuerpo del Artículo</h5>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Introducción</label>
                  <textarea
                    value={introduccion}
                    onChange={(e) => setIntroduccion(e.target.value)}
                    className="form-control border-secondary"
                    rows="2"
                    placeholder="Párrafo introductorio..."
                  ></textarea>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold mb-0">Bloques de Contenido</label>
                    <div className="btn-group btn-group-sm">
                      <button type="button" className="btn btn-outline-dark" onClick={() => handleAgregarSeccion('parrafo')}>
                        + Párrafo
                      </button>
                      <button type="button" className="btn btn-outline-dark" onClick={() => handleAgregarSeccion('subtitulo')}>
                        + Subtítulo
                      </button>
                      <button type="button" className="btn btn-outline-dark" onClick={() => handleAgregarSeccion('imagen')}>
                        + Imagen
                      </button>
                    </div>
                  </div>

                  {secciones.map((sec, idx) => (
                    <div key={idx} className="card p-2 mb-2 border-secondary bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-dark text-uppercase">{sec.tipo} #{idx + 1}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 fw-bold"
                          onClick={() => handleEliminarSeccion(idx)}
                        >
                          ✕
                        </button>
                      </div>

                      {sec.tipo === 'imagen' ? (
                        <div className="mb-2">
                          <div 
                            className="border border-2 border-dashed rounded-2 p-2 text-center bg-light"
                            style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                            onClick={() => document.getElementById(`fileInputSeccion_${idx}`).click()}
                          >
                            <input 
                              id={`fileInputSeccion_${idx}`}
                              type="file" 
                              accept="image/*" 
                              className="d-none" 
                              onChange={(e) => e.target.files?.[0] && procesarArchivoSeccion(e.target.files[0], idx)}
                            />
                            {sec.contenido ? (
                              <div className="d-flex align-items-center gap-2">
                                <img src={sec.contenido} alt="Sección" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                <span className="text-success text-truncate small">Cargada: {sec.contenido}</span>
                              </div>
                            ) : (
                              <span className="text-muted fw-bold">Haz clic o arrastra una imagen para este bloque</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <textarea
                          value={sec.contenido}
                          onChange={(e) => handleCambiarSeccion(idx, 'contenido', e.target.value)}
                          className="form-control form-control-sm border-secondary mb-1"
                          rows={sec.tipo === 'parrafo' ? 2 : 1}
                          placeholder={sec.tipo === 'parrafo' ? 'Escribe el párrafo...' : 'Escribe el subtítulo...'}
                        ></textarea>
                      )}

                      {sec.tipo === 'imagen' && (
                        <input
                          type="text"
                          value={sec.caption || ''}
                          onChange={(e) => handleCambiarSeccion(idx, 'caption', e.target.value)}
                          className="form-control form-control-sm border-secondary mt-1"
                          placeholder="Pie de foto opcional..."
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn text-white fw-bold py-2" style={{ backgroundColor: '#5d4037' }}>
                    {seleccionada ? 'Guardar Cambios' : 'Publicar Noticia'}
                  </button>

                  {seleccionada && (
                    <>
                      <button type="button" className="btn btn-danger fw-bold py-2" onClick={handleEliminar}>
                        Eliminar Publicación
                      </button>
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLimpiarForm}>
                        Cancelar Selección
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

export default GestionNoticias