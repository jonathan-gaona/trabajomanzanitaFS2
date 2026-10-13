import { useState, useEffect } from 'react'
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
import BoletasAdmind  from './pages/BoletasAdmind.jsx'

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
    // Limpiamos el estado y también el localStorage al cerrar sesión
    setUsuario(null)
    localStorage.removeItem('usuarioLogueado')
    navigate('/')
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
          <Route path="/admin/boletas" element={isAdmin? <BoletasAdmind/>:<Navigate to= "/Login" replace/>}/>
          {/* Rutas generales */}
          <Route path="/producto/:id" element={<DetalleProducto onAgregarAlCarro={agregarAlCarro} />} />
          <Route path="/" element={<Index onAgregarAlCarro={agregarAlCarro} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/Ventas" element={<Ventas onAgregarAlCarro={agregarAlCarro} carrito={carrito} />} />
          <Route path="/Carrito" element={<Carrito carrito={carrito} onEliminarDelCarro={eliminarDelCarro} usuarioLogueado={usuario} />} />
          <Route path="/resultado-pago" element={<ResultadoPago onVaciarCarrito={vaciarCarrito} usuarioLogueado={usuario} />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Login" element={<Login onLogin={(datosUsuario) => {
            setUsuario(datosUsuario)
            localStorage.setItem('usuarioLogueado', JSON.stringify(datosUsuario))
          }} />} />
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
  
  // Inicializamos el estado del usuario leyendo directamente de localStorage para evitar que se pierda al recargar
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuarioLogueado')
      return guardado ? JSON.parse(guardado) : null
    } catch (e) {
      console.error("Error al leer localStorage:", e)
      return null
    }
  })

  const agregarAlCarro = (producto, cantidad = 1) => {
    const idProducto = producto.cBarras || producto.Cbarras || producto.codigoBarras || producto.id || producto.nombre

    setCarrito((prevCarrito) => {
      const existente = prevCarrito.find((item) => {
        const itemId = item.cBarras || item.Cbarras || item.codigoBarras || item.id || item.nombre
        return itemId === idProducto
      })

      const stockDisponible = Number(producto.stock) || 0

      if (existente) {
        const cantidadActualEnCarro = existente.cantidad
        const nuevaCantidadTotal = cantidadActualEnCarro + cantidad

        if (nuevaCantidadTotal > stockDisponible) {
          alert(`No puedes agregar más unidades. El stock máximo disponible es ${stockDisponible}.`)
          return prevCarrito
        }

        return prevCarrito.map((item) => {
          const itemId = item.cBarras || item.Cbarras || item.codigoBarras || item.id || item.nombre
          return itemId === idProducto
            ? { ...item, cantidad: nuevaCantidadTotal }
            : item
        })
      }

      if (cantidad > stockDisponible) {
        alert(`Stock insuficiente. Solo quedan ${stockDisponible} unidades disponibles.`)
        return prevCarrito
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