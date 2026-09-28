import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import usuariosJson from '../Data/user.json'

function Login({ onLogin }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        correo: '',
        password: ''
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

        if (!formData.correo.trim()) {
            nuevosErrores.correo = 'El correo es requerido.'
        }
        if (!formData.password) {
            nuevosErrores.password = 'La contraseña es requerida.'
        }

        if (Object.keys(nuevosErrores).length === 0) {

            const usuarioEncontrado = usuariosJson.find(
                u => u.correo.toLowerCase() === formData.correo.toLowerCase() && u.password === formData.password
            )

            if (!usuarioEncontrado) {
                nuevosErrores.correo = 'Correo o contraseña incorrectos, o el usuario no está registrado.'
            } else {
                
                const esAdmin = usuarioEncontrado.correo.endsWith('@profesor.duoc.cl')

                setMensajeExito(true)
                
                if (onLogin) {
                    onLogin(esAdmin)
                }
                
                setTimeout(() => {
                    if (esAdmin) {
                        navigate('/admin')
                    } else {
                        navigate('/')
                    }
                }, 1500)
            }
        }

        setErrors(nuevosErrores)
        if (Object.keys(nuevosErrores).length > 0) {
            setMensajeExito(false)
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 text-center">
                    
                    <div className="mb-3 d-flex justify-content-center">
                        <img 
                            src="/img/logoPAGINA.jpg"
                            alt="Logo AnimeWord"
                            className="rounded-circle shadow-sm"
                            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                        />
                    </div>
                    
                    <h3 className="text-dark fw-bold mb-4">AnimeWord</h3>

                    <div className="card shadow-lg border-secondary text-start" style={{ backgroundColor: '#fce4ec' }}>
                        
                        <div className="card-header text-white fw-bold border-secondary py-2 text-uppercase" style={{ backgroundColor: '#5d4037' }}>
                            inicio de sesión
                        </div>

                        <div className="card-body p-4">
                            {mensajeExito && (
                                <div className="alert alert-success text-center" role="alert">
                                    ¡Inicio de sesión exitoso! Redirigiendo...
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                
                                <div className="mb-3">
                                    <label className="form-label text-uppercase small fw-bold" style={{ color: '#5d4037' }}>Correo</label>
                                    <input 
                                        type="email" 
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        className={`form-control border-secondary ${errors.correo ? 'is-invalid' : ''}`}
                                        placeholder="ejemplo@duoc.cl"
                                    />
                                    {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-uppercase small fw-bold" style={{ color: '#5d4037' }}>Contraseña</label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`form-control border-secondary ${errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Tu contraseña"
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                <div className="d-flex justify-content-center mb-3">
                                    <button 
                                        type="submit" 
                                        className="btn text-white fw-bold px-5 py-2 w-50" 
                                        style={{ backgroundColor: '#5d4037', border: '1px solid #fce4ec' }}
                                    >
                                        Iniciar sesión
                                    </button>
                                </div>

                                <div className="text-center mt-4 border-top pt-3 border-secondary-subtle">
                                    <p className="small mb-1 text-muted">¿No tienes una cuenta todavía?</p>
                                    <Link to="/Registro" className="fw-bold text-decoration-none" style={{ color: '#5d4037' }}>
                                        Regístrate aquí
                                    </Link>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login