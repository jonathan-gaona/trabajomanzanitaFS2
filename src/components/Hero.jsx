import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="p-5 mb-4 rounded-3 border border-secondary shadow-lg" style={{ backgroundColor: '#fff9c4' }}>
      <div className="container-fluid py-3">
        <div className="row align-items-center">
          
          {/* Texto y botón de acción a la izquierda */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1>⋆｡‧˚ʚ♡ɞ TIENDA ONLINE</h1>
            
            {/* CAMBIO 1: Cambiamos text-white-50 por text-dark para que sea negro */}
            <p className="col-md-10 text-dark fs-6 mb-4">
              Descubre nuestra selección exclusiva. (..◜ᴗ◝..) Explora las novedades y encuentra justo lo que buscas con la mejor calidad.
            </p>
            
            {/* CAMBIO 2: Agregamos el color celeste pastel (#bde0fe) al fondo del botón */}
            <Link 
                to="/Ventas" 
                className="btn btn-lg px-4 fw-bold text-dark shadow-sm" 
                style={{ backgroundColor: '#bde0fe' }}
            >
              Ver productos
            </Link>
          </div>

          {/* Banner o imagen destacada a la derecha */}
          <div className="col-lg-6">
            <div className="p-4 rounded-3 text-center border border-secondary" 
            style={{ backgroundColor: '#fce4ec', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/img/mikuparaponerahi.jpg" /* <--- ¡CAMBIA ESTO POR LA RUTA DE TU IMAGEN! */
                alt="Banner principal"
                className="img-fluid rounded-3 shadow-sm"
                style={{ maxHeight: '250px', objectFit: 'cover' }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero