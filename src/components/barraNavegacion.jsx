import { NavLink, Link } from 'react-router-dom'

function Navbar({ carrito = [] }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#fce4ec' }}>
    <div className="container-fluid">
        
        {/* AQUÍ ESTÁ EL LOGO INTEGRADO CON TU TEXTO */}
        <NavLink className="navbar-brand d-flex align-items-center text-dark fw-bold" to="/">
            <img 
                src="/img/logoPAGINA.jpg" /* <--- ¡CAMBIA ESTO POR EL NOMBRE DE TU IMAGEN! */
                alt="Logo" 
                width="40" 
                height="40" 
                className="d-inline-block align-text-top me-2 rounded-circle" 
            />
            AnimeWord
        </NavLink>

        <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => isActive ? 'nav-link active text-dark fw-bold' : 'nav-link text-dark'} 
                        aria-current="page" 
                        to="/"
                    >
                        Index
                    </NavLink>
                </li>
                
                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => isActive ? 'nav-link active text-dark fw-bold' : 'nav-link text-dark'} 
                        to="/nosotros"
                    >
                        Nosotros
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => isActive ? 'nav-link active text-dark fw-bold' : 'nav-link text-dark'} 
                        to="/Ventas"
                    >
                        Productos
                    </NavLink>
                </li>
                
                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => isActive ? 'nav-link active text-dark fw-bold' : 'nav-link text-dark'} 
                        to="/Login"
                    >
                        Login
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => isActive ? 'nav-link active text-dark fw-bold' : 'nav-link text-dark'} 
                        to="/Contacto"
                    >
                        Contactanos
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => isActive ? 'nav-link active text-dark fw-bold' : 'nav-link text-dark'} 
                        to="/Blog"
                    >
                        Blog
                    </NavLink>
                </li>
            </ul>

            {/* Carrito visible en todas las páginas */}
            <Link 
              to="/carrito" 
              className="btn fw-bold text-dark position-relative shadow-sm"
              style={{ backgroundColor: '#bde0fe' }}
            >
              🛒 Ver Carrito
              {carrito.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {carrito.length}
                </span>
              )}
            </Link>
        </div>
    </div>
    </nav>
  )
}

export default Navbar