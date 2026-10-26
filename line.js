// La línea: tu propia Osaka Loop Line (大阪環状線). Cada nivel es una estación y, al subir
// de nivel, eliges la palabra que quieres dejar en ella. También dibuja la portada
// (pantalla de carga e inicio de sesión) con el anillo.

const LOOP_STATIONS = 19; // la Loop Line real tiene 19 estaciones, una por nivel
const FIRST_STATION_NUMBER = 15; // Bentenchō es la JR-O15 (la numeración empieza en Tennōji)

const FIRST_STOP = {
  id: "stop-bentencho",
  jp: "弁天町",
  romaji: "Bentenchō",
  es: "Tu primera parada en la Loop Line.",
  note: "",
  date: "",
};

// Nombres reales de las estaciones, por número JR-O (1 = Tennōji).
const STATION_NAMES = [
  ["天王寺", "Tennōji"], ["寺田町", "Teradachō"], ["桃谷", "Momodani"], ["鶴橋", "Tsuruhashi"],
  ["玉造", "Tamatsukuri"], ["森ノ宮", "Morinomiya"], ["大阪城公園", "Ōsakajōkōen"], ["京橋", "Kyōbashi"],
  ["桜ノ宮", "Sakuranomiya"], ["天満", "Temma"], ["大阪", "Ōsaka"], ["福島", "Fukushima"],
  ["野田", "Noda"], ["西九条", "Nishikujō"], ["弁天町", "Bentenchō"], ["大正", "Taishō"],
  ["芦原橋", "Ashiharabashi"], ["今宮", "Imamiya"], ["新今宮", "Shin-Imamiya"],
];

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

function stationNumberOf(i) {
  return ((FIRST_STATION_NUMBER - 1 + i) % LOOP_STATIONS) + 1;
}

function stationNumber(i) {
  return String(stationNumberOf(i)).padStart(2, "0");
}

function stationName(i) {
  return STATION_NAMES[stationNumberOf(i) - 1];
}

function stopTitle(stop) {
  return stop.jp || toHiragana(stop.romaji);
}

function stopKana(stop) {
  return stop.jp ? toHiragana(stop.romaji) : "";
}

// Paradas que te has ganado subiendo de nivel y aún no has elegido.
function pendingStops() {
  return Math.max(0, levelFor(totalXp()).level - lineStops().length);
}

function addStop(stop) {
  if (!state.line || !state.line.length) state.line = [FIRST_STOP];
  state.line.push({ id: `stop-${Date.now()}`, date: dateKey(), ...stop });
  save();
}

function removeStop(id) {
  state.line = lineStops().filter((s) => s.id !== id);
  save();
}

// Lo que más has practicado y acertado, más la palabra y la frase del día.
function wordSuggestions() {
  const used = new Set(lineStops().map((s) => s.romaji.toLowerCase()));
  const i = dayIndex();
  const todayWord = VOCAB[(i * 7) % VOCAB.length];
  const todayPhrase = PHRASES[(i * 5) % PHRASES.length];
  const learned = VOCAB.filter((v) => (state.boxes[v.id] ?? 0) > 0)
    .sort((a, b) => (state.boxes[b.id] ?? 0) - (state.boxes[a.id] ?? 0))
    .map((v) => ({ jp: v.word, romaji: v.romaji, es: v.es, why: `Dominio ${state.boxes[v.id]}/4` }));
  const extra = [
    { jp: todayWord.word, romaji: todayWord.romaji, es: todayWord.es, why: "Palabra del día" },
    { jp: todayPhrase.jp, romaji: todayPhrase.romaji, es: todayPhrase.es, why: "Frase del día" },
  ];
  const seen = new Set();
  return [...learned, ...extra]
    .filter((s) => !used.has(s.romaji.toLowerCase()) && !seen.has(s.romaji) && seen.add(s.romaji))
    .slice(0, 6);
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
        ${end(next, { jp: "？", es: "próximo nivel" }, "next")}
      </div>
    </div>`;
}

// ---------- El anillo ----------

const RING = { cx: 180, cy: 180, r: 128 };

// Posición de una estación por número JR-O: Tennōji (O01) abajo y los números
// creciendo hacia el este y el norte, como en el mapa real.
function ringPoint(n, r = RING.r) {
  const a = ((90 - (n - 1) * 360 / LOOP_STATIONS) * Math.PI) / 180;
  return [RING.cx + r * Math.cos(a), RING.cy + r * Math.sin(a), Math.cos(a)];
}

// mode "login": solo Bentenchō. mode "words": tus paradas (de la vuelta de `selected`).
// animate: el anillo se dibuja y las paradas aparecen una a una (portada).
function ringSVG({ mode = "words", selected = null, animate = false } = {}) {
  const stops = mode === "login" ? [FIRST_STOP] : lineStops();
  const sel = selected ?? stops.length - 1;
  const newest = stops.length - 1;
  const lap = Math.floor(sel / LOOP_STATIONS);
  const inLap = Math.min(LOOP_STATIONS, stops.length - lap * LOOP_STATIONS);
  const many = inLap > 8;
  const gap = Math.min(0.32, 1.6 / Math.max(1, inLap));
  const parts = [`<circle class="lr-ring ${animate ? "draw" : ""}" cx="${RING.cx}" cy="${RING.cy}" r="${RING.r}"/>`];

  for (let n = 1; n <= LOOP_STATIONS; n++) {
    const [x, y] = ringPoint(n);
    const delay = animate ? ` style="animation-delay:${(0.3 + n * 0.03).toFixed(2)}s"` : "";
    parts.push(`<circle class="lr-st ${animate ? "fade" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"${delay}/>`);
  }

  const labels = [];
  for (let k = 0; k < inLap; k++) {
    const i = lap * LOOP_STATIONS + k;
    const stop = stops[i];
    const n = stationNumberOf(i);
    const [x, y] = ringPoint(n);
    const [lx, ly, cos] = ringPoint(n, RING.r + 20);
    const anchor = cos < -0.2 ? "end" : cos > 0.2 ? "start" : "middle";
    const delay = animate ? ` style="animation-delay:${(0.9 + k * gap).toFixed(2)}s"` : "";
    const beating = i === newest;
    const dot = `<circle class="lr-on ${animate ? "pop" : ""} ${i === sel ? "sel" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${beating ? 7 : 5}" data-stop="${i}"${delay}/>`;
    parts.push(beating ? `<g class="lr-beat"><circle class="lr-halo" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12"/>${dot}</g>` : dot);
    labels.push(`
      <g class="lr-lbl ${animate ? "fade" : ""} ${i === sel ? "sel" : ""}" text-anchor="${anchor}" data-stop="${i}"${delay}>
        <text x="${lx.toFixed(1)}" y="${(ly - (many ? 0 : 2)).toFixed(1)}" class="lr-name" font-size="${many ? 11.5 : 15}" lang="ja">${esc(shorten(stopTitle(stop), many ? 4 : 6))}</text>
        ${many ? "" : `<text x="${lx.toFixed(1)}" y="${(ly + 13).toFixed(1)}" class="lr-ro">${esc(shorten(stop.romaji, 14))}</text>`}
      </g>`);
  }

  const centerDelay = animate ? ` style="animation-delay:${(0.9 + inLap * gap).toFixed(2)}s"` : "";
  let center;
  if (mode === "login") {
    center = `<text x="180" y="180" class="lr-c" font-size="46">少し</text><text x="180" y="208" class="lr-cs">SUKOSHI</text>`;
  } else {
    const s = stops[sel];
    const title = stopTitle(s);
    center = `
      <text x="180" y="170" class="lr-c" font-size="${[...title].length > 4 ? 28 : 38}" lang="ja">${esc(shorten(title, 7))}</text>
      <text x="180" y="194" class="lr-cs">${esc(shorten(s.romaji.toUpperCase(), 18))} · JR-O${stationNumber(sel)}</text>
      <text x="180" y="228" class="lr-cs lr-count">${inLap} / ${LOOP_STATIONS}${lap ? ` · vuelta ${lap + 1}` : ""}</text>`;
  }

  return `
    <svg class="loop-ring" viewBox="0 0 360 360" role="img" aria-label="Tu Loop Line: ${inLap} de ${LOOP_STATIONS} estaciones">
      ${parts.join("")}
      ${labels.join("")}
      <g class="lr-center ${animate ? "fade" : ""}"${centerDelay}>${center}</g>
    </svg>`;
}

function ringAnimationMs() {
  const inLap = Math.min(LOOP_STATIONS, lineStops().length);
  return Math.round((0.9 + inLap * Math.min(0.32, 1.6 / inLap) + 0.9) * 1000);
}

// ---------- Elegir la palabra al subir de nivel ----------

function openChooser() {
  if (!pendingStops() || document.getElementById("chooser")) return;
  const i = lineStops().length;
  const [jp, en] = stationName(i);
  const level = LEVELS[Math.min(i, LEVELS.length - 1)];
  const suggestions = wordSuggestions();
  const box = document.createElement("div");
  box.id = "chooser";
  box.className = "chooser";
  box.innerHTML = `
    <div class="chooser-card" role="dialog" aria-modal="true" aria-labelledby="chooser-title">
      <p class="chooser-kicker">Nivel ${level.level} · <span lang="ja">${level.jp}</span> ${esc(level.es)}</p>
      <h2 id="chooser-title">Elige la palabra para tu próxima estación</h2>
      <p class="chooser-station"><span class="badge-o">O${stationNumber(i)}</span> <b lang="ja">${jp}</b> ${en}</p>
      ${
        suggestions.length
          ? `<p class="muted">La que más te ha gustado aprender, o la que más te guste ahora:</p>
             <div class="suggestions">
               ${suggestions
                 .map(
                   (s, k) => `
                 <button type="button" class="suggestion" data-pick="${k}">
                   <b lang="ja">${esc(s.jp)}</b>
                   <span>${esc(s.romaji)} · ${esc(s.es)}</span>
                   <small>${esc(s.why)}</small>
                 </button>`
                 )
                 .join("")}
             </div>`
          : ""
      }
      <details class="own" ${suggestions.length ? "" : "open"}>
        <summary>✍️ Escribir la mía</summary>
        <form id="stop-form" class="stop-form">
          <label for="sf-romaji">¿Cómo suena? <input id="sf-romaji" name="romaji" required maxlength="80" placeholder="Shiritai nara oshiete ageru yo… ano yo de ne" autocomplete="off"></label>
          <p class="preview muted" lang="ja"></p>
          <label for="sf-es">¿Qué significa? <input id="sf-es" name="es" maxlength="120" placeholder="Opcional" autocomplete="off"></label>
          <label for="sf-jp">En japonés <input id="sf-jp" name="jp" maxlength="40" lang="ja" placeholder="Opcional: kanji o kana, si los sabes" autocomplete="off"></label>
          <label for="sf-note">¿De dónde la recuerdas? <input id="sf-note" name="note" maxlength="120" placeholder="Opcional: un anime, una canción, el viaje…" autocomplete="off"></label>
          <button class="primary">🚉 Poner en mi línea</button>
        </form>
      </details>
      <button type="button" class="later" data-later>Más tarde</button>
    </div>`;
  document.body.append(box);
  document.body.classList.add("covered");

  const choose = (stop) => {
    addStop(stop);
    closeChooser();
    toast(`🚉 Nueva parada en O${stationNumber(i)}: ${stopTitle(stop)}`);
    selectedStop = null;
    route();
    if (pendingStops()) setTimeout(openChooser, 700);
  };
  box.querySelectorAll("[data-pick]").forEach((b) =>
    b.addEventListener("click", () => {
      const s = suggestions[Number(b.dataset.pick)];
      choose({ jp: s.jp, romaji: s.romaji, es: s.es, note: "" });
    })
  );
  const form = box.querySelector("#stop-form");
  const preview = form.querySelector(".preview");
  form.romaji.addEventListener("input", () => {
    preview.textContent = form.romaji.value.trim() ? `Cartel: ${toHiragana(form.romaji.value.trim())}` : "";
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (name) => form[name].value.trim();
    choose({ romaji: val("romaji"), es: val("es"), note: val("note"), jp: val("jp") });
  });
  box.querySelector("[data-later]").addEventListener("click", closeChooser);
}

function closeChooser() {
  document.getElementById("chooser")?.remove();
  if (document.getElementById("cover").hidden) document.body.classList.remove("covered");
}

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-choose]")) openChooser();
});

// ---------- Pestaña Línea ----------

let selectedStop = null;

function nextStationHint() {
  const xp = totalXp();
  const next = LEVELS[levelFor(xp).level];
  if (!next) return "Has llegado al último nivel. ¡Vuelta completa!";
  const [jp, en] = stationName(lineStops().length);
  return `Al subir al nivel ${next.level} (faltan ${next.xp - xp} pts) eliges la palabra para <b lang="ja">${jp}</b> ${en}.`;
}

function renderLinea() {
  const stops = lineStops();
  if (selectedStop === null || selectedStop >= stops.length) selectedStop = stops.length - 1;
  const stop = stops[selectedStop];
  const pending = pendingStops();

  view.innerHTML = `
    <section class="card line-card">
      <div class="ring-wrap">${ringSVG({ selected: selectedStop })}</div>
      ${stationSign(selectedStop)}
      ${stop.es ? `<p class="stop-es">${esc(stop.es)}</p>` : ""}
      ${stop.note ? `<p class="muted">📍 ${esc(stop.note)}</p>` : ""}
    </section>

    <section class="card">
      ${
        pending
          ? `<h2>🚉 ${pending === 1 ? "Tienes una estación por elegir" : `Tienes ${pending} estaciones por elegir`}</h2>
             <p class="muted">Has subido de nivel: elige la palabra que quieres dejar en tu línea.</p>
             <button type="button" class="primary" data-choose>Elegir palabra</button>`
          : `<h2>Próxima estación</h2><p class="muted">${nextStationHint()}</p>`
      }
    </section>

    <section class="card">
      <h2>Tus estaciones</h2>
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
            ${i > 0 && s.id ? `<button class="del" data-del="${esc(s.id)}" aria-label="Quitar estación">×</button>` : ""}
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
      if (!confirm("¿Quitar esta estación? Podrás elegir otra palabra para ella.")) return;
      removeStop(el.dataset.del);
      selectedStop = null;
      renderLinea();
    })
  );
}

// Tarjeta de la pantalla Hoy: estación por elegir, o tu última estación.
function lineHomeCard() {
  const stops = lineStops();
  const pending = pendingStops();
  if (pending) {
    return `
      <section class="card line-pending">
        <h2>🚉 Nueva estación desbloqueada</h2>
        <p>Has subido de nivel. Elige la palabra que quieres dejar en <b lang="ja">${stationName(stops.length)[0]}</b> ${stationName(stops.length)[1]}.</p>
        <button type="button" class="primary" data-choose>Elegir palabra</button>
      </section>`;
  }
  return `
    <a class="card line-today" href="#linea">
      <h2>Tu última estación</h2>
      ${stationSign(stops.length - 1, { compact: true })}
    </a>`;
}

// ---------- Portada: intro, inicio de sesión y pantalla de carga ----------

const coverShownAt = Date.now();
let coverMinMs = 1200;

// Fondo del Fuji al amanecer: cielo melocotón y montaña lavanda, anclado abajo.
function fujiBackground() {
  return `
    <svg class="fuji" viewBox="0 0 390 844" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="fuji-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f6f1ea"/><stop offset=".45" stop-color="#f8e9dd"/><stop offset=".72" stop-color="#f6ddd3"/><stop offset="1" stop-color="#f3e7e4"/>
        </linearGradient>
        <linearGradient id="fuji-mount" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ddd3e2"/><stop offset="1" stop-color="#ebe3ea"/>
        </linearGradient>
      </defs>
      <rect class="fuji-sky" width="390" height="844" fill="url(#fuji-sky)"/>
      <g class="fuji-land">
        <path d="M-20 790 L60 744 L120 730 L190 748 L260 728 L330 740 L410 716 L410 844 L-20 844 Z" fill="#efe6e6"/>
        <path d="M-40 800 C40 770 110 720 150 668 C165 646 176 626 184 610 L206 610 C214 626 225 646 240 668 C280 720 350 770 430 800 L430 844 L-40 844 Z" fill="url(#fuji-mount)"/>
        <path d="M184 610 L206 610 C212 622 220 638 229 652 L222 648 L214 660 L206 650 L197 664 L189 650 L180 662 L172 650 L163 654 C171 640 178 624 184 610 Z" fill="#faf7f3"/>
        <path d="M-20 812 C80 800 150 815 230 806 C300 798 360 812 410 806 L410 844 L-20 844 Z" fill="#f4eeec" opacity=".9"/>
      </g>
    </svg>`;
}

function proverbOfTheDay() {
  return PROVERBS[dayIndex() % PROVERBS.length];
}

// mode: "loading" (abriendo la app) | "login" (falta iniciar sesión) | "offline" (sin nube)
// still: sin animaciones de entrada (al llegar desde la intro, que ya ha dibujado el anillo)
function renderCover(mode, { still = false } = {}) {
  if (introPlaying) {
    introNext = mode;
    return;
  }
  const cover = document.getElementById("cover");
  const signedIn = mode === "loading" && storeKey !== STORE_BASE;
  still = still || introDone;
  cover.hidden = false;
  cover.classList.remove("leaving");
  document.body.classList.add("covered");

  if (signedIn) {
    const stops = lineStops();
    const [nextJp, nextEn] = stationName(stops.length + pendingStops());
    const p = proverbOfTheDay();
    coverMinMs = Math.max(ringAnimationMs(), 4000); // tiempo para leer el proverbio
    cover.innerHTML = `
      ${fujiBackground()}
      <div class="ac">
        <div class="ac-kicker"><b lang="ja">大阪環状線</b> · OSAKA LOOP LINE</div>
        <div class="ac-ring">${ringSVG({ animate: true })}</div>
        <h1 class="ac-welcome" lang="ja">おかえりなさい<small>OKAERINASAI</small></h1>
        <p class="ac-sub">Ya estás de vuelta en tu pequeño Japón.</p>
        <div class="ac-rule"></div>
        <p class="ac-trip">Estación ${Math.min(stops.length, LOOP_STATIONS)} de ${LOOP_STATIONS} · siguiente: <b lang="ja">${nextJp}</b> ${nextEn}</p>
        <div class="ac-proverb"><b lang="ja">${p.jp}</b><span>${esc(p.romaji)} · «${esc(p.es.replace(/\.$/, ""))}»</span></div>
        <div class="ac-action"><p class="ac-depart"><b lang="ja">まもなく発車します</b>Salimos en un momento</p></div>
      </div>`;
    return;
  }

  coverMinMs = 1200;
  cover.innerHTML = `
    ${fujiBackground()}
    <div class="ac ${still ? "still" : ""}">
      <div class="ac-kicker"><b lang="ja">大阪環状線</b> · OSAKA LOOP LINE</div>
      <div class="ac-ring">${ringSVG({ mode: "login", animate: !still })}</div>
      <h1 class="ac-title">Un poco más japonés</h1>
      <div class="ac-rule"></div>
      <p class="ac-sub">Diecinueve estaciones.<br>Una palabra por cada nivel.</p>
      <div class="ac-action">
        ${
          mode === "login"
            ? `<button class="ac-google" data-cloud="in">${GOOGLE_LOGO}Continuar con Google</button>`
            : mode === "offline"
              ? `<p class="ac-sub">Sin conexión con la nube.</p><button class="ac-plain" data-cover="enter">Continuar sin sesión</button>`
              : `<p class="ac-depart"><b lang="ja">まもなく発車します</b>Salimos en un momento</p>`
        }
      </div>
    </div>`;
  cover.querySelector("[data-cover=enter]")?.addEventListener("click", () => hideCover());
}

function hideCover() {
  if (introPlaying) {
    introNext = "hide";
    return;
  }
  const wait = Math.max(0, coverMinMs - (Date.now() - coverShownAt));
  setTimeout(() => {
    const cover = document.getElementById("cover");
    cover.classList.add("leaving");
    if (!document.getElementById("chooser")) document.body.classList.remove("covered");
    setTimeout(() => {
      cover.hidden = true;
      if (pendingStops()) openChooser();
    }, 450);
  }, wait);
}

// ---------- Intro (12 s, se puede saltar) ----------

const INTRO_MS = 12000;
let introPlaying = false;
let introDone = false; // tras la intro, la portada ya no repite sus animaciones de entrada
let introNext = null; // lo que pidió la app mientras sonaba la intro: "login", "offline", "loading" o "hide"
let introTimers = [];

// Cada paso: [momento en ms, qué hace]. Las escenas se encienden con la clase "on".
const INTRO_STEPS = [
  [200, "sun"], [700, "line-1"], [2300, "land"], [3200, "line-1-out"], [3600, "line-2"],
  [5800, "line-2-out"], [6100, "ring"], [7300, "line-3"], [9300, "line-3-out"], [9700, "title"],
];

// El sol de la intro viaja hasta Bentenchō y se convierte en su punto.
function sunToBentencho() {
  const [x, y] = ringPoint(FIRST_STATION_NUMBER);
  return `--dx:${(x - RING.cx).toFixed(1)}px;--dy:${(y - RING.cy).toFixed(1)}px`;
}

function playIntro() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  introPlaying = true;
  const cover = document.getElementById("cover");
  cover.hidden = false;
  document.body.classList.add("covered");
  cover.innerHTML = `
    ${fujiBackground()}
    <div class="intro" id="intro">
      <button type="button" class="intro-skip" data-skip>Saltar ›</button>
      <div class="ac">
        <div class="ac-kicker intro-late"><b lang="ja">大阪環状線</b> · OSAKA LOOP LINE</div>
        <div class="ac-ring">
          <svg class="loop-ring" viewBox="0 0 360 360" aria-hidden="true">
            <circle class="intro-sun" cx="${RING.cx}" cy="${RING.cy}" r="16" style="${sunToBentencho()}"/>
            <g class="intro-ring"></g>
          </svg>
        </div>
        <div class="intro-lines">
          <p class="intro-line" data-line="1"><b lang="ja">少しずつ</b><span>sukoshi zutsu · poco a poco</span></p>
          <p class="intro-line" data-line="2">Volviste de Japón.<br>Japón no se ha ido de ti.</p>
          <p class="intro-line" data-line="3">Cada nivel, una estación.<br>Cada estación, una palabra.</p>
          <h1 class="intro-title">Un poco más japonés</h1>
        </div>
      </div>
    </div>`;
  const intro = cover.querySelector("#intro");
  cover.classList.add("intro-mode");
  INTRO_STEPS.forEach(([ms, step]) =>
    introTimers.push(
      setTimeout(() => {
        // El anillo se inserta justo ahora para que su animación de dibujo empiece en este momento.
        if (step === "ring") intro.querySelector(".intro-ring").innerHTML = ringSVG({ mode: "login", animate: true }).replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "");
        cover.classList.add(`s-${step}`);
      }, ms)
    )
  );
  introTimers.push(setTimeout(endIntro, INTRO_MS));
  intro.querySelector("[data-skip]").addEventListener("click", endIntro);
  return true;
}

function endIntro() {
  if (!introPlaying) return;
  introTimers.forEach(clearTimeout);
  introTimers = [];
  introPlaying = false;
  introDone = true;
  const cover = document.getElementById("cover");
  cover.classList.remove("intro-mode", ...[...cover.classList].filter((c) => c.startsWith("s-")));
  const next = introNext;
  introNext = null;
  if (next === "hide") {
    coverMinMs = 0;
    hideCover();
  } else if (next === "offline" || next === "login") {
    renderCover(next, { still: true });
  } else {
    // La app aún no ha dicho nada (la nube tarda): enseñamos el inicio sin botón hasta que conteste.
    renderCover("loading", { still: true });
  }
}

const GOOGLE_LOGO = `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
