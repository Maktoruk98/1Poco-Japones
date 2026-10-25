// Un poco más japonés — lógica de la app (sin dependencias).

const DAILY_GOAL = 10;
const MAX_BOX = 4;
const BOX_WEIGHT = [8, 4, 2, 1, 0.5]; // lo que fallas aparece más a menudo
const STORE_KEY = "upmj:v1";

// ---------- Estado ----------

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved) return saved;
  } catch {}
  return loadStateDefaults();
}

const state = loadState();

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {}
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
  }
  save();
  renderStreak();
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

function renderHoy() {
  const i = dayIndex();
  const word = VOCAB[(i * 7) % VOCAB.length];
  const phrase = PHRASES[(i * 5) % PHRASES.length];
  view.innerHTML = `
    ${goalCard()}
    <section class="card">
      <h2>Palabra del día</h2>
      <div class="row"><p class="big">${esc(word.word)}</p>${speakButton(word.kana)}</div>
      <p class="mid">${esc(word.kana)} <span class="muted">· ${esc(word.romaji)}</span></p>
      <p>${esc(word.es)}</p>
    </section>
    <section class="card">
      <h2>Frase del día</h2>
      <div class="row"><p class="mid">${esc(phrase.jp)}</p>${speakButton(phrase.jp)}</div>
      <p class="muted">${esc(phrase.romaji)}</p>
      <p>${esc(phrase.es)}</p>
    </section>
    <div class="row">
      <a class="btn primary" href="#kana">Practicar kana</a>
      <a class="btn" href="#palabras">Practicar palabras</a>
    </div>`;
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
    <section class="card">
      <h2>Resumen</h2>
      <p>🔥 Racha: <b>${currentStreak()}</b> días</p>
      <p>🎯 Aciertos: <b>${correct}</b> de ${total}${total ? ` (${Math.round((correct / total) * 100)}%)` : ""}</p>
      <p>あ Hiragana dominado: <b>${mastered(hira)}</b>/${hira.length}</p>
      <p>ア Katakana dominado: <b>${mastered(kata)}</b>/${kata.length}</p>
      <p>語 Palabras dominadas: <b>${mastered(VOCAB)}</b>/${VOCAB.length}</p>
      <p class="muted">Un elemento cuenta como dominado tras 3 aciertos seguidos.</p>
    </section>
    <section class="card"><h2>Hiragana</h2>${grid(hira)}</section>
    <section class="card"><h2>Katakana</h2>${grid(kata)}</section>
    <button id="reset">Borrar progreso</button>`;

  document.getElementById("reset").addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres borrar todo tu progreso?")) return;
    Object.assign(state, loadStateDefaults());
    save();
    renderStreak();
    renderProgreso();
  });
}

function loadStateDefaults() {
  return { boxes: {}, stats: { correct: 0, total: 0 }, today: { date: "", correct: 0 }, streak: { count: 0, last: "" } };
}

// ---------- Navegación ----------

const ROUTES = { hoy: renderHoy, kana: renderKana, palabras: renderPalabras, progreso: renderProgreso };

function route() {
  const name = location.hash.slice(1);
  const tab = ROUTES[name] ? name : "hoy";
  document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
  ROUTES[tab]();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
renderStreak();
route();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
