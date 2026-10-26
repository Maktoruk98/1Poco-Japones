// La línea: cada frase en japonés que recuerdas es una parada de la Osaka Loop Line
// (大阪環状線). También dibuja la portada (pantalla de carga e inicio de sesión).

const LOOP_STATIONS = 19; // la Loop Line real tiene 19 estaciones
const FIRST_STATION_NUMBER = 14; // Bentenchō es la JR-O14
const LINE_XP = 15;
const COVER_MIN_MS = 1600; // lo que tarda el tren en entrar al andén

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

// ---------- Mapa del anillo ----------

function loopMap(selected) {
  const stops = lineStops();
  const lap = Math.floor(selected / LOOP_STATIONS);
  const R = 120;
  const dots = [];
  for (let slot = 0; slot < LOOP_STATIONS; slot++) {
    const i = lap * LOOP_STATIONS + ((slot - (FIRST_STATION_NUMBER - 1) + LOOP_STATIONS) % LOOP_STATIONS);
    const a = -Math.PI / 2 + (slot / LOOP_STATIONS) * Math.PI * 2;
    const x = 150 + R * Math.cos(a);
    const y = 150 + R * Math.sin(a);
    const cls = i === selected ? "on" : i < stops.length ? "done" : "";
    const attr = i < stops.length ? `data-stop="${i}"` : "";
    dots.push(`<circle class="dot ${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${cls === "on" ? 11 : 8}" ${attr}></circle>`);
  }
  const stop = stops[selected];
  const inLap = Math.min(LOOP_STATIONS, stops.length - lap * LOOP_STATIONS);
  return `
    <svg class="loop" viewBox="0 0 300 300" role="img" aria-label="Mapa de tu línea">
      <circle class="ring" cx="150" cy="150" r="${R}"></circle>
      ${dots.join("")}
      <text x="150" y="112" class="loop-sub" lang="ja">大阪環状線</text>
      <text x="150" y="152" class="loop-title" lang="ja">${esc(shorten(stopTitle(stop), 7))}</text>
      <text x="150" y="178" class="loop-sub">JR-O${stationNumber(selected)} · ${esc(shorten(stop.romaji, 22))}</text>
      <text x="150" y="204" class="loop-sub">${inLap}/${LOOP_STATIONS} paradas · vuelta ${lap + 1}</text>
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
      ${loopMap(selectedStop)}
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
let clockTimer = null;

function coverClock() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// mode: "loading" | "login" | "offline"
function renderCover(mode) {
  const cover = document.getElementById("cover");
  const stops = lineStops();
  cover.hidden = false;
  cover.classList.remove("leaving");
  document.body.classList.add("covered");
  cover.innerHTML = `
    <div class="cover-clock">次の電車 · PRÓXIMO TREN <b id="cover-time">${coverClock()}</b></div>
    ${stationSign(stops.length - 1)}
    <div class="platform">
      <div class="train"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="edge"></div>
    </div>
    <h1>Próxima parada:<br>un poco más japonés</h1>
    <p class="muted">Puntual, como siempre. Sube a bordo.</p>
    <div class="cover-action">
      ${
        mode === "login"
          ? `<button class="g-btn" data-cloud="in">${GOOGLE_LOGO}Continuar con Google</button>`
          : mode === "offline"
            ? `<p class="muted">Sin conexión con la nube.</p><button data-cover="enter">Continuar sin sesión</button>`
            : `<p class="muted arriving">El tren está entrando en la estación…</p>`
      }
    </div>`;
  cover.querySelector("[data-cover=enter]")?.addEventListener("click", () => hideCover());
  clearInterval(clockTimer);
  clockTimer = setInterval(() => {
    const el = document.getElementById("cover-time");
    if (el) el.textContent = coverClock();
  }, 10000);
}

function hideCover() {
  const wait = Math.max(0, COVER_MIN_MS - (Date.now() - coverShownAt));
  setTimeout(() => {
    const cover = document.getElementById("cover");
    cover.classList.add("leaving");
    document.body.classList.remove("covered");
    clearInterval(clockTimer);
    setTimeout(() => (cover.hidden = true), 450);
  }, wait);
}

const GOOGLE_LOGO = `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
