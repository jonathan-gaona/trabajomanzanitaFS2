import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Plugin personalizado para guardar imágenes físicas en public/img/productos durante el desarrollo
const guardarImagenPlugin = () => {
  return {
    name: 'guardar-imagen-local',
    configureServer(server) {
      server.middlewares.use('/api/upload-image', (req, res) => {
        if (req.method === 'POST') {
          let body = []
          req.on('data', chunk => body.push(chunk))
          req.on('end', () => {
            const buffer = Buffer.concat(body)
            const data = JSON.parse(buffer.toString())
            
            const nombreArchivo = data.nombre.replace(/[^a-zA-Z0-9_.-]/g, '_')
            const rutaDestino = path.resolve(import.meta.dirname, 'public/img/productos', nombreArchivo)

            // Limpiar la cabecera data:image/...;base64,
            const base64Data = data.imagenBase64.replace(/^data:image\/\w+;base64,/, '')
            const bufferImagen = Buffer.from(base64Data, 'base64')

            fs.writeFile(rutaDestino, bufferImagen, (err) => {
              if (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: false, error: err.message }))
              } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, path: `/img/productos/${nombreArchivo}` }))
              }
            })
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), guardarImagenPlugin()],
})