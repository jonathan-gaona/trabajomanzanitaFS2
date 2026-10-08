import { Link } from 'react-router-dom'

function CartasBlog({ posts }) {
  return (
    <div className="row">
      {posts.map((post) => (
        <div
          className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
          key={post.id}
        >
          <div
            className="card border-secondary shadow-sm w-100"
            style={{ maxWidth: '22rem', backgroundColor: '#fce4ec' }}
          >
            <img
              src={post.imagen}
              className="card-img-top border-bottom border-secondary"
              alt={post.titulo}
              style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }}
            />

            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-danger">{post.categoria}</span>
                <small className="text-muted">{post.fecha}</small>
              </div>

              <h5 className="fw-bold">{post.titulo}</h5>
              <p>{post.resumen}</p>

              <div className="mt-auto">
                <Link
                  to={`/blog/${post.id}`}
                  className="btn w-100 fw-bold py-2 btn-outline-dark"
                  style={{ borderColor: '#5d4037', color: '#5d4037' }}
                >
                  Leer artículo completo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartasBlog