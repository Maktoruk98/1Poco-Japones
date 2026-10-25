# Un poco más japonés 🎌

Una app para aprender **un poco** de japonés cada día. Sin prisas, sin sesiones eternas:
10 aciertos al día y mantienes la racha.

## Qué incluye

- **Hoy**: tu nivel (de 観光客 «turista» a 日本の心 «corazón japonés») y los
  **momentos japoneses**: más de 30 hábitos y pequeños placeres que echa de menos quien
  vuelve de Japón (el bus puntual, guardarte la basura, decir いただきます…). Cada uno
  suma puntos una vez al día, y puedes añadir los tuyos. Además: palabra y frase del día
  (con audio), meta diaria de práctica y racha 🔥.
- **Kana**: práctica de hiragana, katakana o ambos.
- **Palabras**: vocabulario básico en las dos direcciones (japonés ⇄ español).
- **Progreso**: qué kana y palabras dominas.

Lo que fallas vuelve a salir más a menudo (repetición espaciada tipo Leitner).
El progreso se guarda en el navegador y la app funciona sin conexión (PWA instalable).

## Cómo usarla

👉 **Online:** https://maktoruk98.github.io/1Poco-Japones/ (desde el móvil, «Añadir a pantalla de inicio»).

**En local** no necesita compilación ni dependencias. Sirve la carpeta con cualquier servidor estático:

```sh
python3 -m http.server 8000
```

y abre http://localhost:8000.

## Estructura

- `index.html` — esqueleto y navegación
- `styles.css` — estilos (modo claro y oscuro)
- `data.js` — contenido: kana, vocabulario y frases
- `app.js` — lógica: rutas, cuestionarios, progreso
- `sw.js`, `manifest.webmanifest`, `icon.svg` — soporte PWA/offline
