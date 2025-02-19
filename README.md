# Clinica JuntoSalud <sub><sup><sub><sup><sub><sup>*No es un juego de palabras</sup></sub></sup></sub></sub></sup>

### Proyecto hecho para [Hackacode 2025](https://hackacode.todocodeacademy.com/).

Para utilizarlo necesitas del [backend](https://github.com/Luisezalazar/hackacode) preparado y funcionando.

## Inicio

Antes de empezar debes crear un archivo .env y definir una variable con este nombre:

```bash
VITE_API_ROUTE=http://localhost:8080
```
(localhost:8080 es un ejemplo. Debe apuntar a la dirección donde tengas subido el backend.)

Hecho esto, inicia el proyecto con:

```bash
npm run dev
```

## Advertencias

El archivo vite.config.js fue modificado para aceptar certificados autofirmados con fines de demostración. Es recomendable eliminar las siguientes lineas de código si se quiere trabajar con HTTPS.

```bash
server: {
      https: {
        rejectUnauthorized: false
      }
    }
```