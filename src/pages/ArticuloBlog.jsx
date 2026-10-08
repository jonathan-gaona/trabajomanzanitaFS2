import { useParams, Link } from 'react-router-dom'
import { posts } from '../Data/posts'

function ArticuloBlog() {
  const { id } = useParams()
  const post = posts.find((p) => p.id === Number(id))

  // Si alguien entra a /blog/999, mostramos un mensaje
  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h2>Artículo no encontrado</h2>
        <Link to="/blog" className="btn btn-outline-dark mt-3">
          ← Volver al blog
        </Link>
      </div>
    )
  }

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

              <img
                src={post.imagen}
                alt={post.titulo}
                className="w-100 rounded border border-secondary mb-4"
                style={{ height: '250px', objectFit: 'cover' }}
              />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-danger">{post.categoria}</span>
                <small className="text-muted">{post.fecha}</small>
              </div>

              <h1 className="fw-bold">{post.titulo}</h1>
              <p className="text-muted">Por {post.autor}</p>
              <hr />

              {post.contenido.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticuloBlog