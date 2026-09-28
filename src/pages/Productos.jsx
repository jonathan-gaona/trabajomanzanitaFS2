import Card from '../components/cartas'
import { Link } from 'react-router-dom'
// Importamos los productos directamente desde tu carpeta Data
import productosJson from '../Data/productos.json'

function Productos({ onAgregarAlCarro, carrito }) {
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Catálogo de Productos</h1>
          <p>Explora y añade tus coleccionables favoritos. ꒰ঌ(˶ˆᗜˆ˵)໒꒱ .ᐟ.ᐟ</p>
        </div>

       
      </div>

      <hr className="border-secondary mb-4" />

      {/* Le pasamos los datos importados del JSON al componente Card */}
      <Card productos={productosJson} onAgregarAlCarro={onAgregarAlCarro} />
    </div>
  )
}

export default Productos