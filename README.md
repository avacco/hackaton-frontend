# Clinica JuntoSalud <sub><sup><sub><sup><sub><sup>*No es un juego de palabras</sup></sub></sup></sub></sub></sup>

### Proyecto hecho para [Hackacode 2025](https://hackacode.todocodeacademy.com/).

Para utilizarlo necesitas del [backend](https://github.com/Luisezalazar/hackacode) preparado y funcionando.

## Inicio

Despues de clonar o descargar el proyecto, ejecuta:
```bash
npm install
```
En la carpeta raiz del proyecto.

Antes de iniciar el proyecto debes crear un archivo .env y definir una variable con este nombre:

```bash
VITE_API_ROUTE=http://localhost:8080
```
(localhost:8080 es un ejemplo. Debe apuntar a la dirección donde tengas subido el backend).

Hecho esto, inicia el proyecto con:

```bash
npm run dev
```

## Advertencias

El archivo vite.config.js fue modificado para aceptar certificados autofirmados con fines de demostración. Para que esto funcione, hay que además aceptar la dirección del backend en el navegador, que al estar su certificado autofirmado, este se considera inseguro.

Es recomendable eliminar las siguientes lineas de código si se quiere trabajar con HTTPS.

```bash
server: {
      https: {
        rejectUnauthorized: false
      }
    }
```
