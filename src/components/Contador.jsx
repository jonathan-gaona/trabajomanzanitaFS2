import { useState } from 'react'

function Contador({ cantidad, onCambiar, min = 1, max = 99 }) {
  const disminuir = () => {
    if (cantidad > min) onCambiar(cantidad - 1)
  }

  const aumentar = () => {
    if (cantidad < max) onCambiar(cantidad + 1)
  }

  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      <button
        type="button"
        onClick={disminuir}
        className="btn btn-outline-dark fw-bold"
        style={{ width: '36px', height: '36px', padding: 0, lineHeight: 1 }}
        disabled={cantidad <= min}
      >
        −
      </button>
      <span className="fw-bold" style={{ minWidth: '24px', textAlign: 'center' }}>
        {cantidad}
      </span>
      <button
        type="button"
        onClick={aumentar}
        className="btn btn-outline-dark fw-bold"
        style={{ width: '36px', height: '36px', padding: 0, lineHeight: 1 }}
        disabled={cantidad >= max}
      >
        +
      </button>
    </div>
  )
}

export default Contador