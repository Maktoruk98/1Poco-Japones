# Un poco más japonés 🎌

Una app para aprender **un poco** de japonés cada día. Sin prisas, sin sesiones eternas:
10 aciertos al día y mantienes la racha.

## Qué incluye

- **Hoy**: palabra y frase del día (con audio), meta diaria y racha 🔥.
- **Kana**: práctica de hiragana, katakana o ambos.
- **Palabras**: vocabulario básico en las dos direcciones (japonés ⇄ español).
- **Progreso**: qué kana y palabras dominas.

Lo que fallas vuelve a salir más a menudo (repetición espaciada tipo Leitner).
El progreso se guarda en el navegador y la app funciona sin conexión (PWA instalable).

## Cómo usarla

No necesita compilación ni dependencias. Sirve la carpeta con cualquier servidor estático:

```sh
python3 -m http.server 8000
```

y abre http://localhost:8000. Desde el móvil, “Añadir a pantalla de inicio” para instalarla.

## Estructura

- `index.html` — esqueleto y navegación
- `styles.css` — estilos (modo claro y oscuro)
- `data.js` — contenido: kana, vocabulario y frases
- `app.js` — lógica: rutas, cuestionarios, progreso
- `sw.js`, `manifest.webmanifest`, `icon.svg` — soporte PWA/offline
