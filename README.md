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

Al abrir la app se dibuja el anillo de la Loop Line: sin sesión, con Bentenchō y el botón
de Google; con sesión, como pantalla de carga en la que aparecen tus estaciones. Con Firebase configurado, cada persona inicia sesión con
su cuenta de Google y tiene sus propios logros, guardados en la nube y disponibles en
cualquier dispositivo. Sin configurar, la app funciona igual, solo en local.

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
- `line.js` — la Loop Line: estaciones, anillo, carteles, elección de palabra, romaji → hiragana y portada
- `cloud.js`, `firebase-config.js`, `firestore.rules` — cuentas de Google y nube
- `sw.js`, `manifest.webmanifest`, `icon.svg` — soporte PWA/offline
