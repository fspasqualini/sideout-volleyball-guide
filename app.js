const PHASES = [
  { key: "base", label: "Base", hint: "Posizione di partenza della rotazione." },
  { key: "receiveReceive", label: "Ricezione", hint: "S1, S2 e L1 formano la linea di ricezione." },
  { key: "receiveSet", label: "Alzata", hint: "Disposizione durante l’alzata." },
  { key: "receiveHit", label: "Attacco", hint: "Disposizione durante l’attacco." },
  { key: "switchReceive", label: "Cambio", hint: "Disposizione dopo il cambio di posizione." },
];
const ROTATIONS = [1, 6, 5, 4, 3, 2];
const RECEIVERS = new Set(["S1", "S2", "L1"]);
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
let rotation = ROTATIONS.includes(Number(params.get("rotation"))) ? Number(params.get("rotation")) : 1;
let phaseIndex = Math.max(0, PHASES.findIndex((phase) => phase.key === params.get("phase")));
let selectedPlayer = null;
let config;

function saveView() {
  const url = new URL(window.location.href);
  url.searchParams.set("rotation", String(rotation));
  url.searchParams.set("phase", PHASES[phaseIndex].key);
  window.history.replaceState(null, "", url);
}

function activePlayers() {
  const phase = PHASES[phaseIndex].key;
  const positions = config.positions[phase][String(rotation)];
  const swap = config.liberoSwaps[String(rotation)]?.receive;
  return config.players
    .filter((player) => player.id !== swap?.replaces)
    .concat(swap ? config.liberos.find((player) => player.id === swap.libero) : [])
    .filter(Boolean)
    .map((player) => ({ player, point: positions[player.id] || positions[swap.replaces] }));
}

function playerKind(id) {
  if (id === "P") return "setter";
  return RECEIVERS.has(id) ? "receiver" : "other";
}

function renderControls() {
  $("rotation-count").textContent = `${ROTATIONS.indexOf(rotation) + 1} / 6`;
  $("rotation-rail").replaceChildren(...ROTATIONS.map((number, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `rotation-button${rotation === number ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(rotation === number));
    button.setAttribute("aria-label", `P${number}, posizione ${number} del palleggiatore, turno ${index + 1} di 6`);
    button.innerHTML = `<strong>P${number}</strong><span>${String(index + 1).padStart(2, "0")}</span>`;
    button.addEventListener("click", () => { rotation = number; selectedPlayer = null; render(); });
    return button;
  }));

  $("phase-rail").replaceChildren(...PHASES.map((phase, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `phase-button${phaseIndex === index ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(phaseIndex === index));
    button.setAttribute("aria-label", `${index + 1} di 5, ${phase.label}`);
    button.innerHTML = `<span class="phase-number">${String(index + 1).padStart(2, "0")}</span><span class="phase-name">${phase.label}</span>`;
    button.addEventListener("click", () => { phaseIndex = index; render(); });
    return button;
  }));
}

function renderPlayers() {
  const players = activePlayers();
  const layer = $("players");
  const ids = new Set(players.map(({ player }) => player.id));
  for (const node of layer.children) if (!ids.has(node.dataset.player)) node.remove();

  for (const { player, point } of players) {
    let button = layer.querySelector(`[data-player="${player.id}"]`);
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.dataset.player = player.id;
      button.className = `player ${playerKind(player.id)}`;
      button.innerHTML = `<span>${player.shortLabel}</span>`;
      button.addEventListener("click", () => { selectedPlayer = player.id; renderPlayers(); });
      layer.append(button);
    }
    button.style.left = `${((point.x - 75) / 450) * 100}%`;
    button.style.top = `${((point.y + 15) / 535) * 100}%`;
    button.classList.toggle("selected", selectedPlayer === player.id);
    button.setAttribute("aria-pressed", String(selectedPlayer === player.id));
    button.setAttribute("aria-label", `${player.label}${RECEIVERS.has(player.id) ? ", ricevitore" : ""}`);
  }
  const selected = players.find(({ player }) => player.id === selectedPlayer)?.player;
  $("player-detail").textContent = selected
    ? `${selected.shortLabel} · ${selected.label}${RECEIVERS.has(selected.id) ? " · ricevitore" : ""}`
    : "Tocca un giocatore per vedere il ruolo.";
  $("court").setAttribute("aria-label", `Campo della tua squadra, P${rotation}, ${PHASES[phaseIndex].label}. ${players.map(({ player }) => player.shortLabel).join(", ")}.`);
}

function render() {
  const phase = PHASES[phaseIndex];
  renderControls();
  renderPlayers();
  $("phase-title").textContent = phase.label;
  $("phase-count").textContent = `${phaseIndex + 1} di 5`;
  $("phase-overline").textContent = `${String(phaseIndex + 1).padStart(2, "0")} / 05 · ${phase.label.toUpperCase()}`;
  $("phase-hint").textContent = phase.hint;
  saveView();
}

function step(direction) {
  phaseIndex = (phaseIndex + direction + PHASES.length) % PHASES.length;
  render();
}

let touchStart = null;
$("court").addEventListener("touchstart", (event) => {
  touchStart = { x: event.changedTouches[0].screenX, y: event.changedTouches[0].screenY };
}, { passive: true });
$("court").addEventListener("touchend", (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].screenX - touchStart.x;
  const dy = event.changedTouches[0].screenY - touchStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  touchStart = null;
}, { passive: true });
$("campo").addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  }
});

fetch("references/rotazionivolley/ricezione-a-3.json")
  .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then((data) => { config = data; render(); })
  .catch(() => {
    $("phase-hint").textContent = "Impossibile caricare lo schema. Avvia il sito con un server locale e ricarica la pagina.";
  });
