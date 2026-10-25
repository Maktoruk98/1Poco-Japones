// Cuenta de Google y sincronización del progreso en la nube (Firebase).
// Solo se activa si firebase-config.js tiene la configuración del proyecto;
// si no, o sin conexión, la app sigue funcionando en local.

const FIREBASE_VERSION = "10.14.1";
const CLOUD_DELAY = 1500; // agrupa varios cambios seguidos en una sola escritura

let cloudReady = false;
let cloudUser = null;
let cloudTimer = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

function userDoc() {
  return firebase.firestore().collection("users").doc(cloudUser.uid);
}

function rerender() {
  renderStreak();
  route();
}

// ---------- Guardado ----------

function cloudQueueSave() {
  if (!cloudUser) return;
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(cloudPush, CLOUD_DELAY);
}

function cloudPush() {
  clearTimeout(cloudTimer);
  cloudTimer = null;
  if (!cloudUser) return Promise.resolve();
  return userDoc()
    .set({ data: JSON.stringify(state), updatedAt: state.updatedAt, name: cloudUser.displayName || "" })
    .catch((e) => console.warn("No se pudo guardar en la nube", e));
}

async function fetchRemote() {
  const snap = await userDoc().get();
  return snap.exists ? JSON.parse(snap.data().data) : null;
}

// Trae el progreso de la nube si es más reciente que el de este dispositivo.
async function cloudPull() {
  if (!cloudUser) return;
  try {
    const remote = await fetchRemote();
    if (remote && (remote.updatedAt || 0) > (state.updatedAt || 0)) {
      replaceState(remote);
      persistLocal();
      rerender();
    } else if (!remote || (state.updatedAt || 0) > (remote.updatedAt || 0)) {
      cloudPush();
    }
  } catch (e) {
    console.warn("No se pudo leer la nube", e);
  }
}

// ---------- Sesión ----------

async function onUser(user) {
  if (cloudTimer) await cloudPush();
  cloudUser = user;
  renderAccountButton();

  if (!user) {
    storeKey = STORE_BASE;
    replaceState(readStored(storeKey));
    rerender();
    return;
  }

  storeKey = `${STORE_BASE}:${user.uid}`;
  let local = readStored(storeKey);
  let remote = null;
  let online = true;
  try {
    remote = await fetchRemote();
  } catch (e) {
    online = false;
    console.warn("No se pudo leer la nube", e);
  }

  // Primera vez con esta cuenta: el progreso que había sin sesión pasa a ser suyo.
  if (online && !local && !remote) {
    local = readStored(STORE_BASE);
    try {
      localStorage.removeItem(STORE_BASE);
    } catch {}
  }

  const useRemote = remote && (remote.updatedAt || 0) >= (local?.updatedAt || 0);
  replaceState(useRemote ? remote : local);
  persistLocal();
  if (online && !useRemote) cloudPush();
  rerender();
}

async function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await firebase.auth().signInWithPopup(provider);
  } catch (e) {
    if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") {
      await firebase.auth().signInWithRedirect(provider);
    } else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
      toast(`No se pudo iniciar sesión (${e.code || e.message})`);
    }
  }
}

async function signOut() {
  if (cloudTimer) await cloudPush();
  await firebase.auth().signOut();
}

// ---------- Interfaz ----------

function renderAccountButton() {
  const btn = document.getElementById("account");
  if (!cloudReady) return;
  btn.hidden = false;
  if (!cloudUser) {
    btn.innerHTML = "Entrar";
    btn.title = "Iniciar sesión con Google";
  } else if (cloudUser.photoURL) {
    btn.innerHTML = `<img src="${esc(cloudUser.photoURL)}" alt="" referrerpolicy="no-referrer">`;
    btn.title = cloudUser.displayName || "Tu cuenta";
  } else {
    btn.textContent = (cloudUser.displayName || cloudUser.email || "?")[0].toUpperCase();
    btn.title = cloudUser.displayName || "Tu cuenta";
  }
}

function accountCard() {
  if (!cloudReady) return "";
  if (!cloudUser) {
    return `
      <section class="card">
        <h2>Tu cuenta</h2>
        <p>Inicia sesión con Google para guardar tus logros en la nube y llevarlos contigo a cualquier dispositivo. Cada persona tiene los suyos.</p>
        <button class="primary" data-cloud="in">Entrar con Google</button>
      </section>`;
  }
  return `
    <section class="card">
      <h2>Tu cuenta</h2>
      <p>Sesión iniciada como <b>${esc(cloudUser.displayName || cloudUser.email)}</b>. Tu progreso se guarda en la nube ☁️</p>
      <button data-cloud="out">Cerrar sesión</button>
    </section>`;
}

document.addEventListener("click", (e) => {
  const action = e.target.closest("[data-cloud]")?.dataset.cloud;
  if (action === "in") signIn();
  if (action === "out") signOut();
});

document.getElementById("account").addEventListener("click", () => {
  if (cloudUser) location.hash = "#progreso";
  else signIn();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && cloudTimer) cloudPush();
  if (document.visibilityState === "visible") cloudPull();
});

async function initCloud() {
  if (!FIREBASE_CONFIG) return;
  try {
    for (const lib of ["app", "auth", "firestore"]) {
      await loadScript(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-${lib}-compat.js`);
    }
    firebase.initializeApp(FIREBASE_CONFIG);
  } catch (e) {
    console.warn("Firebase no disponible; la app sigue en local", e);
    return;
  }
  cloudReady = true;
  renderAccountButton();
  if (location.hash === "#progreso") route();
  firebase.auth().onAuthStateChanged(onUser);
}

initCloud();
