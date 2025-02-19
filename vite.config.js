import react from '@vitejs/plugin-react'

export default {
  plugins: [react()],
  build: {

    /** If you set esmExternals to true, this plugins assumes that 
      all external dependencies are ES modules */
  
    commonjsOptions: {
       esmExternals: true 
    },
    // Configuracion peligrosa, existe solo para demostracion. Desactiva la verificacion de certificados.
    server: {
      https: {
        rejectUnauthorized: false
      }
    }
  }}