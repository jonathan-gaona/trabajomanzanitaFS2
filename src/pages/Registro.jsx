import { useState } from 'react'

function Registro() {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        confirmarCorreo: '',
        password: '',
        confirmarPassword: ''
    })

    const [errors, setErrors] = useState({})
    const [mensajeExito, setMensajeExito] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let nuevosErrores = {}

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es requerido.'
        } else if (formData.nombre.length > 100) {
            nuevosErrores.nombre = 'El nombre no puede superar los 100 caracteres.'
        }

        if (!formData.correo.trim()) {
            nuevosErrores.correo = 'El correo es requerido.'
        } else if (formData.correo.length > 100) {
            nuevosErrores.correo = 'El correo no puede superar los 100 caracteres.'
        } else {
            const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']
            const esValido = dominiosValidos.some(dominio => formData.correo.endsWith(dominio))
            if (!esValido) {
                nuevosErrores.correo = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.'
            }
        }


        if (!formData.confirmarCorreo.trim()) {
            nuevosErrores.confirmarCorreo = 'Debe confirmar el correo electrónico.'
        } else if (formData.correo !== formData.confirmarCorreo) {
            nuevosErrores.confirmarCorreo = 'Los correos electrónicos no coinciden.'
        }


        if (!formData.password) {
            nuevosErrores.password = 'La contraseña es requerida.'
        } else if (formData.password.length < 4 || formData.password.length > 10) {
            nuevosErrores.password = 'La contraseña debe tener entre 4 y 10 caracteres.'
        }   


        if (!formData.confirmarPassword) {
            nuevosErrores.confirmarPassword = 'Debe confirmar la contraseña.'
        } else if (formData.password !== formData.confirmarPassword) {
            nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.'
        }

        setErrors(nuevosErrores)

        if (Object.keys(nuevosErrores).length === 0) {
            setMensajeExito(true)

            const { confirmarCorreo, confirmarPassword, ...datosParaEnviar } = formData

            console.log('JSON resultante listo para enviar (sin confirmaciones):', datosParaEnviar)
        } else {
            setMensajeExito(false)
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-lg border-secondary p-4" style={{ backgroundColor: '#fce4ec' }}>
                        <h2 className="text-center fw-bold mb-4" style={{ color: '#5d4037' }}>Registro de Usuario</h2>

                        {mensajeExito && (
                            <div className="alert alert-success text-center" role="alert">
                                ¡Validación exitosa! Los datos cumplen con todas las reglas.
                            </div>
                        )}
                        <form onSubmit={handleSubmit} noValidate>
                            
                            {/* Campo Nombre */}
                            <div className="mb-3">
                                <label className="form-label fw-bold" style={{ color: '#5d4037' }}>Nombre</label>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`form-control border-secondary ${errors.nombre ? 'is-invalid' : ''}`}
                                    placeholder="Ingresa tu nombre (máx 100 caracteres)"
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                            </div>

                            {/* Campo Correo */}
                            <div className="mb-3">
                                <label className="form-label fw-bold" style={{ color: '#5d4037' }}>Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className={`form-control border-secondary ${errors.correo ? 'is-invalid' : ''}`}
                                    placeholder="usuario@duoc.cl o @gmail.com"
                                />
                                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                            </div>

                            {/* Campo Confirmar Correo */}
                            <div className="mb-3">
                                <label className="form-label fw-bold" style={{ color: '#5d4037' }}>Confirmar Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    name="confirmarCorreo"
                                    value={formData.confirmarCorreo}
                                    onChange={handleChange}
                                    className={`form-control border-secondary ${errors.confirmarCorreo ? 'is-invalid' : ''}`}
                                    placeholder="Repite tu correo"
                                />
                                {errors.confirmarCorreo && <div className="invalid-feedback">{errors.confirmarCorreo}</div>}
                            </div>

                            {/* Campo Contraseña */}
                            <div className="mb-3">
                                <label className="form-label fw-bold" style={{ color: '#5d4037' }}>Contraseña (4 a 10 caracteres)</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-control border-secondary ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="********"
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>

                            {/* Campo Confirmar Contraseña */}
                            <div className="mb-4">
                                <label className="form-label fw-bold" style={{ color: '#5d4037' }}>Confirmar Contraseña</label>
                                <input 
                                    type="password" 
                                    name="confirmarPassword"
                                    value={formData.confirmarPassword}
                                    onChange={handleChange}
                                    className={`form-control border-secondary ${errors.confirmarPassword ? 'is-invalid' : ''}`}
                                    placeholder="Repite tu contraseña"
                                />
                                {errors.confirmarPassword && <div className="invalid-feedback">{errors.confirmarPassword}</div>}
                            </div>

                            {/* Botón */}
                            <button 
                                type="submit" 
                                className="btn w-100 text-white fw-bold py-2" 
                                style={{ backgroundColor: '#5d4037', border: '1px solid #fce4ec' }}
                            >
                                Registrar
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registro