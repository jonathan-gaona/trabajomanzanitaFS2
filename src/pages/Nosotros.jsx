function Nosotros() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    
                    {/* Tarjeta principal del Blog */}
                    <div className="card text-dark shadow-lg border-secondary p-4 p-md-5" style={{ backgroundColor: '#fce4ec' }}>
                        
                        {/* Cabecera del artículo */}
                        <span className="badge bg-dark border border-secondary text-white-50 align-self-start mb-3 px-3 py-2">
                            
                            Nuestra Historia • 2026
                        </span>
                        
                        <h1>
                            Del estante a tus manos: El nuevo capítulo de AnimeWord
                        </h1>

                        {/* Imagen destacada simulada */}
                        <div className="p-5 rounded-3 text-center border border-secondary mb-4" 
                             style={{ backgroundColor: '#fce4ec', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img 
                src="/img/mikuparaponerahi.jpg"
                alt="Banner principal"
                className="img-fluid rounded-3 shadow-sm"
                style={{ maxHeight: '250px', objectFit: 'cover' }}
              />
                        </div>

                        {/* Cuerpo de la historia inspiradora */}
                        <div className="text-dark-50 fs-6 lh-lg">
                            <p className="mb-4">
                                Todo comenzó en una pequeña habitación iluminada por luces LED, rodeados de cajas y el sueño compartido de traer un pedazo de Japón directamente a nuestras vitrinas. Lo que empezó como un proyecto entre amigos coleccionistas apasionados por las figuras de alta calidad, hoy se ha convertido en AnimeWord un refugio para todos los que vivimos y sentimos esta cultura.
                            </p>
                            
                            <h4 >¿Por qué dar el salto hacia los mangas?</h4>
                            <p className="mb-4">
                                Una figura estática captura el momento cumbre de una pelea, la emoción de una despedida o la sonrisa de un protagonista. Sin embargo, nos dimos cuenta de que faltaba algo: el origen de todo. Queremos que experimentes la narrativa completa, desde la primera página en blanco y negro trazada por el mangaka hasta el volumen impreso que descansa en tu mesa de noche.
                            </p>

                            <p className="mb-4">
                                Muy pronto, nuestra tienda no solo albergará las mejores ediciones de coleccionismo, sino también los tomos que dieron vida a esas mismas historias. Queremos ser el puente entre las viñetas que te hicieron suspirar y las figuras que decoran tu espacio diario.
                            </p>

                            <div className="p-3 border-start border-4 border-light bg-dark rounded-end my-4 text-light fst-italic">
                                "Un buen manga te cuenta la historia; una buena figura te permite vivirla en tu estante. Ahora tendrás ambas en un solo lugar."
                            </div>

                            <p>
                                Gracias por ser parte de esta comunidad que no deja de crecer. Esto es apenas el inicio del viaje, y nos emociona enormemente dar este nuevo paso con ustedes a nuestro lado. ¡Sigamos coleccionando momentos épicos!
                            </p>
                        </div>

                        {/* Pie de artículo / Volver */}
                        <div className="mt-5 pt-3 border-top border-secondary text-center">
                            <a href="/home" className="btn btn-outline-dark btn-sm px-4">
                                ← Volver al inicio
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Nosotros