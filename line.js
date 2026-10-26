// La línea: cada frase en japonés que recuerdas es una parada de la Osaka Loop Line
// (大阪環状線). También dibuja la portada (pantalla de carga e inicio de sesión).

const LOOP_STATIONS = 19; // la Loop Line real tiene 19 estaciones
const FIRST_STATION_NUMBER = 15; // Bentenchō es la JR-O15 (la numeración empieza en Tennōji)
const LINE_XP = 15;
const COVER_MIN_MS = 2200; // tiempo para ver aparecer tus paradas en el mapa

const FIRST_STOP = {
  id: "stop-bentencho",
  jp: "弁天町",
  romaji: "Bentenchō",
  es: "Tu primera parada en la Loop Line.",
  note: "",
  date: "",
};

// ---------- Romaji → hiragana ----------

const ROMAJI_KANA = (() => {
  const rows = {
    "": "あいうえお", k: "かきくけこ", g: "がぎぐげご", s: "さしすせそ", z: "ざじずぜぞ",
    t: "たちつてと", d: "だぢづでど", n: "なにぬねの", h: "はひふへほ", b: "ばびぶべぼ",
    p: "ぱぴぷぺぽ", m: "まみむめも", r: "らりるれろ",
  };
  const table = {};
  for (const [c, kana] of Object.entries(rows)) [..."aiueo"].forEach((v, i) => (table[c + v] = kana[i]));
  Object.assign(table, {
    ya: "や", yu: "ゆ", yo: "よ", wa: "わ", wo: "を",
    shi: "し", chi: "ち", tsu: "つ", fu: "ふ", ji: "じ", si: "し", ti: "ち", tu: "つ", hu: "ふ", zi: "じ",
  });
  const youon = { ky: "き", gy: "ぎ", ny: "に", hy: "ひ", by: "び", py: "ぴ", my: "み", ry: "り", sh: "し", ch: "ち", j: "じ" };
  for (const [c, base] of Object.entries(youon)) {
    table[c + "a"] = base + "ゃ";
    table[c + "u"] = base + "ゅ";
    table[c + "o"] = base + "ょ";
  }
  Object.assign(table, { she: "しぇ", che: "ちぇ", je: "じぇ" });
  return table;
})();

function toHiragana(romaji) {
  const src = romaji
    .toLowerCase()
    .replace(/ā/g, "aa").replace(/ī/g, "ii").replace(/ū/g, "uu").replace(/ē/g, "ee").replace(/ō/g, "ou")
    .replace(/[âîûêô]/g, (c) => ({ "â": "aa", "î": "ii", "û": "uu", "ê": "ee", "ô": "ou" })[c]);
  let out = "";
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1] || "";
    if (c === "n" && (next === "'" || !/[aiueoy]/.test(next))) {
      out += "ん";
      i += next === "'" ? 2 : 1;
      continue;
    }
    if (/[bcdfghjkmprstwz]/.test(c) && (c === next || (c === "t" && src.startsWith("ch", i + 1)))) {
      out += "っ";
      i++;
      continue;
    }
    const hit = [3, 2, 1].map((n) => src.slice(i, i + n)).find((s) => ROMAJI_KANA[s]);
    if (hit) {
      out += ROMAJI_KANA[hit];
      i += hit.length;
    } else {
      out += c === "-" ? "" : c;
      i++;
    }
  }
  return out;
}

// ---------- Paradas ----------

function lineStops() {
  return state.line && state.line.length ? state.line : [FIRST_STOP];
}

function stationNumber(i) {
  return String(((FIRST_STATION_NUMBER - 1 + i) % LOOP_STATIONS) + 1).padStart(2, "0");
}

function stopTitle(stop) {
  return stop.jp || toHiragana(stop.romaji);
}

function stopKana(stop) {
  return stop.jp ? toHiragana(stop.romaji) : "";
}

function addedStopToday() {
  return lineStops().some((s) => s.date === dateKey());
}

function addStop(stop) {
  if (!state.line || !state.line.length) state.line = [FIRST_STOP];
  state.line.push({ id: `stop-${Date.now()}`, date: dateKey(), ...stop });
  if (loggedToday("linea")) save();
  else addMoment({ id: "linea", text: `Nueva parada: ${stop.romaji}`, xp: LINE_XP });
}

function removeStop(id) {
  state.line = lineStops().filter((s) => s.id !== id);
  save();
}

// ---------- Cartel de estación (estilo JR West) ----------

function shorten(text, max) {
  const chars = [...text];
  return chars.length > max ? chars.slice(0, max - 1).join("") + "…" : text;
}

function signFontSize(text) {
  const n = [...text].length;
  return n <= 4 ? 60 : n <= 7 ? 44 : n <= 12 ? 32 : n <= 20 ? 26 : 22;
}

function stationSign(index, { compact = false } = {}) {
  const stops = lineStops();
  const stop = stops[index];
  const title = stopTitle(stop);
  const kana = stopKana(stop);
  const prev = index > 0 ? stops[index - 1] : stops.length > 1 ? stops[stops.length - 1] : null;
  const next = index < stops.length - 1 ? stops[index + 1] : null;
  const end = (s, fallback, dir) =>
    `<div class="end ${dir}">${dir === "prev" ? "◀ " : ""}<b lang="ja">${esc(s ? stopTitle(s) : fallback.jp)}</b>${dir === "next" ? " ▶" : ""}<small>${esc(s ? s.romaji : fallback.es)}</small></div>`;
  return `
    <div class="sign ${compact ? "compact" : ""} ${[...title].length > 8 ? "long" : ""}">
      <div class="sign-num"><span>JR</span><b>O</b><b>${stationNumber(index)}</b></div>
      <div class="sign-main" lang="ja" style="font-size:${compact ? Math.round(signFontSize(title) * 0.7) : signFontSize(title)}px">${esc(title)}</div>
      ${kana ? `<div class="sign-kana" lang="ja">${esc(kana)}</div>` : ""}
      <div class="sign-ro">${esc(stop.romaji)}</div>
      <div class="sign-band">
        ${end(prev, { jp: "ー", es: "inicio" }, "prev")}
        ${end(next, { jp: "？", es: "tu próxima frase" }, "next")}
      </div>
    </div>`;
}

// ---------- Mapa de Osaka (recreado a partir del mapa de JR West) ----------

// Las 19 estaciones de la Loop Line en orden de número (JR-O01 … JR-O19).
// box: estación de transbordo (rectángulo negro, "v" vertical u "h" horizontal).
// side: dónde va la etiqueta (r derecha, l izquierda, t arriba, b abajo; bl/br abajo a un lado).
const MAP_STATIONS = [
  { en: "Tennōji", jp: "天王寺", x: 450, y: 885, box: "v", side: "br" },
  { en: "Teradachō", jp: "寺田町", x: 535, y: 822, side: "r" },
  { en: "Momodani", jp: "桃谷", x: 598, y: 759, side: "l" },
  { en: "Tsuruhashi", jp: "鶴橋", x: 612, y: 700, side: "l" },
  { en: "Tamatsukuri", jp: "玉造", x: 612, y: 645, side: "l" },
  { en: "Morinomiya", jp: "森ノ宮", x: 612, y: 590, side: "l" },
  { en: "Ōsakajōkōen", jp: "大阪城公園", x: 612, y: 535, side: "l" },
  { en: "Kyōbashi", jp: "京橋", x: 612, y: 452, box: "h", side: "t" },
  { en: "Sakuranomiya", jp: "桜ノ宮", x: 583, y: 356, side: "l" },
  { en: "Temma", jp: "天満", x: 480, y: 268, side: "b" },
  { en: "Ōsaka", jp: "大阪", x: 372, y: 268, box: "v", side: "t" },
  { en: "Fukushima", jp: "福島", x: 285, y: 268, side: "b" },
  { en: "Noda", jp: "野田", x: 165, y: 370, side: "l" },
  { en: "Nishikujō", jp: "西九条", x: 150, y: 489, box: "h", side: "t" },
  { en: "Bentenchō", jp: "弁天町", x: 150, y: 585, side: "r" },
  { en: "Taishō", jp: "大正", x: 150, y: 692, side: "r" },
  { en: "Ashiharabashi", jp: "芦原橋", x: 187, y: 802, side: "r" },
  { en: "Imamiya", jp: "今宮", x: 235, y: 850, side: "r" },
  { en: "Shin-Imamiya", jp: "新今宮", x: 352, y: 885, box: "v", side: "bl" },
];

const LOOP_PATH = "M270 268 L495 268 L612 385 L612 745 L472 885 L270 885 L150 765 L150 385 Z";

// Otras líneas, solo para ambientar (colores del mapa de JR West).
const MAP_LINES = [
  { color: "#f6b81a", d: "M-40 20 L60 110 L140 125 L240 205 L372 205" },
  { color: "#0a74c8", d: "M-40 250 L100 150 L140 150 L240 240 L450 240 L490 200 L490 -80" },
  { color: "#e8338f", d: "M185 80 L200 100 L200 300 L230 340 L340 452 L840 452" },
  { color: "#22409a", d: "M130 489 L130 570 L60 640 L-40 700" },
  { color: "#3e7396", d: "M560 -80 L560 40 L640 40 L700 100 L700 400 L752 452" },
  { color: "#3e7396", d: "M840 690 L700 830 L700 1000 L740 1035 L840 1035" },
  { color: "#00a86b", d: "M290 705 L245 750 L245 800 L290 845 L490 845 L520 870 L690 1035 L840 1035" },
  { color: "#f6a01a", d: "M470 815 L505 815 L525 840 L525 900 L130 1300" },
];

function mapDots(d) {
  // Puntos blancos repartidos a lo largo de una línea recta a tramos.
  const pts = d.match(/-?\d+ -?\d+/g).map((p) => p.split(" ").map(Number));
  const dots = [];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const len = Math.hypot(x2 - x1, y2 - y1);
    for (let t = 45; t < len - 30; t += 70) dots.push([x1 + ((x2 - x1) * t) / len, y1 + ((y2 - y1) * t) / len]);
  }
  return dots.map(([x, y]) => `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" class="m-dot"/>`).join("");
}

function mapLabel(st, title, sub, cls = "") {
  const below = st.box === "v" ? 82 : 38;
  const dx = { r: 20, l: -20, t: 0, b: 0, bl: 8, br: -8 }[st.side];
  const dy = { r: 6, l: 6, t: st.box === "v" ? -84 : st.box ? -44 : -30, b: below, bl: below, br: below }[st.side];
  const anchor = { r: "start", l: "end", t: "middle", b: "middle", bl: "end", br: "start" }[st.side];
  return `
    <g class="m-label ${cls}" text-anchor="${anchor}">
      <text x="${st.x + dx}" y="${st.y + dy}" class="m-name">${esc(title)}</text>
      ${sub ? `<text x="${st.x + dx}" y="${st.y + dy + 18}" class="m-sub">${esc(sub)}</text>` : ""}
    </g>`;
}

function mapStation(st, attrs = "", cls = "") {
  if (st.box) {
    const [w, h] = st.box === "v" ? [30, 96] : [96, 30];
    return `<rect class="m-box ${cls}" x="${st.x - w / 2}" y="${st.y - h / 2}" width="${w}" height="${h}" rx="5" ${attrs}/>`;
  }
  return `<circle class="m-stop ${cls}" cx="${st.x}" cy="${st.y}" r="${cls.includes("on") ? 11 : 8}" ${attrs}/>`;
}

// mode "names": nombres reales (inicio de sesión). mode "words": tus paradas.
function osakaMap({ mode, selected = null, viewBox = "80 30 600 1300", animate = false } = {}) {
  const stops = lineStops();
  const sel = selected ?? stops.length - 1;
  const lap = Math.floor(sel / LOOP_STATIONS);
  const first = FIRST_STATION_NUMBER - 1;
  const parts = [];
  const labels = [];

  MAP_STATIONS.forEach((st, n) => {
    if (mode === "names") {
      const here = n === first;
      parts.push(mapStation(st, "", here ? "on here" : ""));
      labels.push(mapLabel(st, st.en, st.jp, here ? "here" : ""));
      return;
    }
    const i = lap * LOOP_STATIONS + ((n - first + LOOP_STATIONS) % LOOP_STATIONS);
    const stop = i < stops.length ? stops[i] : null;
    const cls = stop ? (i === sel ? "done on" : "done") : "";
    parts.push(mapStation(st, stop ? `data-stop="${i}"` : "", cls));
    if (stop) {
      const order = i - lap * LOOP_STATIONS;
      const style = animate ? ` style="animation-delay:${200 + order * 120}ms"` : "";
      labels.push(mapLabel(st, shorten(stopTitle(stop), 7), shorten(stop.romaji, 18), `${i === sel ? "on" : ""} ${animate ? "pop" : ""}`).replace('class="m-label', `${style} class="m-label`));
    }
  });

  return `
    <svg class="osaka-map ${mode}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa de la Osaka Loop Line">
      <rect x="-200" y="-200" width="1200" height="1700" class="m-bg"/>
      <path class="m-water" d="M-60 300 L70 300 Q95 300 95 325 L95 650 L30 720 L30 1000 L120 1100 L120 1350 L-60 1350 Z"/>
      <path class="m-grey" d="M280 905 L280 1150 L330 1185 L720 1185 L760 1140 L760 980 M110 300 L110 220 L210 120 L520 120"/>
      <path class="m-shinkansen" d="M-40 48 L290 48 L360 120 L670 120 L840 -60"/>
      <path class="m-shinkansen dash" d="M-40 48 L290 48 L360 120 L670 120 L840 -60"/>
      ${MAP_LINES.map((l) => `<path class="m-line" stroke="${l.color}" d="${l.d}"/>${mapDots(l.d)}`).join("")}
      <path class="m-loop" d="${LOOP_PATH}"/>
      <rect x="352" y="545" width="60" height="54" class="m-letter-bg"/><text x="382" y="590" class="m-letter">O</text>
      ${parts.join("")}
      ${labels.join("")}
    </svg>`;
}

// ---------- Pestaña Línea ----------

let selectedStop = null;

function renderLinea() {
  const stops = lineStops();
  if (selectedStop === null || selectedStop >= stops.length) selectedStop = stops.length - 1;
  const stop = stops[selectedStop];
  const today = addedStopToday();

  view.innerHTML = `
    <section class="card line-card">
      <div class="map-wrap">${osakaMap({ mode: "words", selected: selectedStop, viewBox: "100 190 580 780" })}</div>
      <p class="map-caption"><span lang="ja">大阪環状線</span> · ${lineSummary(selectedStop)}</p>
      ${stationSign(selectedStop)}
      ${stop.es ? `<p class="stop-es">${esc(stop.es)}</p>` : ""}
      ${stop.note ? `<p class="muted">📍 ${esc(stop.note)}</p>` : ""}
    </section>

    <section class="card">
      <h2>${today ? "Ya tienes la parada de hoy ✓" : `Parada de hoy · +${LINE_XP}`}</h2>
      <p class="muted">¿Qué frase o palabra en japonés recuerdas? Escríbela como te suene: se convertirá en la próxima parada de tu línea.</p>
      <form id="stop-form" class="stop-form">
        <label>¿Cómo suena? <input name="romaji" required maxlength="80" placeholder="Oshiete ageru yo… ano yo de ne" autocomplete="off"></label>
        <p class="preview muted" lang="ja"></p>
        <label>¿Qué significa? <input name="es" maxlength="120" placeholder="Opcional" autocomplete="off"></label>
        <label>¿De dónde la recuerdas? <input name="note" maxlength="120" placeholder="Opcional: un anime, una canción, el viaje…" autocomplete="off"></label>
        <label>En japonés <input name="jp" maxlength="40" lang="ja" placeholder="Opcional: kanji o kana, si los sabes" autocomplete="off"></label>
        <button class="primary">🚉 Añadir parada</button>
      </form>
    </section>

    <section class="card">
      <h2>Tus paradas</h2>
      <ol class="stops">
        ${stops
          .map((s, i) => ({ s, i }))
          .reverse()
          .map(
            ({ s, i }) => `
          <li class="${i === selectedStop ? "on" : ""}">
            <button class="stop-row" data-stop="${i}">
              <span class="badge-o">O${stationNumber(i)}</span>
              <span class="txt"><b lang="ja">${esc(stopTitle(s))}</b> <span class="muted">${esc(s.romaji)}</span>${s.es ? `<small>${esc(s.es)}</small>` : ""}</span>
            </button>
            ${stops.length > 1 && s.id ? `<button class="del" data-del="${esc(s.id)}" aria-label="Quitar parada">×</button>` : ""}
          </li>`
          )
          .join("")}
      </ol>
    </section>`;

  view.querySelectorAll("[data-stop]").forEach((el) =>
    el.addEventListener("click", () => {
      selectedStop = Number(el.dataset.stop);
      renderLinea();
    })
  );

  view.querySelectorAll("[data-del]").forEach((el) =>
    el.addEventListener("click", () => {
      if (!confirm("¿Quitar esta parada de tu línea?")) return;
      removeStop(el.dataset.del);
      selectedStop = null;
      renderLinea();
    })
  );

  const form = view.querySelector("#stop-form");
  const preview = form.querySelector(".preview");
  form.romaji.addEventListener("input", () => {
    preview.textContent = form.romaji.value.trim() ? `Cartel: ${toHiragana(form.romaji.value.trim())}` : "";
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (name) => form[name].value.trim();
    addStop({ romaji: val("romaji"), es: val("es"), note: val("note"), jp: val("jp") });
    selectedStop = null;
    renderLinea();
    window.scrollTo(0, 0);
  });
}

function lineSummary(selected) {
  const stops = lineStops();
  const lap = Math.floor(selected / LOOP_STATIONS);
  const inLap = Math.min(LOOP_STATIONS, stops.length - lap * LOOP_STATIONS);
  return `${inLap}/${LOOP_STATIONS} paradas · vuelta ${lap + 1}`;
}

function lineTodayCard() {
  const stops = lineStops();
  if (addedStopToday()) {
    return `
      <a class="card line-today" href="#linea">
        <h2>Parada de hoy</h2>
        ${stationSign(stops.length - 1, { compact: true })}
      </a>`;
  }
  return `
    <section class="card">
      <h2>🚉 Parada de hoy · +${LINE_XP}</h2>
      <p>¿Qué frase en japonés recuerdas hoy? Añádela como nueva parada de tu Loop Line.</p>
      <p class="muted">Última parada: <b lang="ja">${esc(stopTitle(stops[stops.length - 1]))}</b> · ${stops.length} en tu línea</p>
      <a class="btn primary" href="#linea">Añadir parada</a>
    </section>`;
}

// ---------- Portada: pantalla de carga e inicio de sesión ----------

const coverShownAt = Date.now();

// mode: "loading" (abriendo la app) | "login" (falta iniciar sesión) | "offline" (sin nube)
function renderCover(mode) {
  const cover = document.getElementById("cover");
  const signedIn = mode === "loading" && storeKey !== STORE_BASE;
  const stops = lineStops();
  const last = stops[stops.length - 1];
  cover.hidden = false;
  cover.classList.remove("leaving");
  document.body.classList.add("covered");

  if (signedIn) {
    cover.innerHTML = `
      ${osakaMap({ mode: "words", animate: true })}
      <div class="cover-pill"><b lang="ja">大阪環状線</b> · ${lineSummary(stops.length - 1)}</div>
      <div class="cover-bottom loading">
        <p class="muted">Última parada</p>
        <p class="cover-stop"><b lang="ja">${esc(stopTitle(last))}</b> <span>${esc(last.romaji)}</span></p>
        <p class="muted arriving">Cargando tu línea…</p>
      </div>`;
    return;
  }

  cover.innerHTML = `
    ${osakaMap({ mode: "names" })}
    <div class="cover-bottom">
      <h1>Un poco más <span>japonés</span></h1>
      <p class="muted">Tu viaje empieza en <b lang="ja">弁天町</b> Bentenchō.<br>Cada frase que recuerdes, una parada nueva.</p>
      ${
        mode === "login"
          ? `<button class="g-btn" data-cloud="in">${GOOGLE_LOGO}Continuar con Google</button>`
          : mode === "offline"
            ? `<p class="muted">Sin conexión con la nube.</p><button data-cover="enter">Continuar sin sesión</button>`
            : `<p class="muted arriving">Cargando…</p>`
      }
    </div>`;
  cover.querySelector("[data-cover=enter]")?.addEventListener("click", () => hideCover());
}

function hideCover() {
  const wait = Math.max(0, COVER_MIN_MS - (Date.now() - coverShownAt));
  setTimeout(() => {
    const cover = document.getElementById("cover");
    cover.classList.add("leaving");
    document.body.classList.remove("covered");
    setTimeout(() => (cover.hidden = true), 450);
  }, wait);
}

const GOOGLE_LOGO = `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
