# Cómo poner esto a andar

Este proyecto ya no es un solo archivo HTML — es una app de Next.js, porque
para que cualquiera con el link pueda subir canciones y fotos (y que se vean
igual para todos), se necesita un servidor y una base de datos, no solo
archivos estáticos.

## 1. Reemplaza el contenido de tu repo de GitHub

Borra lo que tenías antes (el `index.html` suelto y la carpeta `Assets`) y
sube TODO el contenido de esta carpeta en su lugar, manteniendo la misma
estructura (`app/`, `public/`, `package.json`, etc. en la raíz del repo).

## 2. Mueve tu canción y portada actuales

Copia tu `how-much-longer.mp3` y `portada.jpg` (los que ya tenías) dentro de
la carpeta `public/assets/` de este proyecto, con esos mismos nombres. Así la
canción "How Much Longer?" sigue apareciendo aunque nadie la haya subido por
el formulario.

Si tienes más canciones que agregaste directo en el código (como "Give Me a
Sign"), tienes dos opciones:
- Súbelas también a mano con el mismo método (agregando un bloque a
  `STATIC_TRACKS` en `app/page.js` y poniendo sus archivos en
  `public/assets/`), o
- Simplemente súbelas usando el nuevo formulario de "Subir canción" una vez
  que el sitio esté funcionando — es más fácil.

## 3. En Vercel: activa Blob y KV

Esto es lo que le da el "guardado real" a la app.

1. Entra a tu proyecto en vercel.com.
2. Ve a la pestaña **Storage**.
3. Crea un **Blob store** (para guardar los archivos de audio/fotos) y
   conéctalo a este proyecto.
4. Crea también un **KV store** (o "Vercel KV", según cómo se llame en tu
   panel) y conéctalo igual a este proyecto.
5. Al conectarlos, Vercel agrega las variables de entorno necesarias
   automáticamente (`BLOB_READ_WRITE_TOKEN`, `KV_REST_API_URL`,
   `KV_REST_API_TOKEN`, etc.) — no necesitas escribir nada a mano.

## 4. Vuelve a desplegar

Cuando subas los archivos nuevos a GitHub, Vercel va a detectar que ahora es
un proyecto Next.js (Framework Preset: Next.js) automáticamente y lo va a
desplegar como tal. Si por alguna razón no lo detecta solo, ve a
**Project Settings → General → Framework Preset** y selecciónalo
manualmente.

## 5. Prueba

- Entra a tu URL de Vercel. Deberías ver las pestañas "Música" y "Fotos"
  arriba.
- Prueba subir una foto de prueba, o una canción, desde el botón de "+".
- Si algo falla al subir, la app te va a mostrar un mensaje de error abajo
  del formulario — normalmente significa que Blob o KV no están bien
  conectados todavía (paso 3).

## Formato de la letra al subir una canción

En el cuadro de texto de letra, una línea por verso, así:

```
14|Lo intento tanto
17|¿Te he asustado?
```

El número de la izquierda es el segundo exacto en que empieza esa línea en
la canción (lo sacas escuchando el audio). Si dejas el cuadro vacío, la
canción se reproduce igual, solo que sin letra sincronizada.
