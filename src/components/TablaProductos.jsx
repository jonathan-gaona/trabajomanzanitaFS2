export const formatear = (n) => `$ ${Number(n).toLocaleString('es-CL')}`

// Asegura que la ruta de la imagen sea absoluta: "img/x.jpg" -> "/img/x.jpg"
const rutaImagen = (ruta = '') =>
  ruta.startsWith('/') || ruta.startsWith('http') ? ruta : `/${ruta}`

// Tabla Imagen | Nombre | Precio | Cantidad | Subtotal
// Si le pasas onEliminar, agrega una columna con botón "Eliminar" (solo para el carrito).
function TablaProductos({ items = [], onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0" style={{ '--bs-table-bg': 'transparent' }}>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            {onEliminar && <th className="d-print-none"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.id}-${index}`}>
              <td>
                <img
                  src={rutaImagen(item.imagen)}
                  alt={item.nombre}
                  style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }}
                />
              </td>
              <td className="fw-semibold">{item.nombre}</td>
              <td>{formatear(item.precio)}</td>
              <td>{item.cantidad}</td>
              <td>{formatear(item.precio * item.cantidad)}</td>
              {onEliminar && (
                <td className="d-print-none">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => onEliminar(index)}>
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaProductos