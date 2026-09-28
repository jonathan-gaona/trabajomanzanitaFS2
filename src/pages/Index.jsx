import { useNavigate } from 'react-router-dom'
import Card from '../components/cartas.jsx'
import Hero from '../components/Hero.jsx'
// Importamos el JSON centralizado de productos
import productosJson from '../Data/productos.json'

function Index({ onAgregarAlCarro }) {
    const navigate = useNavigate()
    
    // Si quieres mostrar solo los primeros 3 productos destacados en el Index, 
    // puedes usar .slice(0, 3). Si quieres mostrarlos todos, borras el .slice()
    const productosDestacados = productosJson.slice(0, 3)
    
    return(    
      <div className="container py-4">
        <Hero />
        
        <h3 className="mb-4">.⊹˖ᯓ★. ݁₊ Nuestros Productos</h3>
        
        {/* Le pasamos los datos del JSON y la función para agregar al carro */}
        <Card productos={productosDestacados} onAgregarAlCarro={onAgregarAlCarro} />
      </div>
    )
}

export default Index