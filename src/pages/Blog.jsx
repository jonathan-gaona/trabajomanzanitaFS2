import '../index.css'

function Blog() {
    // Datos simulados de artículos de blog
    const posts = [
        {
            id: 1,
            titulo: "La vitrina de Carlos: De una figura a una colección épica",
            fecha: "12 de Octubre, 2026",
            categoria: "Comunidad",
            resumen: "Descubre cómo Carlos empezó con una pequeña figura de Demon Slayer y logró construir un santuario otaku en su hogar...",
            imagen: "/img/polkadotsblue.jpg"
        },
        {
            id: 2,
            titulo: "Guía definitiva: ¿Cómo identificar figuras 100% originales?",
            fecha: "05 de Octubre, 2026",
            categoria: "Guías",
            resumen: "Aprende a diferenciar los sellos de autenticidad de Good Smile Company y Bandai para evitar caer en réplicas chinas...",
            imagen: "/img/polkadotsblue.jpg"
        },
        {
            id: 3,
            titulo: "Cuidados esenciales: Limpieza de figuras de PVC",
            fecha: "28 de Septiembre, 2026",
            categoria: "Tips",
            resumen: "Te enseñamos los mejores trucos y productos para quitar el polvo y mantener la pintura intacta con el paso de los años...",
            imagen: "/img/polkadotsblue.jpg"
        }
    ];

    return (
        <div style={{
            backgroundImage: "url('/img/polkadots1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            width: '100%'
        }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        
                        <div className="card text-dark shadow-lg border-secondary p-4 p-md-5" style={{ backgroundColor: '#fff9c4' }}>
                            
                            <h1 className="text-center mb-3">
                                一୧ ‧₊˚⸝⸝.ᐟ⋆ Blog & Noticias AnimeWord
                            </h1>
                            <p className="text-center mb-4">
                                Explora nuestros últimos artículos, guías de coleccionismo y novedades del mundo otaku.
                            </p>

                            {/* GRILLA DE ARTÍCULOS DEL BLOG */}
                            <div className="row g-4">
                                {posts.map((post) => (
                                    <div className="col-12" key={post.id}>
                                        <div 
                                            className="card text-dark border-secondary p-4 shadow-sm"
                                            style={{
                                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('${post.imagen}')`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="badge bg-danger">{post.categoria}</span>
                                                <small className="text-muted">{post.fecha}</small>
                                            </div>
                                            
                                            <h4 className="fw-bold">{post.titulo}</h4>
                                            <p className="mb-3">{post.resumen}</p>
                                            
                                            {/* AQUÍ ESTÁ EL LINK QUE PIDE EL PROFE */}
                                            <div>
                                                <a 
                                                    href={`/blog/${post.id}`} /* Si usan React Router, aquí va un <Link to="..."> */
                                                    className="btn btn-sm px-4 fw-bold text-dark border-0 shadow-sm"
                                                    style={{ backgroundColor: '#fce4ec' }}
                                                >
                                                    Leer artículo completo →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div> 
    )
}

export default Blog