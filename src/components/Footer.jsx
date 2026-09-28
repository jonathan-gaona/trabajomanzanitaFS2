function Footer() {
  return (
    <footer className="text-dark py-4 mt-5 border-top border-secondary" style={{ backgroundColor: '#fff9c4' }}>
      <div className="container text-center text-md-start">
        <div className="row align-items-center">
          
          {/* Nombre de la empresa y derechos */}
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <h6 className="fw-bold text-dark mb-1">AnimeWord</h6>
            <p className="text-dark small mb-0">
              © {new Date().getFullYear()} Todos los derechos reservados.
            </p>
          </div>

          {/* Información de contacto directa */}
          <div className="col-12 col-md-6 text-md-end">
            <p className="text-dark small mb-1">
              Contacto: <a href="mailto:contacto@miproyecto.com" className="text-dark fw-semibold text-decoration-none">contacto@miproyecto.com</a>
            </p>
            <p className="text-dark small mb-0">
              Teléfono: <span className="text-dark fw-semibold">+56 9 1234 5678</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer