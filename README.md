# Un poco más japonés 🎌

Una app para aprender **un poco** de japonés cada día. Sin prisas, sin sesiones eternas:
10 aciertos al día y mantienes la racha.

## Qué incluye

- **Hoy**: tu nivel (de 観光客 «turista» a 日本の心 «corazón japonés») y los
  **momentos japoneses**: más de 30 hábitos y pequeños placeres que echa de menos quien
  vuelve de Japón (el bus puntual, guardarte la basura, decir いただきます…). Cada uno
  suma puntos una vez al día, y puedes añadir los tuyos. Además: palabra y frase del día
  (con audio), meta diaria de práctica y racha 🔥.
- **Línea** (環): tu propia Osaka Loop Line (大阪環状線), dibujada como un anillo de 19
  estaciones. Hay 19 niveles, uno por estación: la primera es 弁天町 (Bentenchō, JR-O15) y,
  cada vez que subes de nivel, eliges la palabra que quieres dejar en la siguiente (entre
  las que más has practicado o una que escribas tú). La estación del día late suavemente.
- **Leer** (読), para quien aún no conoce los símbolos: 20 lecciones por filas (10 de hiragana
  y 10 de katakana). Cada una presenta los símbolos con su sonido, un consejo de pronunciación y
  una palabra de ejemplo, y después se practica en los dos sentidos. La primera vez que entras,
  la app pregunta si ya conoces los símbolos para enseñarte esta pestaña o las de Kana y
  Palabras; se puede cambiar desde Progreso.
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

## Portada y cuentas con Google

Al abrir la app empieza una intro sincronizada con una melodía de caja de música de 21 segundos
(se puede saltar; en el móvil empieza con «Toca para empezar», porque sin un toque el navegador no
deja sonar audio). Un sol sale sobre el Fuji al amanecer y se convierte en el anillo de la Loop Line,
con textos que pasan del japonés al castellano. Sin sesión termina en el inicio de sesión con Google;
con sesión termina como pantalla de carga: tus estaciones, おかえりなさい y un proverbio japonés
distinto cada día (toca para entrar). A la tercera intro con sesión, la app pregunta si quieres
saltártela; en Progreso se puede activar o desactivar.

Con Firebase configurado, cada persona inicia sesión con su cuenta de Google y tiene sus
propios logros, guardados en la nube y disponibles en cualquier dispositivo. Sin configurar,
la app funciona igual, solo en local. Para configurarlo:

1. En https://console.firebase.google.com crea un proyecto (Analytics no hace falta).
2. **Authentication → Comenzar → Google**: habilítalo y guarda.
3. **Authentication → Configuración → Dominios autorizados**: añade `maktoruk98.github.io`.
4. **Firestore Database → Crear base de datos** (modo producción, ubicación en Europa).
   En **Reglas**, pega el contenido de `firestore.rules` y publica.
5. **Configuración del proyecto → Tus apps → Web (`</>`)**: registra la app y copia el
   objeto `firebaseConfig` en `firebase-config.js` (no es secreto).

## Estructura

- `index.html` — esqueleto y navegación
- `styles.css` — estilos (modo claro y oscuro)
- `data.js` — contenido: kana, vocabulario y frases
- `app.js` — lógica: rutas, cuestionarios, progreso
- `learn.js` — aprender a leer: pregunta inicial, lecciones de kana, práctica y repaso
- `line.js` — la Loop Line: estaciones, anillo, carteles, elección de palabra, romaji → hiragana y portada
- `cloud.js`, `firebase-config.js`, `firestore.rules` — cuentas de Google y nube
- `intro.mp3` — melodía de la intro (caja de música)
- `icon-*.png`, `apple-touch-icon.png`, `favicon-48.png` — iconos (redondeado para el navegador y
  Android; cuadrado a sangre para iPhone y los iconos adaptables de Android)
- `sw.js`, `manifest.webmanifest` — soporte PWA/offline
