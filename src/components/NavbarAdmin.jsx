import { Link, useLocation } from 'react-router-dom'

function NavbarAdmin({ onLogout }) {
  const location = useLocation()

  return (
    <nav className="navbar navbar-expand-lg navbar-light px-4 shadow-sm w-100" style={{ backgroundColor: '#fce4ec' }}>
      <div className="container-fluid">
        <span className="navbar-brand text-uppercase fw-bold text-dark">Admin Panel</span>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#adminNavbarNav" 
          aria-controls="adminNavbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              {/* Cambiado a /admin/home para que coincida con tu Login y tu ruta de bienvenida */}
              <Link 
                to="/admin" 
                className={`nav-link fw-bold ${location.pathname === '/admin' ? 'text-dark text-decoration-underline' : 'text-secondary'}`}
              >
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/usuarios" 
                className={`nav-link fw-bold ${location.pathname === '/admin/usuarios' ? 'text-dark text-decoration-underline' : 'text-secondary'}`}
              >
                USUARIOS
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/productos" 
                className={`nav-link fw-bold ${location.pathname === '/admin/productos' ? 'text-dark text-decoration-underline' : 'text-secondary'}`}
              >
                PRODUCTOS
              </Link>
            </li>
            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              {/* Botón convertido en acción para limpiar el estado de admin y redirigir al Index */}
              <button 
                onClick={onLogout} 
                className="btn btn-dark btn-sm fw-bold border-0"
              >
                CERRAR SESIÓN
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavbarAdmin