import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Público
import Navbar from './components/barraNavegacion.jsx'
import Footer from './components/Footer.jsx'
import Index from './pages/Index.jsx'
import Nosotros from './pages/Nosotros'
import Ventas from './pages/Productos.jsx'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Blog from './pages/Blog'
import ArticuloBlog from './pages/ArticuloBlog.jsx'
import Contacto from './pages/Contacto'
import Carrito from './pages/Carrito'
import ResultadoPago from './pages/ResultadoPago.jsx'
import DetalleProducto from './pages/DetalleProducto.jsx'
// Admin
import GestionInventario from './pages/GestionInventario.jsx'
import NavbarAdmin from './components/NavbarAdmin.jsx'
import AdminHome from './pages/AdminHome'
import AdminUser from './pages/AdminUser'    
import GestionNoticia from './pages/GestionNoticia.jsx'

function MainLayout({ carrito, agregarAlCarro, eliminarDelCarro, vaciarCarrito, usuario, setUsuario }) {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isAdmin = usuario?.rol === 'administrador'
  const esAdmin = isAdmin || location.pathname.startsWith('/admin')

  const estatusGeneral = {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }

  const handleLogout = () => {
    setUsuario(null)        // Limpia la información del usuario
    navigate('/')           // Redirige inmediatamente al Index
  }

  return (
    <div style={estatusGeneral}>
      <div className="d-print-none">
        {esAdmin ? <NavbarAdmin onLogout={handleLogout} /> : <Navbar carrito={carrito} />}
      </div>

      <main className="container pt-4" style={{ flexGrow: 1 }}>
        <Routes>
          {/* Rutas de Administrador */}
          <Route path="/admin" element={isAdmin ? <AdminHome /> : <Navigate to="/Login" replace />} />
          <Route path="/admin/usuarios" element={isAdmin ? <AdminUser /> : <Navigate to="/Login" replace />} />
          <Route path="/admin/inventario" element={isAdmin ? <GestionInventario/> : <Navigate to="/Login" replace />} />
          <Route path="/admin/noticias" element={isAdmin? <GestionNoticia/>:<Navigate to= "/Login" replace/>}/>
          {/* Rutas generales */}
          <Route path="/producto/:id" element={<DetalleProducto onAgregarAlCarro={agregarAlCarro} />} />
          <Route path="/" element={<Index onAgregarAlCarro={agregarAlCarro} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/Ventas" element={<Ventas onAgregarAlCarro={agregarAlCarro} carrito={carrito} />} />
          <Route path="/Carrito" element={<Carrito carrito={carrito} onEliminarDelCarro={eliminarDelCarro} />} />
          <Route path="/resultado-pago" element={<ResultadoPago onVaciarCarrito={vaciarCarrito} />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Login" element={<Login onLogin={(datosUsuario) => setUsuario(datosUsuario)} />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/Blog/:id" element={<ArticuloBlog />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </main>

      <div className="d-print-none">
        <Footer />
      </div>
    </div>
  )
}

function App() {
  const [carrito, setCarrito] = useState([])
  const [usuario, setUsuario] = useState(null) // Guardará el objeto completo del usuario autenticado

  const agregarAlCarro = (producto, cantidad = 1) => {
    setCarrito((prevCarrito) => {
      const existente = prevCarrito.find((item) => item.id === producto.id)

      if (existente) {
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }

      return [...prevCarrito, { ...producto, cantidad }]
    })
  }

  const eliminarDelCarro = (indexParaBorrar) => {
    setCarrito((prev) => prev.filter((_, index) => index !== indexParaBorrar))
  }

  const vaciarCarrito = () => setCarrito([])

  return (
    <MainLayout 
      carrito={carrito} 
      agregarAlCarro={agregarAlCarro} 
      eliminarDelCarro={eliminarDelCarro}
      vaciarCarrito={vaciarCarrito}
      usuario={usuario}
      setUsuario={setUsuario}
    />
  )
}

export default App