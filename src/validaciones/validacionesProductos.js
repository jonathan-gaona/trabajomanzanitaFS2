export const validarProducto = (formData) => {
  if (!formData.nombre || !formData.nombre.trim()) {
    return 'El nombre del producto es obligatorio.'
  }
  if (!formData.precio || isNaN(formData.precio) || Number(formData.precio) <= 0) {
    return 'El precio debe ser un número mayor a 0.'
  }
  if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
    return 'El stock debe ser un número válido (0 o mayor).'
  }
  if (!formData.categoria) {
    return 'Debes seleccionar una categoría.'
  }
  if (!formData.cBarras || !formData.cBarras.trim()) {
    return 'El código de barras (cBarras) es obligatorio.'
  }
  if (!formData.imagen || !formData.imagen.trim()) {
    return 'Debes arrastrar o seleccionar una imagen para el producto.'
  }
  return null 
}

export const validarCategoria = (nombreCategoria) => {
  if (!nombreCategoria || !nombreCategoria.trim()) {
    return 'El nombre de la categoría no puede estar vacío.'
  }
  return null
}