// Un poco más japonés — lógica de la app (sin dependencias).
// La cuenta de Google y la sincronización en la nube viven en cloud.js.

const APP_VERSION = "2026.10.27-c"; // se muestra al pie de Progreso para comprobar que la app está al día
const DAILY_GOAL = 10;
const MAX_BOX = 4;
const BOX_WEIGHT = [8, 4, 2, 1, 0.5]; // lo que fallas aparece más a menudo
const STORE_BASE = "upmj:v1"; // progreso sin sesión; con sesión: upmj:v1:<uid>
const GOAL_XP = 20;
const CUSTOM_XP = 5;

// ---------- Estado ----------

const LAST_UID_KEY = "upmj:lastUid"; // para enseñar tu línea en la portada mientras carga

function initialStoreKey() {
  try {
    const uid = localStorage.getItem(LAST_UID_KEY);
    return uid ? `${STORE_BASE}:${uid}` : STORE_BASE;
  } catch {
    return STORE_BASE;
  }
}

let storeKey = initialStoreKey();

function readStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function loadState() {
  return { ...loadStateDefaults(), ...readStored(storeKey) };
}

const state = loadState();

function persistLocal() {
  try {
    localStorage.setItem(storeKey, JSON.stringify(state));
  } catch {}
}

function save() {
  state.updatedAt = Date.now();
  persistLocal();
  if (typeof cloudQueueSave === "function") cloudQueueSave();
}

// Cambia el estado en memoria por otro (al entrar o salir de una cuenta).
function replaceState(next) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, loadStateDefaults(), next);
}

function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

function todayCorrect() {
  return state.today.date === dateKey() ? state.today.correct : 0;
}

function currentStreak() {
  const { count, last } = state.streak;
  return last === dateKey() || last === yesterdayKey() ? count : 0;
}

function recordAnswer(id, ok) {
  const box = state.boxes[id] ?? 0;
  state.boxes[id] = ok ? Math.min(box + 1, MAX_BOX) : 0;
  state.stats.total++;
  if (ok) {
    state.stats.correct++;
    const today = dateKey();
    if (state.today.date !== today) state.today = { date: today, correct: 0 };
    state.today.correct++;
    if (state.today.correct === DAILY_GOAL && state.streak.last !== today) {
      state.streak.count = state.streak.last === yesterdayKey() ? state.streak.count + 1 : 1;
      state.streak.last = today;
    }
    if (state.today.correct === DAILY_GOAL) {
      addMoment({ id: "app-goal", text: "Completé mi poco de japonés del día", xp: GOAL_XP });
    }
  }
  save();
  renderStreak();
}

// ---------- Momentos y niveles ----------

function totalXp() {
  return state.log.reduce((sum, m) => sum + m.xp, 0);
}

function levelFor(xp) {
  return LEVELS.filter((l) => l.xp <= xp).pop();
}

function loggedToday(id) {
  return state.log.some((m) => m.id === id && m.date === dateKey());
}

function addMoment({ id, text, xp }) {
  const before = levelFor(totalXp());
  state.log.push({ date: dateKey(), id, text, xp });
  save();
  const after = levelFor(totalXp());
  if (after.level > before.level) {
    toast(`🎉 ¡Subes a nivel ${after.level}! ${after.jp} · ${after.es}`);
    setTimeout(openChooser, 1200); // nueva estación: eliges su palabra
  } else toast(`+${xp} · ${text}`);
}

function removeMomentToday(id) {
  const i = state.log.findLastIndex((m) => m.id === id && m.date === dateKey());
  if (i >= 0) state.log.splice(i, 1);
  save();
}

let toastTimer;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// ---------- Utilidades ----------

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedPick(pool, avoidId) {
  const candidates = pool.length > 1 ? pool.filter((x) => x.id !== avoidId) : pool;
  const weights = candidates.map((x) => BOX_WEIGHT[state.boxes[x.id] ?? 0]);
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function distractors(correct, all, n = 3) {
  return shuffle([...new Set(all)].filter((x) => x !== correct)).slice(0, n);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const canSpeak = "speechSynthesis" in window;

function speak(text) {
  if (!canSpeak) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  speechSynthesis.speak(u);
}

function speakButton(text) {
  return canSpeak ? `<button class="speak" data-say="${esc(text)}" aria-label="Escuchar">🔊</button>` : "";
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-say]");
  if (btn) speak(btn.dataset.say);
});

// ---------- Vistas ----------

const view = document.getElementById("view");

function renderStreak() {
  document.getElementById("streak").textContent = `🔥 ${currentStreak()}`;
}

function goalCard() {
  const done = Math.min(todayCorrect(), DAILY_GOAL);
  const msg = done >= DAILY_GOAL ? "¡Hoy ya eres un poco más japonés! 🎉" : `${DAILY_GOAL - done} aciertos más para completar tu poco de hoy.`;
  return `
    <section class="card">
      <h2>Tu poco de hoy</h2>
      <div class="progress"><div style="width:${(done / DAILY_GOAL) * 100}%"></div></div>
      <p class="muted">${done}/${DAILY_GOAL} · ${msg}</p>
    </section>`;
}

function dayIndex() {
  const d = new Date();
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}

function levelCard() {
  const xp = totalXp();
  const lv = levelFor(xp);
  const next = LEVELS[lv.level];
  const pct = next ? ((xp - lv.xp) / (next.xp - lv.xp)) * 100 : 100;
  return `
    <section class="card level">
      <h2>Nivel ${lv.level}</h2>
      <p class="big" lang="ja">${lv.jp}</p>
      <p><span class="muted">${esc(lv.romaji)} ·</span> <b>${esc(lv.es)}</b></p>
      <div class="progress"><div style="width:${pct}%"></div></div>
      <p class="muted">${xp} pts${next ? ` · ${next.xp - xp} para ${next.jp} (${esc(next.es)})` : " · ¡Nivel máximo!"}</p>
      ${next ? `<p class="muted level-next">Al subir eliges la palabra de <span lang="ja">${stationName(lineStops().length + pendingStops())[0]}</span> ${stationName(lineStops().length + pendingStops())[1]}</p>` : ""}
    </section>`;
}

function momentRow(item) {
  const done = loggedToday(item.id);
  return `
    <button class="moment ${done ? "done" : ""}" data-moment="${item.id}" aria-pressed="${done}">
      <span class="check">${done ? "✓" : ""}</span>
      <span class="txt">${esc(item.text)}<small>${esc(item.note)}</small></span>
      <span class="xp">+${item.xp}</span>
    </button>`;
}

let openCategory = "notar";

function renderHoy() {
  const i = dayIndex();
  const word = VOCAB[(i * 7) % VOCAB.length];
  const phrase = PHRASES[(i * 5) % PHRASES.length];
  const today = state.log.filter((m) => m.date === dateKey());
  const todayXp = today.reduce((sum, m) => sum + m.xp, 0);
  const customToday = today.filter((m) => m.id.startsWith("custom-"));

  view.innerHTML = `
    ${levelCard()}
    ${lineHomeCard()}
    <section class="card">
      <h2>Momentos japoneses de hoy · +${todayXp}</h2>
      <p class="muted">¿Qué has hecho o notado hoy que te haya hecho sentir un poco más en Japón?</p>
      ${MOMENT_CATEGORIES.map((cat) => {
        const n = cat.items.filter((it) => loggedToday(it.id)).length;
        return `
        <details data-cat="${cat.id}" ${cat.id === openCategory ? "open" : ""}>
          <summary>${cat.title}${n ? ` <span class="badge">${n}</span>` : ""}</summary>
          <p class="muted hint">${esc(cat.hint)}</p>
          ${cat.items.map(momentRow).join("")}
        </details>`;
      }).join("")}
      <form id="custom" class="row custom">
        <input name="text" maxlength="80" placeholder="Otro momento japonés…" aria-label="Otro momento japonés">
        <button class="primary">+${CUSTOM_XP}</button>
      </form>
      ${customToday.length ? `<ul class="customs">${customToday.map((m) => `<li>✓ ${esc(m.text)} <span class="muted">+${m.xp}</span></li>`).join("")}</ul>` : ""}
    </section>
    <details class="card about">
      <summary>¿Por qué esta sección?</summary>
      <p>Al volver de Japón es muy habitual el <b>choque cultural inverso</b>: tras la euforia inicial llega un bajón en el que tu propia ciudad se siente un poco ajena (el ruido, la impuntualidad, la falta de cuidado en lo público…), hasta que poco a poco te readaptas.</p>
      <p>Uno de los consejos que más se repite es mantener en tu vida diaria los hábitos y placeres que te traes de allí. Eso es lo que celebra esta sección: cada pequeño gesto suma.</p>
    </details>
    <div id="goal">${goalCard()}</div>
    <section class="card">
      <h2>Palabra del día</h2>
      <div class="row"><p class="big" lang="ja">${esc(word.word)}</p>${speakButton(word.kana)}</div>
      <p class="mid">${esc(word.kana)} <span class="muted">· ${esc(word.romaji)}</span></p>
      <p>${esc(word.es)}</p>
    </section>
    <section class="card">
      <h2>Frase del día</h2>
      <div class="row"><p class="mid" lang="ja">${esc(phrase.jp)}</p>${speakButton(phrase.jp)}</div>
      <p class="muted">${esc(phrase.romaji)}</p>
      <p>${esc(phrase.es)}</p>
    </section>
    <div class="row">
      ${
        readingMode()
          ? `<a class="btn primary" href="#leer">Aprender a leer</a>`
          : `<a class="btn primary" href="#kana">Practicar kana</a>
             <a class="btn" href="#palabras">Practicar palabras</a>`
      }
    </div>`;

  const allItems = MOMENT_CATEGORIES.flatMap((c) => c.items);
  view.querySelectorAll("[data-moment]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = allItems.find((it) => it.id === btn.dataset.moment);
      openCategory = btn.closest("details").dataset.cat;
      if (loggedToday(item.id)) removeMomentToday(item.id);
      else addMoment(item);
      const y = window.scrollY;
      renderHoy();
      window.scrollTo(0, y);
    })
  );

  view.querySelectorAll("details[data-cat]").forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) openCategory = d.dataset.cat;
    })
  );

  view.querySelector("#custom").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    addMoment({ id: `custom-${Date.now()}`, text, xp: CUSTOM_XP });
    const y = window.scrollY;
    renderHoy();
    window.scrollTo(0, y);
  });
}

// Motor de preguntas genérico: makeQuestion(item) -> { prompt, sub, say, answer, options }
function runQuiz(container, getPool, makeQuestion) {
  let lastId = null;

  function next() {
    const item = weightedPick(getPool(), lastId);
    lastId = item.id;
    const q = makeQuestion(item);
    container.innerHTML = `
      <div class="prompt">
        <p class="big" lang="${q.promptLang}">${esc(q.prompt)}</p>
        ${q.sub ? `<p class="muted">${esc(q.sub)}</p>` : ""}
      </div>
      <div class="options">
        ${shuffle([q.answer, ...q.options]).map((o) => `<button data-opt="${esc(o)}">${esc(o)}</button>`).join("")}
      </div>
      <p class="feedback"></p>`;

    container.querySelectorAll("[data-opt]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (container.dataset.locked) return;
        container.dataset.locked = "1";
        const ok = btn.dataset.opt === q.answer;
        recordAnswer(item.id, ok);
        container.querySelectorAll("[data-opt]").forEach((b) => {
          if (b.dataset.opt === q.answer) b.classList.add("ok");
        });
        if (!ok) btn.classList.add("bad");
        if (q.say) speak(q.say);
        container.querySelector(".feedback").innerHTML = `
          ${ok ? "✅ ¡Bien!" : `❌ Era <b>${esc(q.answer)}</b>`}
          ${q.reveal ? `<br><span class="muted">${esc(q.reveal)}</span>` : ""}
          <br><button class="primary" id="next" style="margin-top:10px">Siguiente →</button>`;
        container.querySelector("#next").addEventListener("click", () => {
          delete container.dataset.locked;
          next();
        });
        const goal = document.querySelector("#goal");
        if (goal) goal.innerHTML = goalCard();
      })
    );
  }

  delete container.dataset.locked;
  next();
}

let kanaMode = "hiragana";

function renderKana() {
  const modes = { hiragana: "ひらがな", katakana: "カタカナ", ambos: "Ambos" };
  view.innerHTML = `
    <div id="goal">${goalCard()}</div>
    <div class="row seg" style="margin-bottom:16px">
      ${Object.entries(modes).map(([k, v]) => `<button data-mode="${k}" class="${k === kanaMode ? "on" : ""}">${v}</button>`).join("")}
    </div>
    <section class="card" id="quiz"></section>`;

  view.querySelectorAll("[data-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      kanaMode = b.dataset.mode;
      renderKana();
    })
  );

  const pool = () => KANA.filter((k) => kanaMode === "ambos" || k.type === kanaMode);
  runQuiz(document.getElementById("quiz"), pool, (k) => ({
    prompt: k.char,
    promptLang: "ja",
    sub: "¿Cómo se lee?",
    say: k.char,
    answer: k.romaji,
    options: distractors(k.romaji, pool().map((x) => x.romaji)),
  }));
}

function renderPalabras() {
  view.innerHTML = `
    <div id="goal">${goalCard()}</div>
    <section class="card" id="quiz"></section>`;

  runQuiz(document.getElementById("quiz"), () => VOCAB, (v) => {
    const jpToEs = Math.random() < 0.5;
    return jpToEs
      ? {
          prompt: v.word,
          promptLang: "ja",
          sub: `${v.kana} · ¿Qué significa?`,
          say: v.kana,
          answer: v.es,
          options: distractors(v.es, VOCAB.map((x) => x.es)),
          reveal: `${v.word} (${v.kana}, ${v.romaji})`,
        }
      : {
          prompt: v.es,
          promptLang: "es",
          sub: "¿Cómo se dice en japonés?",
          say: v.kana,
          answer: v.word,
          options: distractors(v.word, VOCAB.map((x) => x.word)),
          reveal: `${v.kana} · ${v.romaji}`,
        };
  });
}

function renderProgreso() {
  const lv = (id) => state.boxes[id] ?? 0;
  const mastered = (items) => items.filter((x) => lv(x.id) >= 3).length;
  const grid = (items) =>
    `<div class="grid">${items.map((k) => `<div class="cell lv${lv(k.id)}" lang="ja">${k.char}<small>${k.romaji}</small></div>`).join("")}</div>`;
  const hira = KANA.filter((k) => k.type === "hiragana");
  const kata = KANA.filter((k) => k.type === "katakana");
  const { correct, total } = state.stats;

  view.innerHTML = `
    ${typeof accountCard === "function" ? accountCard() : ""}
    ${readingModeCard()}
    <section class="card">
      <h2>Intro al abrir la app</h2>
      <p class="muted">${state.skipIntro ? "Desactivada: la app se abre directamente, sin intro ni música." : "Activada: cada vez que abres la app, la intro con su melodía de caja de música."}</p>
      <button type="button" id="toggle-intro" aria-pressed="${!state.skipIntro}">${state.skipIntro ? "Activar la intro" : "Desactivar la intro"}</button>
    </section>
    <section class="card">
      <h2>Resumen</h2>
      <p>🎌 Nivel <b>${levelFor(totalXp()).level}</b> · ${levelFor(totalXp()).jp} (${esc(levelFor(totalXp()).es)}) · ${totalXp()} pts</p>
      <p>🌸 Momentos japoneses apuntados: <b>${state.log.filter((m) => m.id !== "app-goal").length}</b></p>
      <p>🔥 Racha: <b>${currentStreak()}</b> días</p>
      <p>🎯 Aciertos: <b>${correct}</b> de ${total}${total ? ` (${Math.round((correct / total) * 100)}%)` : ""}</p>
      <p>あ Hiragana dominado: <b>${mastered(hira)}</b>/${hira.length}</p>
      <p>ア Katakana dominado: <b>${mastered(kata)}</b>/${kata.length}</p>
      <p>語 Palabras dominadas: <b>${mastered(VOCAB)}</b>/${VOCAB.length}</p>
      <p class="muted">Un elemento cuenta como dominado tras 3 aciertos seguidos.</p>
    </section>
    <section class="card"><h2>Hiragana</h2>${grid(hira)}</section>
    <section class="card"><h2>Katakana</h2>${grid(kata)}</section>
    <button id="reset">Borrar progreso</button>
    <p class="muted version">Versión ${APP_VERSION}</p>`;

  document.getElementById("toggle-intro").addEventListener("click", () => {
    state.skipIntro = !state.skipIntro;
    state.introAsked = true;
    save();
    renderProgreso();
  });
  document.getElementById("switch-mode").addEventListener("click", () => {
    setReadingMode(readingMode() ? "yes" : "no");
    renderProgreso();
  });

  document.getElementById("reset").addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres borrar todo tu progreso?")) return;
    replaceState({});
    save();
    renderStreak();
    renderProgreso();
  });
}

function loadStateDefaults() {
  return { boxes: {}, stats: { correct: 0, total: 0 }, today: { date: "", correct: 0 }, streak: { count: 0, last: "" }, log: [], line: [], reads: null, introViews: 0, introAsked: false, skipIntro: false, updatedAt: 0 };
}

// ---------- Navegación ----------

const ROUTES = { hoy: renderHoy, linea: renderLinea, leer: renderLeer, kana: renderKana, palabras: renderPalabras, progreso: renderProgreso };

function route() {
  updateTabs();
  let name = location.hash.slice(1);
  // Cada modo tiene sus pestañas: quien aprende a leer va a «Leer» en vez de «Kana» o «Palabras», y al revés.
  if (readingMode() && (name === "kana" || name === "palabras")) name = "leer";
  if (!readingMode() && name === "leer") name = "kana";
  const tab = ROUTES[name] ? name : "hoy";
  document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
  ROUTES[tab]();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
renderStreak();
route();
// Al abrir la app: intro con melodía. Sin sesión termina en el inicio de sesión; con sesión
// termina como pantalla de carga, salvo que se haya desactivado (entonces se entra directamente).
if (!playIntro()) renderCover("loading");
if (!FIREBASE_CONFIG) hideCover();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
