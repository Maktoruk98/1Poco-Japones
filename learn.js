// Aprender a leer: para quien aún no conoce los símbolos. Lecciones por filas de kana
// (あいうえお, かきくけこ…): primero se presenta cada símbolo con su sonido y una palabra de
// ejemplo, y después se practica en los dos sentidos (símbolo → sonido y sonido → símbolo).

const PRACTICE_QUESTIONS = 10;
const LEARNED_BOX = 2; // un símbolo cuenta como aprendido tras acertarlo dos veces seguidas

const SCRIPTS = [
  { type: "hiragana", jp: "ひらがな", title: "Hiragana", hint: "El alfabeto de las palabras japonesas. Se aprende primero." },
  { type: "katakana", jp: "カタカナ", title: "Katakana", hint: "Para palabras extranjeras: café, España, televisión…" },
];

const LESSONS = SCRIPTS.flatMap((script) =>
  KANA_ROWS.map((row, i) => ({
    id: `${script.type}-${i}`,
    type: script.type,
    number: i + 1,
    items: row.map((r) => KANA.find((k) => k.type === script.type && k.romaji === r)),
  }))
);

function readingMode() {
  return state.reads === "no";
}

function lessonLearned(lesson) {
  return lesson.items.every((k) => (state.boxes[k.id] ?? 0) >= LEARNED_BOX);
}

function lessonUnlocked(index) {
  const lesson = LESSONS[index];
  const prev = LESSONS[index - 1];
  // El katakana empieza cuando se ha terminado el hiragana.
  return index === 0 || lessonLearned(prev) || (lesson.number === 1 && LESSONS.filter((l) => l.type === "hiragana").every(lessonLearned));
}

function learnedItems() {
  return LESSONS.filter(lessonLearned).flatMap((l) => l.items);
}

// Consejo de pronunciación para un símbolo (los de partícula solo aplican al hiragana).
function kanaTip(k) {
  if (k.romaji === "a") return k.type === "hiragana" ? KANA_TIPS.a : "";
  if (k.type === "katakana" && ["ha", "he"].includes(k.romaji)) return "";
  return KANA_TIPS[k.romaji] || (k.romaji.startsWith("r") ? KANA_TIPS.ra : "");
}

function exampleOf(k) {
  return KANA_EXAMPLES[k.type][k.romaji];
}

// ---------- La pregunta inicial ----------

function openReadsQuestion(onDone) {
  if (document.getElementById("reads-question")) return;
  const box = document.createElement("div");
  box.id = "reads-question";
  box.className = "chooser";
  box.innerHTML = `
    <div class="chooser-card" role="dialog" aria-modal="true" aria-labelledby="reads-title">
      <p class="chooser-kicker">Antes de empezar</p>
      <h2 id="reads-title">¿Conoces ya los símbolos japoneses?</h2>
      <p class="muted">El japonés se escribe con dos alfabetos de símbolos: <b lang="ja">ひらがな</b> hiragana y <b lang="ja">カタカナ</b> katakana. Por ejemplo, <b lang="ja">ねこ</b> se lee «neko» (gato).</p>
      <div class="reads-options">
        <button type="button" class="suggestion" data-reads="yes">
          <b>Sí, ya los sé leer</b>
          <span>Te llevo directamente a los ejercicios de kana y vocabulario.</span>
        </button>
        <button type="button" class="suggestion" data-reads="no">
          <b>Todavía no</b>
          <span>Empezamos por aprender cada símbolo con su sonido, fila a fila.</span>
        </button>
      </div>
      <p class="muted small">Puedes cambiarlo cuando quieras desde Progreso.</p>
    </div>`;
  document.body.append(box);
  document.body.classList.add("covered");
  box.querySelectorAll("[data-reads]").forEach((b) =>
    b.addEventListener("click", () => {
      setReadingMode(b.dataset.reads);
      box.remove();
      if (document.getElementById("cover").hidden) document.body.classList.remove("covered");
      location.hash = b.dataset.reads === "no" ? "#leer" : "#hoy";
      route();
      onDone && onDone();
    })
  );
}

function setReadingMode(value) {
  state.reads = value;
  save();
  updateTabs();
}

// Pestañas según el modo: «Leer» para quien aprende los símbolos; «Kana» y «Palabras» para quien ya lee.
function updateTabs() {
  const learning = readingMode();
  document.querySelectorAll(".tabs a").forEach((a) => {
    const t = a.dataset.tab;
    a.hidden = learning ? t === "kana" || t === "palabras" : t === "leer";
  });
}

// ---------- Pestaña Leer ----------

let lesson = null; // { index | null (repaso), phase: "intro" | "practice" | "done", step, questions, answered, correct }

function renderLeer() {
  if (!lesson) return renderLessonMap();
  if (lesson.phase === "intro") return renderLessonIntro();
  if (lesson.phase === "practice") return renderPractice();
  return renderLessonDone();
}

function renderLessonMap() {
  const learned = LESSONS.filter(lessonLearned).length;
  const allDone = learned === LESSONS.length;
  const hiraDone = LESSONS.filter((l) => l.type === "hiragana").every(lessonLearned);
  view.innerHTML = `
    <div id="goal">${goalCard()}</div>
    <section class="card read-hero">
      <h2>Aprender a leer</h2>
      <p>Cada lección te presenta una fila de símbolos con su sonido y una palabra de ejemplo. Después practicas hasta que los reconozcas.</p>
      <div class="progress"><div style="width:${(learned / LESSONS.length) * 100}%"></div></div>
      <p class="muted">${learned} de ${LESSONS.length} lecciones aprendidas</p>
      ${learned ? `<button type="button" class="btn" id="review">↻ Repaso de todo lo aprendido</button>` : ""}
      ${
        allDone
          ? `<div class="read-banner">🎉 ¡Ya conoces todos los símbolos! <button type="button" class="primary" id="go-full">Pasar a los ejercicios completos</button></div>`
          : hiraDone
            ? `<div class="read-banner">🎉 ¡Ya lees hiragana! Ahora toca el katakana.</div>`
            : ""
      }
    </section>
    ${SCRIPTS.map(
      (script) => `
      <section class="card">
        <h2><span lang="ja">${script.jp}</span> · ${script.title}</h2>
        <p class="muted">${script.hint}</p>
        <div class="lessons">
          ${LESSONS.map((l, i) => ({ l, i }))
            .filter(({ l }) => l.type === script.type)
            .map(({ l, i }) => {
              const open = lessonUnlocked(i);
              const done = lessonLearned(l);
              const started = l.items.some((k) => state.boxes[k.id] !== undefined);
              const status = done ? "Aprendida ✓" : !open ? "🔒 Bloqueada" : started ? "En curso" : "Nueva";
              return `
                <button type="button" class="lesson ${done ? "done" : ""} ${open ? "" : "locked"}" data-lesson="${i}" ${open ? "" : "disabled"}>
                  <b lang="ja">${l.items.map((k) => k.char).join("")}</b>
                  <span>Lección ${l.number} · ${l.items.map((k) => k.romaji).join(" ")}</span>
                  <small>${status}</small>
                </button>`;
            })
            .join("")}
        </div>
      </section>`
    ).join("")}`;

  view.querySelectorAll("[data-lesson]").forEach((b) =>
    b.addEventListener("click", () => {
      lesson = { index: Number(b.dataset.lesson), phase: "intro", step: 0 };
      renderLeer();
      window.scrollTo(0, 0);
    })
  );
  view.querySelector("#review")?.addEventListener("click", () => startPractice(null));
  view.querySelector("#go-full")?.addEventListener("click", () => {
    setReadingMode("yes");
    location.hash = "#kana";
  });
}

function renderLessonIntro() {
  const l = LESSONS[lesson.index];
  const k = l.items[lesson.step];
  const [word, wordRo, wordEs] = exampleOf(k);
  const tip = kanaTip(k);
  const last = lesson.step === l.items.length - 1;
  view.innerHTML = `
    <section class="card kana-intro">
      <div class="lesson-top">
        <button type="button" class="link" id="back">← Lecciones</button>
        <span class="muted">Lección ${l.number} · ${SCRIPTS.find((s) => s.type === l.type).title}</span>
      </div>
      <div class="dots" aria-label="Símbolo ${lesson.step + 1} de ${l.items.length}">
        ${l.items.map((_, i) => `<i class="${i === lesson.step ? "on" : i < lesson.step ? "seen" : ""}"></i>`).join("")}
      </div>
      <div class="kana-big" lang="ja">${k.char}</div>
      <div class="kana-sound">${k.romaji} ${speakButton(k.char)}</div>
      ${tip ? `<p class="kana-tip">💡 ${esc(tip)}</p>` : ""}
      <div class="kana-example">
        <span class="muted">Por ejemplo</span>
        <div class="row"><b lang="ja">${esc(word)}</b>${speakButton(word)}</div>
        <span>${esc(wordRo)} · ${esc(wordEs)}</span>
      </div>
      <div class="lesson-nav">
        <button type="button" id="prev" ${lesson.step === 0 ? "disabled" : ""}>← Anterior</button>
        <button type="button" class="primary" id="next">${last ? "¡A practicar!" : "Siguiente →"}</button>
      </div>
    </section>`;
  speak(k.char);
  view.querySelector("#back").addEventListener("click", () => {
    lesson = null;
    renderLeer();
  });
  view.querySelector("#prev").addEventListener("click", () => {
    lesson.step--;
    renderLeer();
  });
  view.querySelector("#next").addEventListener("click", () => {
    if (last) startPractice(lesson.index);
    else {
      lesson.step++;
      renderLeer();
    }
  });
}

// Preguntas de práctica: los símbolos de la lección (o todo lo aprendido, en el repaso),
// mezclando «símbolo → sonido» y «sonido → símbolo».
function startPractice(index) {
  const focus = index === null ? learnedItems() : LESSONS[index].items;
  const extra = index === null ? [] : learnedItems().filter((k) => !focus.includes(k));
  const questions = [];
  for (let n = 0; n < PRACTICE_QUESTIONS; n++) {
    const fromExtra = extra.length && Math.random() < 0.25;
    const pool = fromExtra ? extra : focus;
    let k = pool[Math.floor(Math.random() * pool.length)];
    if (questions.length && questions[questions.length - 1].k === k && pool.length > 1) k = pool.find((x) => x !== k);
    questions.push({ k, kind: Math.random() < 0.5 ? "read" : "listen" });
  }
  lesson = { index, phase: "practice", questions, answered: 0, correct: 0 };
  renderLeer();
  window.scrollTo(0, 0);
}

function optionsFor(k) {
  const sameType = KANA.filter((x) => x.type === k.type && x !== k);
  const near = (lesson.index === null ? learnedItems() : LESSONS[lesson.index].items).filter((x) => x !== k && x.type === k.type);
  const picks = shuffle(near).slice(0, 3);
  for (const x of shuffle(sameType)) if (picks.length < 3 && !picks.includes(x)) picks.push(x);
  return shuffle([k, ...picks]);
}

function renderPractice() {
  const q = lesson.questions[lesson.answered];
  const k = q.k;
  const opts = optionsFor(k);
  const title = lesson.index === null ? "Repaso" : `Lección ${LESSONS[lesson.index].number} · práctica`;
  view.innerHTML = `
    <section class="card">
      <div class="lesson-top">
        <button type="button" class="link" id="back">← Lecciones</button>
        <span class="muted">${title} · ${lesson.answered + 1}/${lesson.questions.length}</span>
      </div>
      <div class="progress"><div style="width:${(lesson.answered / lesson.questions.length) * 100}%"></div></div>
      ${
        q.kind === "read"
          ? `<div class="prompt"><p class="big" lang="ja">${k.char}</p><p class="muted">¿Cómo suena?</p></div>`
          : `<div class="prompt"><p class="listen">${speakButton(k.char)} <b>«${k.romaji}»</b></p><p class="muted">¿Qué símbolo es?</p></div>`
      }
      <div class="options ${q.kind === "listen" ? "kana-options" : ""}">
        ${opts.map((o) => `<button type="button" data-opt="${o.id}" ${q.kind === "listen" ? 'lang="ja"' : ""}>${q.kind === "read" ? o.romaji : o.char}</button>`).join("")}
      </div>
      <p class="feedback"></p>
    </section>`;
  if (q.kind === "listen") speak(k.char);
  view.querySelector("#back").addEventListener("click", () => {
    lesson = null;
    renderLeer();
  });
  view.querySelectorAll("[data-opt]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (view.querySelector(".options").dataset.locked) return;
      view.querySelector(".options").dataset.locked = "1";
      const ok = btn.dataset.opt === k.id;
      recordAnswer(k.id, ok);
      if (ok) lesson.correct++;
      view.querySelectorAll("[data-opt]").forEach((b) => b.dataset.opt === k.id && b.classList.add("ok"));
      if (!ok) btn.classList.add("bad");
      speak(k.char);
      const [word, wordRo, wordEs] = exampleOf(k);
      view.querySelector(".feedback").innerHTML = `
        ${ok ? "✅ ¡Bien!" : `❌ Era <b lang="ja">${k.char}</b> · ${k.romaji}`}
        <br><span class="muted">Como en <span lang="ja">${esc(word)}</span> (${esc(wordRo)}, ${esc(wordEs)})</span>
        <br><button type="button" class="primary" id="next" style="margin-top:10px">${lesson.answered + 1 === lesson.questions.length ? "Ver resultado" : "Siguiente →"}</button>`;
      view.querySelector("#next").addEventListener("click", () => {
        lesson.answered++;
        if (lesson.answered === lesson.questions.length) lesson.phase = "done";
        renderLeer();
      });
      const goal = document.querySelector("#goal");
      if (goal) goal.innerHTML = goalCard();
    })
  );
}

function renderLessonDone() {
  const l = lesson.index === null ? null : LESSONS[lesson.index];
  const learnedNow = l && lessonLearned(l);
  const nextIndex = l ? lesson.index + 1 : null;
  const canNext = learnedNow && nextIndex < LESSONS.length && lessonUnlocked(nextIndex);
  view.innerHTML = `
    <section class="card lesson-done">
      <p class="big">${lesson.correct >= 8 ? "🎉" : lesson.correct >= 5 ? "👍" : "🌱"}</p>
      <h2>${lesson.correct} de ${lesson.questions.length} aciertos</h2>
      ${
        l
          ? learnedNow
            ? `<p>¡Lección aprendida! Ya reconoces <b lang="ja">${l.items.map((k) => k.char).join(" ")}</b>.</p>`
            : `<p>Casi lo tienes. Repite la práctica para afianzar <b lang="ja">${l.items.map((k) => k.char).join(" ")}</b>: cada símbolo cuenta como aprendido al acertarlo dos veces seguidas.</p>`
          : `<p>Repaso terminado. Lo que fallas vuelve a salir más a menudo.</p>`
      }
      <div class="lesson-nav">
        <button type="button" id="again">↻ ${l ? "Repetir práctica" : "Otro repaso"}</button>
        ${canNext ? `<button type="button" class="primary" id="next-lesson">Siguiente lección →</button>` : `<button type="button" class="primary" id="map">Ver lecciones</button>`}
      </div>
    </section>`;
  view.querySelector("#again").addEventListener("click", () => startPractice(lesson.index));
  view.querySelector("#next-lesson")?.addEventListener("click", () => {
    lesson = { index: nextIndex, phase: "intro", step: 0 };
    renderLeer();
  });
  view.querySelector("#map")?.addEventListener("click", () => {
    lesson = null;
    renderLeer();
  });
}

// Tarjeta de Progreso para cambiar de modo.
function readingModeCard() {
  const learning = readingMode();
  return `
    <section class="card">
      <h2>Cómo aprendes</h2>
      <p>${learning ? "<b>Aprender a leer</b>: lecciones para conocer los símbolos." : "<b>Ejercicios completos</b>: kana y vocabulario, para quien ya lee."}</p>
      <button type="button" id="switch-mode">${learning ? "Ya conozco los símbolos: ejercicios completos" : "Volver a aprender los símbolos"}</button>
    </section>`;
}
