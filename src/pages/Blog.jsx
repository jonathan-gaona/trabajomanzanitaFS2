import '../index.css'

function Blog() {
    
    return (
        /* AQUÍ ENVOLVEMOS TODO CON EL DIV DEL FONDO */
        <div style={{
            backgroundImage: "url('/img/polkadots1.jpg')", /* <--- ¡PON AQUÍ LA RUTA DE TU IMAGEN! */
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed', /* Hace que el fondo se quede quieto al hacer scroll */
            minHeight: '100vh', /* Asegura que cubra toda la altura de la pantalla */
            width: '100%'
        }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        
                        {/* Contenedor principal estilizado (Cambié text-light por text-dark para que se lea en el fondo amarillo) */}
                        <div className="card text-dark shadow-lg border-secondary p-4 p-md-5" style={{ backgroundColor: '#fff9c4' }}>
                            
                            <h1>
                                一୧ ‧₊˚⸝⸝.ᐟ⋆Blog & Community AnimeWord
                            </h1>
                            <p>
                                Conoce las experiencias de nuestros coleccionistas y resuelve tus dudas principales en un solo lugar.
                            </p>

                            {/* Botones de navegación interna (Anclajes rápidos) */}
                            <div className="d-flex justify-content-center gap-3 mb-5">
                                <a href="#casos-exito" className="btn btn-sm px-4 fw-bold text-dark border-0 shadow-sm"
                                style={{ backgroundColor: '#fce4ec' }}>
                                    Casos de Éxito
                                </a>
                                <a href="#preguntas-frecuentes" className="btn btn-sm px-4 fw-bold text-dark border-0 shadow-sm"
                                 style={{ backgroundColor: '#fce4ec' }}>
                                    Preguntas Frecuentes
                                </a>
                            </div>

                            {/* SECCIÓN 1: Casos de Éxito */}
                            <section id="casos-exito" className="mb-5 pt-3">
                                <h3>
                                    Casos de Éxito: Historias de nuestros Coleccionistas
                                </h3>

                                {/* CUADRO 1 CON IMAGEN DE FONDO */}
                                <div 
                                    className="card text-dark border-secondary p-4 mb-3"
                                    style={{
                                        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/img/polkadotsblue.jpg')",
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <h5 className="fw-bold">"La vitrina de Carlos: De una figura a una colección épica"</h5>
                                    <p className="fw-semibold">Cliente desde 2024</p>
                                    <p>
                                        Carlos nos contactó buscando su primera figura original de *Demon Slayer*. Hoy, un par de años y varias adquisiciones después, su estantería es un santuario completamente equipado. Nos alegra haberlo acompañado en cada preventa y entrega asegurando que cada caja llegara en estado de colección.
                                    </p>
                                </div>

                                {/* CUADRO 2 CON IMAGEN DE FONDO */}
                                <div 
                                    className="card text-dark border-secondary p-4"
                                    style={{
                                        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/img/polkadotsblue.jpg')",
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <h5 className="fw-bold">"El rincón otaku de Valentina y su set de coleccionista"</h5>
                                    <p className="fw-semibold">Cliente desde 2025</p>
                                    <p>
                                        Valentina necesitaba un regalo especial y terminó enamorándose de nuestras ediciones limitadas. Gracias a nuestra asesoría personalizada, logró conseguir piezas exclusivas de importación que creía imposibles de encontrar en Chile, con seguimiento en vivo de su envío.
                                    </p>
                                </div>
                            </section>

                           {/* SECCIÓN 2: Preguntas Frecuentes (FAQ) */}
                            <section id="preguntas-frecuentes" className="pt-3">
                                <h3>
                                    (˶˃𐃷˂˶) Preguntas Frecuentes
                                </h3>

                                <div className="mb-4">
                                    <h5 className="fw-bold">¿Las figuras y productos son 100% originales?</h5>
                                    <p className="text-dark">
                                        Absolutamente. Solo trabajamos con marcas y distribuidores oficiales de Japón (Good Smile Company, Kotobukiya, Bandai, entre otros). Cero imitaciones chinas o piratas.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold">¿Cómo se realizan los envíos a regiones?</h5>
                                    <p className="text-dark">
                                        Empacamos cada figura con múltiples capas de burbuja y cajas reinforced para evitar cualquier daño en las esquinas durante el transporte a lo largo de todo Chile.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold">¿Qué dominios aceptan para registrarse?</h5>
                                    <p className="text-dark">
                                        Por motivos de seguridad y validación interna de nuestro proyecto, permitimos registros utilizando correos institucionales de Duoc (`@duoc.cl`, `@profesor.duoc.cl`) y cuentas personales de `@gmail.com`.
                                    </p>
                                </div>
                            </section>

                            {/* Botón para volver arriba */}
                            <div className="mt-4 pt-3 border-top border-secondary text-center">
                                <a href="#" className="text-decoration-none small fw-bold"
                                style={{ color: '#000000' }}>
                                    ↑ Volver arriba
                                </a>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div> 
        /* CIERRE DEL DIV DE FONDO */
    )
}

export default Blog