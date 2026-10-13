import { useState, useEffect } from 'react'
import '../index.css'
import CartasBlog from '../components/cartasBlog'
import { noticiaApi } from '../Data/ConexionBlog'

function Blog() {
    const [noticias, setNoticias] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarPublicaciones = async () => {
            try {
                setLoading(true)
                const datos = await noticiaApi.getNoticias()
                setNoticias(datos || [])
            } catch (error) {
                console.error('Error al cargar las publicaciones del blog:', error)
                setNoticias([])
            } finally {
                setLoading(false)
            }
        }

        cargarPublicaciones()
    }, [])

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

                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-dark" role="status">
                                        <span className="visually-hidden">Cargando publicaciones...</span>
                                    </div>
                                </div>
                            ) : (
                                <CartasBlog posts={noticias} />
                            )}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog