// El paso de hoy (今日の一歩): cada día, una pequeña propuesta para vivir el día un poco más
// como en Japón. No es una lista que marcar a posteriori (eso son los momentos japoneses),
// sino una invitación para llevar en la cabeza durante el día: la haces, la apuntas y, si
// quieres, dejas una nota. Con el tiempo, las notas forman un cuaderno.

const STEP_XP = 15;
const STEP_SWAPS = 2; // veces al día que se puede pedir otra propuesta
const STEP_REST_DAYS = 30; // un paso ya dado no vuelve a salir hasta pasado este tiempo
const STEP_LOG_SHOWN = 12;

// [id, título, propuesta, palabra, lectura, qué significa, estación del año (opcional)]
const STEPS = [
  // Mirar
  ["kisetsu", "El paso de las estaciones", "A lo largo de hoy, párate en algún lugar y busca algo de la naturaleza que delate el paso de las estaciones. Míralo un rato desde un ángulo distinto al habitual.", "季節", "kisetsu", "La estación del año. En Japón se celebra en la comida, en las cartas y hasta en los saludos."],
  ["komorebi", "Luz entre las hojas", "Busca hoy la luz que se cuela entre las hojas de un árbol y quédate un momento debajo.", "木漏れ日", "komorebi", "La luz del sol filtrada entre las hojas. Tiene palabra propia."],
  ["sora", "Tres cielos", "Mira hoy al cielo tres veces: por la mañana, a mediodía y al atardecer. Fíjate en qué ha cambiado.", "空", "sora", "Cielo. 空を見上げる (sora o miageru) es levantar la vista hacia él."],
  ["yuyake", "El atardecer", "Intenta ver hoy la puesta de sol, aunque sea un trozo entre edificios.", "夕焼け", "yūyake", "El cielo encendido del atardecer."],
  ["tsuki", "La luna de hoy", "Esta noche busca la luna y fíjate en qué fase está.", "月見", "tsukimi", "Contemplar la luna. En otoño hay fiestas enteras dedicadas a ello."],
  ["mimi", "Un minuto de oído", "Párate un minuto en la calle, cierra los ojos y cuenta cuántos sonidos distintos oyes.", "耳を澄ます", "mimi o sumasu", "«Aclarar el oído»: escuchar con toda la atención."],
  ["kaze", "El viento", "Fíjate hoy en el viento: de dónde viene, qué mueve, a qué huele.", "風", "kaze", "Viento. 風情 (fuzei) es el encanto sutil de un lugar o de un momento."],
  ["michikusa", "Un rodeo", "Vuelve hoy a casa por un camino distinto, sin prisa, y fíjate en algo que no hubieras visto nunca.", "道草", "michikusa", "«Hierba del camino»: entretenerse por el camino sin motivo."],
  ["wabisabi", "Bonito por gastado", "Busca hoy algo viejo, gastado o imperfecto que te parezca bonito precisamente por eso.", "侘び寂び", "wabi-sabi", "La belleza de lo sencillo, lo imperfecto y lo que envejece."],
  ["zasso", "Donde no debería", "Busca hoy una planta que crezca donde no debería: una grieta, un muro, el borde de una alcantarilla.", "雑草", "zassō", "Mala hierba. 雑草魂 (zassō-damashii) es el espíritu de quien crece en cualquier parte."],
  ["ichimai", "Una sola foto", "Haz hoy una sola foto de algo pequeño que te haya gustado. Solo una.", "一枚", "ichimai", "«Una hoja»: así se cuentan las fotos, de una en una."],
  ["shinrinyoku", "Diez minutos entre árboles", "Camina hoy diez minutos entre árboles, aunque sea en el parque más cercano, sin auriculares.", "森林浴", "shinrin-yoku", "«Baño de bosque»: estar entre árboles como quien se da un baño."],

  // Los demás
  ["aisatsu", "Un saludo de verdad", "Saluda hoy con intención a alguien a quien normalmente no saludas: quien conduce el bus, una vecina, quien limpia el portal.", "挨拶", "aisatsu", "El saludo. En Japón se enseña desde la guardería como base de la convivencia."],
  ["otsukaresama", "Gracias por tu trabajo", "Dale hoy las gracias a alguien por su trabajo, mirándole a los ojos.", "お疲れ様", "otsukaresama", "«Gracias por tu esfuerzo». Se dice a todas horas entre compañeros."],
  ["omoiyari", "Adelantarse", "Adelántate hoy a lo que necesita alguien antes de que lo pida: una puerta, un vaso de agua, un asiento.", "思いやり", "omoiyari", "Ponerse en el lugar del otro y actuar en consecuencia."],
  ["meiwaku", "Ocupar un poco menos", "En algún sitio público, intenta hoy ocupar un poco menos: la mochila delante, la voz baja, el paso libre.", "迷惑", "meiwaku", "La molestia que causas a los demás. Evitarla es casi una regla de oro."],
  ["ichizen", "Una buena acción", "Recoge hoy del suelo una cosa que no sea tuya y tírala a la papelera.", "一日一善", "ichinichi ichizen", "«Una buena acción al día»."],
  ["ojigi", "Gracias sin palabras", "Da hoy las gracias una vez con una pequeña inclinación de cabeza, sin decir nada.", "お辞儀", "ojigi", "La reverencia: saluda, agradece y pide perdón."],
  ["aizuchi", "Escuchar hasta el final", "En una conversación de hoy, deja que la otra persona termine del todo antes de contestar. Asiente mientras escuchas.", "相槌", "aizuchi", "Los «sí», «ajá» y «ya veo» con los que se demuestra que estás escuchando."],
  ["yuzuriai", "Ceder", "Cede hoy el paso, el asiento o el turno una vez, sin que te lo pidan.", "譲り合い", "yuzuriai", "Cederse el paso unos a otros."],
  ["ichigoichie", "Como si fuera la única vez", "En alguna conversación de hoy, guarda el móvil y escucha como si fuera la única vez que vais a hablar.", "一期一会", "ichigo ichie", "«Una vez, un encuentro»: cada momento con alguien es irrepetible."],
  ["orei", "Un gracias atrasado", "Escribe hoy un mensaje de agradecimiento a alguien por algo que hizo hace tiempo.", "お礼", "orei", "El agradecimiento que se devuelve."],
  ["temiyage", "Un detalle en la mano", "Llévale hoy un detalle pequeño a alguien: una fruta, un dulce, algo que hayas visto y te haya recordado a esa persona.", "手土産", "temiyage", "El detalle que se lleva en la mano cuando vas a ver a alguien."],
  ["gofunmae", "Cinco minutos antes", "Llega hoy cinco minutos antes a donde tengas que ir.", "五分前行動", "gofun-mae kōdō", "«Actuar cinco minutos antes»: lo que se enseña en los colegios japoneses."],

  // La mesa y la casa
  ["itadakimasu", "Antes del primer bocado", "Antes de la primera comida de hoy, para un segundo, junta las manos y di いただきます.", "いただきます", "itadakimasu", "«Lo recibo con gratitud»: a quien cocinó, a quien lo cultivó y a lo que comes."],
  ["harahachibu", "Al ochenta por ciento", "En una comida de hoy, para cuando estés casi lleno, no del todo.", "腹八分目", "hara hachibunme", "«El estómago al ochenta por ciento»."],
  ["ajiwau", "Tres bocados en silencio", "Come hoy los tres primeros bocados en silencio y sin pantallas, fijándote en el sabor y la textura.", "味わう", "ajiwau", "Saborear."],
  ["shun", "Lo que toca ahora", "Compra o come hoy algo que esté de temporada justo ahora.", "旬", "shun", "El momento exacto en que un alimento está en su punto."],
  ["ippuku", "Un té y nada más", "Prepárate hoy un té y tómatelo sentado, sin hacer nada más hasta acabarlo.", "一服", "ippuku", "Una pausa con un té: un respiro."],
  ["mottainai", "Qué pena tirarlo", "Aprovecha hoy algo que ibas a tirar: unas sobras, un bote, un papel por la otra cara.", "もったいない", "mottainai", "«Qué pena desperdiciarlo»."],
  ["moritsuke", "Un plato bien servido", "Sirve hoy tu comida con cuidado: un plato bonito y cada cosa en su sitio, aunque comas a solas.", "盛り付け", "moritsuke", "El arte de colocar la comida en el plato."],
  ["genkan", "Los zapatos, mirando a la puerta", "Al entrar hoy en casa, deja los zapatos bien colocados, con la punta hacia la puerta.", "玄関", "genkan", "La entrada de la casa. Los zapatos se dejan mirando hacia fuera, listos para salir."],
  ["soji", "Cinco minutos de limpieza", "Limpia hoy durante cinco minutos un rincón que siempre dejas para luego.", "掃除", "sōji", "Limpiar. En los colegios japoneses lo hacen los propios alumnos cada día."],
  ["danshari", "Una cosa menos", "Despréndete hoy de una cosa que ya no usas: regálala, dónala o recíclala.", "断捨離", "danshari", "Rechazar, tirar y soltar: quedarte solo con lo que importa."],
  ["ofuro", "El baño del final del día", "Esta noche date un baño o una ducha larga y caliente, sin prisa, como cierre del día.", "お風呂", "ofuro", "El baño japonés: es para relajarse, no para lavarse."],
  ["kanki", "Aire nuevo", "Abre hoy las ventanas diez minutos y deja que se airee la casa.", "換気", "kanki", "Ventilar. En Japón se hace cada mañana, también en invierno."],
  ["ikebana", "Algo vivo en casa", "Pon hoy en casa algo vivo o recogido de fuera: una rama, una flor, una hoja en un vaso.", "生け花", "ikebana", "El arte de colocar flores. Basta una rama."],
  ["fudanzukai", "Lo bueno, para hoy", "Usa hoy esa cosa bonita que guardas para una ocasión especial: la taza, la libreta, el jabón.", "普段使い", "fudan-zukai", "De uso diario: lo bueno también es para un día cualquiera."],

  // Calma
  ["ma", "Un hueco", "Deja hoy un hueco entre dos tareas: un minuto sin hacer nada y sin mirar el móvil.", "間", "ma", "El intervalo: el vacío que da sentido a lo que lo rodea."],
  ["teinei", "Con todo el cuidado", "Elige hoy una tarea pequeña (fregar una taza, doblar una camiseta, escribir un mensaje) y hazla con todo el cuidado del mundo.", "丁寧", "teinei", "Hecho con esmero y delicadeza."],
  ["kaizen", "Un uno por ciento", "Mejora hoy una sola cosa de tu rutina, tan poco que casi dé risa.", "改善", "kaizen", "Mejora continua, a base de cambios pequeños."],
  ["shisakanko", "Señalar y nombrar", "Antes de salir hoy de casa, señala con el dedo y di en voz alta: llaves, móvil, cartera.", "指差喚呼", "shisa kanko", "«Señalar y nombrar»: lo que hacen los maquinistas japoneses para no cometer errores."],
  ["tegaki", "A mano y despacio", "Escribe hoy algo a mano, despacio y con buena letra: una lista, una nota, tu nombre.", "手書き", "tegaki", "Escrito a mano."],
  ["hitori", "Un rato a solas", "Haz hoy una cosa a solas y a gusto: un café, un paseo, un rato de lectura.", "一人時間", "hitori jikan", "Tiempo para uno mismo."],
  ["taiso", "Tres minutos de estiramientos", "Al levantarte o a media mañana, estira el cuerpo durante tres minutos.", "ラジオ体操", "rajio taisō", "La gimnasia de la radio: se emite cada mañana desde 1928."],
  ["sanpo", "Una parada antes", "Bájate hoy una parada antes, o aparca un poco más lejos, y camina ese trozo fijándote en el barrio.", "散歩", "sanpo", "Paseo."],
  ["kansha", "Tres gracias", "Antes de dormir, piensa en tres cosas pequeñas de hoy por las que dar las gracias.", "感謝", "kansha", "Gratitud."],
  ["ikigai", "Cuando el tiempo vuela", "Fíjate hoy en qué momento del día se te pasa el tiempo volando, y apúntalo aquí.", "生きがい", "ikigai", "Aquello por lo que merece la pena levantarse."],
  ["shoshin", "Como la primera vez", "Haz hoy algo que ya sabes hacer como si fuera la primera vez, atendiendo a cada paso.", "初心", "shoshin", "La mente de principiante."],
  ["shoganai", "No hay nada que hacer", "Si hoy algo te sale mal y no depende de ti, di しょうがない y sigue adelante.", "しょうがない", "shō ga nai", "«No hay nada que hacer»: aceptar lo que no puedes cambiar."],
  ["yukkuri", "A media velocidad", "Haz hoy una cosa a la mitad de velocidad de lo normal: caminar, comer o ducharte.", "ゆっくり", "yukkuri", "Despacio, con calma."],
  ["matsu", "Esperar sin móvil", "Mientras esperas hoy (una cola, un semáforo, el bus), no saques el móvil: mira a tu alrededor.", "待つ", "matsu", "Esperar."],
  ["kintsugi", "Arreglar en vez de cambiar", "Arregla hoy algo en vez de sustituirlo: un botón, un tornillo, una costura.", "金継ぎ", "kintsugi", "Reparar la cerámica rota con oro: la cicatriz pasa a ser parte de la historia."],

  // Japón en mí
  ["koe", "Tres palabras en voz alta", "Di hoy tres palabras en japonés en voz alta, aunque sea para ti: おはよう, ありがとう, おやすみ.", "声に出す", "koe ni dasu", "Decir en voz alta."],
  ["kanji", "Un kanji suelto", "Busca hoy un kanji en tu día a día (un envase, una camiseta, un restaurante) y averigua qué significa.", "漢字", "kanji", "Los caracteres de origen chino con los que se escribe el japonés."],
  ["ongaku", "Una canción entera", "Escucha hoy una canción japonesa entera, sin hacer nada más.", "音楽", "ongaku", "Música."],
  ["omoide", "Un recuerdo con todo detalle", "Elige hoy una foto de Japón y recuerda todo lo que puedas de ese momento: el olor, el sonido, la temperatura.", "思い出", "omoide", "Recuerdo."],
  ["haiku", "Tres líneas", "Escribe hoy aquí tres líneas sobre algo que hayas visto: un haiku sin contar sílabas.", "俳句", "haiku", "Diecisiete sílabas y una palabra de estación (季語, kigo)."],
  ["shinhatsubai", "Algo nuevo", "Compra o prueba hoy una cosa pequeña que no hayas probado nunca.", "新発売", "shinhatsubai", "«Recién salido a la venta»: la palabra favorita de los konbini."],

  // Primavera
  ["hanami", "Bajo un árbol en flor", "Busca hoy un árbol en flor y quédate un par de minutos debajo.", "花見", "hanami", "«Mirar las flores»: el gran ritual de la primavera.", "primavera"],
  ["mebuki", "El primer brote", "Busca hoy un brote nuevo en una rama o en una maceta.", "芽吹き", "mebuki", "El brotar de las yemas.", "primavera"],
  ["hanafubuki", "Pétalos en el suelo", "Fíjate hoy en los pétalos que ya han caído antes que en los que siguen en el árbol.", "花吹雪", "hanafubuki", "«Ventisca de flores»: los pétalos cayendo con el viento.", "primavera"],

  // Verano
  ["kokage", "La mejor sombra", "Busca hoy la sombra más agradable de tu camino y párate un momento en ella.", "木陰", "kokage", "La sombra de un árbol.", "verano"],
  ["semishigure", "El sonido del verano", "Escucha hoy a las cigarras o a los grillos, o el sonido que para ti sea el verano.", "蝉時雨", "semishigure", "«Llovizna de cigarras»: su canto cayendo como lluvia.", "verano"],
  ["yusuzumi", "El fresco de la tarde", "Sal hoy un rato al anochecer, cuando ya refresca, sin ir a ningún sitio.", "夕涼み", "yūsuzumi", "Tomar el fresco al atardecer.", "verano"],

  // Otoño
  ["koyo", "Una hoja de otoño", "Busca hoy una hoja que haya cambiado de color y llévatela a casa.", "紅葉", "kōyō", "Las hojas rojas del otoño. Salir a verlas es 紅葉狩り (momijigari).", "otoño"],
  ["yugure", "La luz de la tarde", "Fíjate hoy en cómo ha cambiado la luz de la tarde respecto a hace un mes.", "秋の夕暮れ", "aki no yūgure", "El atardecer de otoño, un clásico de la poesía japonesa.", "otoño"],
  ["shokuyoku", "Sabor a otoño", "Come hoy algo que sepa a otoño: castañas, setas, boniato, calabaza.", "食欲の秋", "shokuyoku no aki", "«El otoño del apetito».", "otoño"],

  // Invierno
  ["fuyukodachi", "Ramas contra el cielo", "Busca hoy un árbol sin hojas y fíjate en el dibujo de sus ramas contra el cielo.", "冬木立", "fuyukodachi", "Los árboles desnudos del invierno.", "invierno"],
  ["shiroiiki", "Aliento blanco", "Fíjate hoy en tu aliento en el aire frío de la mañana.", "白い息", "shiroi iki", "El aliento blanco.", "invierno"],
  ["nukumori", "Calor entre las manos", "Entra hoy en calor de dentro afuera: algo caliente entre las manos, sin prisa.", "温もり", "nukumori", "La calidez.", "invierno"],
  ["hinatabokko", "Un rincón al sol", "Busca hoy un rincón al sol y quédate un momento en él.", "日向ぼっこ", "hinatabokko", "Ponerse al sol, como hacen los gatos.", "invierno"],
].map(([id, title, text, jp, romaji, note, season]) => ({ id: `step-${id}`, title, text, jp, romaji, note, season }));

// Los 24 periodos del calendario tradicional (二十四節気), por la fecha aproximada en que empiezan.
const SEKKI = [
  [1, 5, "小寒", "shōkan", "pequeño frío"], [1, 20, "大寒", "daikan", "gran frío"],
  [2, 4, "立春", "risshun", "comienzo de la primavera"], [2, 19, "雨水", "usui", "agua de lluvia"],
  [3, 6, "啓蟄", "keichitsu", "despertar de los insectos"], [3, 21, "春分", "shunbun", "equinoccio de primavera"],
  [4, 5, "清明", "seimei", "claro y luminoso"], [4, 20, "穀雨", "kokuu", "lluvia para el grano"],
  [5, 6, "立夏", "rikka", "comienzo del verano"], [5, 21, "小満", "shōman", "pequeña plenitud"],
  [6, 6, "芒種", "bōshu", "grano en espiga"], [6, 21, "夏至", "geshi", "solsticio de verano"],
  [7, 7, "小暑", "shōsho", "pequeño calor"], [7, 23, "大暑", "taisho", "gran calor"],
  [8, 8, "立秋", "risshū", "comienzo del otoño"], [8, 23, "処暑", "shosho", "fin del calor"],
  [9, 8, "白露", "hakuro", "rocío blanco"], [9, 23, "秋分", "shūbun", "equinoccio de otoño"],
  [10, 8, "寒露", "kanro", "rocío frío"], [10, 23, "霜降", "sōkō", "caída de la escarcha"],
  [11, 7, "立冬", "rittō", "comienzo del invierno"], [11, 22, "小雪", "shōsetsu", "pequeña nieve"],
  [12, 7, "大雪", "taisetsu", "gran nieve"], [12, 22, "冬至", "tōji", "solsticio de invierno"],
].map(([month, day, jp, romaji, es]) => ({ month, day, jp, romaji, es }));

function currentSekki(d = new Date()) {
  const today = (d.getMonth() + 1) * 100 + d.getDate();
  const started = SEKKI.filter((s) => s.month * 100 + s.day <= today);
  return started.length ? started[started.length - 1] : SEKKI[SEKKI.length - 1]; // del 1 al 4 de enero sigue el solsticio
}

// Estaciones del hemisferio norte, como en Japón.
function seasonOf(d = new Date()) {
  const m = d.getMonth() + 1;
  return m >= 3 && m <= 5 ? "primavera" : m >= 6 && m <= 8 ? "verano" : m >= 9 && m <= 11 ? "otoño" : "invierno";
}

// ---------- Elegir el paso del día ----------

function seededShuffle(arr, seed) {
  let t = seed >>> 0;
  const rand = () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

function stepEntries() {
  return state.log.filter((m) => m.id.startsWith("step-"));
}

function stepEntryToday() {
  return stepEntries().find((m) => m.date === dateKey());
}

function stepSwapsToday() {
  return state.step && state.step.date === dateKey() ? state.step.swaps : 0;
}

// Los pasos de todo el año rotan en un orden fijo (barajado una sola vez), así que uno no
// vuelve hasta que han pasado todos los demás. Un día de cada siete toca uno de la estación
// del año. El primero de la lista es el paso de ese día; los siguientes, sus alternativas,
// que saltan lejos en la rotación para no adelantar el paso de mañana.
const STEPS_ALL_YEAR = seededShuffle(STEPS.filter((s) => !s.season), 1);
const STEP_SEASON_EVERY = 7;

function stepSequence(d = new Date()) {
  const n = STEPS_ALL_YEAR.length;
  const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  let stride = Math.round(n * 0.382);
  while (gcd(stride, n) !== 1) stride++;
  const sequence = Array.from({ length: n }, (_, j) => STEPS_ALL_YEAR[((day % n) + j * stride) % n]);
  if (day % STEP_SEASON_EVERY === 0) {
    const seasonal = STEPS.filter((s) => s.season === seasonOf(d));
    sequence.unshift(seasonal[Math.floor(day / STEP_SEASON_EVERY) % seasonal.length]);
  }
  return sequence;
}

// El paso de hoy sale solo de la fecha y de lo que ya has hecho, sin guardar nada al abrir la
// app: así es el mismo en todos tus dispositivos. Lo que has hecho en el último mes no se repite.
function stepOfToday() {
  const done = stepEntryToday();
  if (done) return STEPS.find((s) => s.id === done.id) || { id: done.id, title: done.text, text: "", jp: "", romaji: "", note: "" };

  const rest = new Date();
  rest.setDate(rest.getDate() - STEP_REST_DAYS);
  const restKey = dateKey(rest);
  const doneLately = new Set(stepEntries().filter((m) => m.date > restKey).map((m) => m.id));
  const sequence = stepSequence();
  const fresh = sequence.filter((s) => !doneLately.has(s.id));
  const options = fresh.length ? fresh : sequence;
  return options[stepSwapsToday() % options.length];
}

// ---------- Tarjeta de la pantalla Hoy ----------

function stepMoment() {
  const h = new Date().getHours();
  return h < 12 ? "Para hoy" : h < 19 ? "A lo largo de hoy" : "Antes de que acabe el día";
}

function shortDate(key) {
  const [, m, d] = key.split("-").map(Number);
  return `${d} ${["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][m - 1]}`;
}

function stepCard() {
  const step = stepOfToday();
  const entry = stepEntryToday();
  const sekki = currentSekki();
  const swapsLeft = STEP_SWAPS - stepSwapsToday();
  const past = stepEntries().reverse();

  const actions = entry
    ? `<p class="step-ok">✓ Paso dado · +${entry.xp}</p>
       <form id="step-note" class="row custom">
         <input name="note" maxlength="200" value="${esc(entry.note || "")}" placeholder="¿Qué viste? ¿Cómo fue?" aria-label="Nota sobre el paso de hoy" autocomplete="off">
         <button>${entry.note ? "Cambiar" : "Apuntar"}</button>
       </form>
       <button type="button" class="link small" data-step="undo">Deshacer</button>`
    : `<button type="button" class="primary step-do" data-step="done">Lo he hecho · +${STEP_XP}</button>
       ${
         swapsLeft > 0
           ? `<button type="button" class="link small" data-step="swap">Prefiero otra propuesta (${swapsLeft === 1 ? "queda 1" : `quedan ${swapsLeft}`})</button>`
           : `<p class="muted small step-last">Hoy toca esta. Mañana, otra.</p>`
       }`;

  return `
    <section class="card step ${entry ? "done" : ""}">
      <h2><span lang="ja">今日の一歩</span> · El paso de hoy</h2>
      <p class="step-kicker">${entry ? "Hecho hoy" : stepMoment()}</p>
      <h3 class="step-title">${esc(step.title)}</h3>
      ${step.text ? `<p class="step-text">${esc(step.text)}</p>` : ""}
      ${
        step.jp
          ? `<div class="step-word">
               <div class="row"><b lang="ja">${esc(step.jp)}</b>${speakButton(step.jp)}<span class="muted">${esc(step.romaji)}</span></div>
               <p>${esc(step.note)}</p>
             </div>`
          : ""
      }
      ${actions}
      <p class="step-sekki muted">Calendario japonés: <b lang="ja">${sekki.jp}</b> ${sekki.romaji}, «${sekki.es}».</p>
      ${
        past.length
          ? `<details class="step-log">
               <summary>Tu cuaderno · ${past.length} ${past.length === 1 ? "paso" : "pasos"}</summary>
               <ul>
                 ${past
                   .slice(0, STEP_LOG_SHOWN)
                   .map((m) => `<li><span class="muted">${shortDate(m.date)}</span> <b>${esc(m.text)}</b>${m.note ? `<small>${esc(m.note)}</small>` : ""}</li>`)
                   .join("")}
               </ul>
               ${past.length > STEP_LOG_SHOWN ? `<p class="muted small">Y ${past.length - STEP_LOG_SHOWN} más.</p>` : ""}
             </details>`
          : ""
      }
    </section>`;
}

// rerender: vuelve a pintar la pantalla Hoy (sin mover el scroll).
function bindStepCard(rerender) {
  const card = view.querySelector(".step");
  card.querySelectorAll("[data-step]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const action = btn.dataset.step;
      if (action === "done") {
        const step = stepOfToday();
        addMoment({ id: step.id, text: step.title, xp: STEP_XP });
      } else if (action === "swap") {
        state.step = { date: dateKey(), swaps: stepSwapsToday() + 1 };
        save();
      } else if (action === "undo") {
        removeMomentToday(stepEntryToday().id);
      }
      rerender();
    })
  );
  card.querySelector("#step-note")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const entry = stepEntryToday();
    const note = e.target.note.value.trim();
    if (note) entry.note = note;
    else delete entry.note;
    save();
    toast(note ? "Apuntado en tu cuaderno" : "Nota borrada");
    rerender();
  });
}
