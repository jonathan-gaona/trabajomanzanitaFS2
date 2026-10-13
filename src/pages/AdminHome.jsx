import { Link } from 'react-router-dom'

function AdminHome() {
  return (
    <div className="container py-5">
      {/* Banner de Bienvenida */}
      <div className="p-4 mb-5 text-center bg-light rounded-3 border shadow-sm" style={{ backgroundColor: '#fce4ec' }}>
        <h1 className="display-5 fw-bold text-dark">Panel de Control - AnimeWord</h1>
        <p className="col-md-8 fs-5 mx-auto text-muted">
          Bienvenido, Administrador. Selecciona una sección para comenzar a gestionar el sistema de forma rápida y directa.
        </p>
      </div>

      {/* Tarjetas / Botones de Navegación Rápida */}
      <div className="row g-4">
        {/* Gestión de Usuarios */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-secondary text-center p-3" style={{ backgroundColor: '#fff0f3' }}>
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h3 className="mb-3">👥</h3>
                <h5 className="fw-bold text-dark">Usuarios</h5>
                <p className="small text-muted">Gestiona los usuarios registrados, roles y permisos.</p>
              </div>
              <Link to="/admin/usuarios" className="btn btn-dark fw-bold mt-3">
                Ir a Usuarios
              </Link>
            </div>
          </div>
        </div>

        {/* Gestión de Inventario */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-secondary text-center p-3" style={{ backgroundColor: '#fff0f3' }}>
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h3 className="mb-3">📦</h3>
                <h5 className="fw-bold text-dark">Inventario</h5>
                <p className="small text-muted">Controla productos, precios, categorías y stock disponible.</p>
              </div>
              <Link to="/admin/inventario" className="btn btn-dark fw-bold mt-3">
                Ir a Inventario
              </Link>
            </div>
          </div>
        </div>

        {/* Gestión de Blog / Noticias */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-secondary text-center p-3" style={{ backgroundColor: '#fff0f3' }}>
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h3 className="mb-3">📰</h3>
                <h5 className="fw-bold text-dark">Blog</h5>
                <p className="small text-muted">Administra las noticias y publicaciones para la comunidad.</p>
              </div>
              <Link to="/admin/noticias" className="btn btn-dark fw-bold mt-3">
                Ir al Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Gestión de Boletas / Pedidos */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-secondary text-center p-3" style={{ backgroundColor: '#fff0f3' }}>
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h3 className="mb-3">📄</h3>
                <h5 className="fw-bold text-dark">Boletas</h5>
                <p className="small text-muted">Revisa las transacciones, boletas y pedidos realizados.</p>
              </div>
              <Link to="/admin/boletas" className="btn btn-dark fw-bold mt-3">
                Ir a Boletas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome