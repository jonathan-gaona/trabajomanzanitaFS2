import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { noticiaApi } from '../Data/ConexionBlog'

function ArticuloBlog() {
  const { id } = useParams() // Nota: 'id' captura la variable enviada por la URL (que es el slug)
  const [noticia, setNoticia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const obtenerArticulo = async () => {
      try {
        setLoading(true)
        const data = await noticiaApi.getNoticiaBySlug(id)
        setNoticia(data)
      } catch (error) {
        console.error('Error al cargar la noticia:', error)
        setNoticia(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      obtenerArticulo()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando artículo...</span>
        </div>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="container py-5 text-center">
        <h2>Artículo no encontrado</h2>
        <Link to="/blog" className="btn btn-outline-dark mt-3">
          ← Volver al blog
        </Link>
      </div>
    )
  }

  const tarjeta = noticia.tarjeta || {}
  const articulo = noticia.articulo || {}
  const fechaFormateada = noticia.createdAt 
    ? new Date(noticia.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
    : (tarjeta.fecha || '')

  return (
    <div style={{
      backgroundImage: "url('/img/polkadots1.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%'
    }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card text-dark shadow-lg border-secondary p-4 p-md-5" style={{ backgroundColor: '#fff9c4' }}>

              <Link
                to="/blog"
                className="text-decoration-none fw-bold mb-3"
                style={{ color: '#5d4037' }}
              >
                ← Volver al blog
              </Link>

              {tarjeta.imagenPortada && (
                <img
                  src={tarjeta.imagenPortada}
                  alt={tarjeta.titulo}
                  className="w-100 rounded border border-secondary mb-4"
                  style={{ maxHeight: '600px', objectFit: 'cover' }}
                />
              )}

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-danger">{tarjeta.categoria || 'Blog'}</span>
                {fechaFormateada && <small className="text-muted">{fechaFormateada}</small>}
              </div>

              <h1 className="fw-bold">{tarjeta.titulo}</h1>
              <p className="text-muted">Por {tarjeta.autor || 'Equipo AnimeWord'}</p>
              <hr />

              {/* Introducción principal */}
              {articulo.introduccion && (
                <p className="lead fw-normal mb-4" style={{ lineHeight: '1.7' }}>
                  {articulo.introduccion}
                </p>
              )}

              {/* Secciones y Bloques dinámicos */}
              {articulo.secciones && articulo.secciones.map((sec, i) => {
                if (sec.tipo === 'subtitulo') {
                  return <h3 key={i} className="fw-bold mt-4 mb-3" style={{ color: '#5d4037' }}>{sec.contenido}</h3>
                } else if (sec.tipo === 'imagen') {
                  return (
                    <div key={i} className="my-4 text-center">
                      <img 
                        src={sec.contenido} 
                        alt={sec.caption || 'Imagen del artículo'} 
                        className="img-fluid rounded border border-secondary"
                        style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                      />
                      {sec.caption && <small className="d-block text-muted mt-2 italic">{sec.caption}</small>}
                    </div>
                  )
                } else {
                  return <p key={i} style={{ lineHeight: '1.7' }}>{sec.contenido}</p>
                }
              })}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticuloBlog