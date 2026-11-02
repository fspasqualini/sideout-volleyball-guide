const PHASES = [
  { key: "base", label: "Base", hint: "Posizione di partenza della rotazione." },
  { key: "receiveReceive", label: "Ricezione", hint: "Disposizione al servizio avversario: qui si applicano aree e falli di posizione." },
  { key: "receiveSet", label: "Alzata", hint: "Disposizione durante l’alzata." },
  { key: "receiveHit", label: "Attacco", hint: "Disposizione durante l’attacco." },
  { key: "switchReceive", label: "Cambio", hint: "Disposizione dopo il cambio di posizione." },
];
const ROTATIONS = [2, 1, 6, 5, 4, 3];
const ROLES = ["middle", "setter", "hitter", "opposite", "libero"];
const RECEIVERS = new Set(["S1", "S2", "L1"]);
const CONSTRAINTS = [
  ["frontBack", 4, 5], ["frontBack", 3, 6], ["frontBack", 2, 1],
  ["leftRight", 4, 3], ["leftRight", 3, 2], ["leftRight", 5, 6], ["leftRight", 6, 1],
];
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
let rotation = ROTATIONS.includes(Number(params.get("rotation"))) ? Number(params.get("rotation")) : 2;
let phaseIndex = Math.max(0, PHASES.findIndex((phase) => phase.key === params.get("phase")));
let role = ROLES.includes(params.get("role")) ? params.get("role") : "middle";
let selectedPlayer = null;
let showAreas = params.get("areas") === "1";
let showFaults = params.get("faults") === "1";
let showRoutes = params.get("routes") === "1";
if (showAreas || showFaults) phaseIndex = 1;
let config;

function saveView() {
  const url = new URL(window.location.href);
  url.searchParams.set("rotation", String(rotation));
  url.searchParams.set("phase", PHASES[phaseIndex].key);
  url.searchParams.set("role", role);
  if (showAreas) url.searchParams.set("areas", "1"); else url.searchParams.delete("areas");
  if (showFaults) url.searchParams.set("faults", "1"); else url.searchParams.delete("faults");
  if (showRoutes) url.searchParams.set("routes", "1"); else url.searchParams.delete("routes");
  window.history.replaceState(null, "", url);
}

function activePlayers(phaseKey = PHASES[phaseIndex].key) {
  const positions = config.positions[phaseKey][String(rotation)];
  const swap = config.liberoSwaps[String(rotation)]?.receive;
  return config.players
    .filter((player) => player.id !== swap?.replaces)
    .concat(swap ? config.liberos.find((player) => player.id === swap.libero) : [])
    .filter(Boolean)
    .map((player) => ({ player, point: positions[player.id] || positions[swap.replaces] }));
}

function focusIds(players) {
  if (selectedPlayer && players.some(({ player }) => player.id === selectedPlayer)) return [selectedPlayer];
  return players.filter(({ player }) => player.role === role).map(({ player }) => player.id);
}

function playerKind(id) {
  if (id === "P") return "setter";
  return RECEIVERS.has(id) ? "receiver" : "other";
}

function renderControls() {
  $("rotation-count").textContent = `${ROTATIONS.indexOf(rotation) + 1} / 6`;
  if (!$("rotation-rail").children.length) {
    $("rotation-rail").replaceChildren(...ROTATIONS.map((number, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rotation-button";
      button.dataset.rotation = number;
      button.setAttribute("aria-label", `P${number}, posizione ${number} del palleggiatore, turno ${index + 1} di 6`);
      button.innerHTML = `<strong>P${number}</strong><span>${String(index + 1).padStart(2, "0")}</span>`;
      button.addEventListener("click", () => { rotation = number; selectedPlayer = null; render(); });
      return button;
    }));
  }
  for (const button of $("rotation-rail").children) {
    const active = Number(button.dataset.rotation) === rotation;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
  $("role-select").value = role;
  for (const [id, active] of [["areas-toggle", showAreas], ["faults-toggle", showFaults], ["routes-toggle", showRoutes]]) {
    $(id).setAttribute("aria-pressed", String(active));
    $(id).classList.toggle("active", active);
  }
  if (!$("phase-rail").children.length) {
    $("phase-rail").replaceChildren(...PHASES.map((phase, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "phase-button";
      button.dataset.phaseIndex = index;
      button.setAttribute("aria-label", `${index + 1} di 5, ${phase.label}`);
      button.innerHTML = `<span class="phase-number">${String(index + 1).padStart(2, "0")}</span><span class="phase-name">${phase.label}</span>`;
      button.addEventListener("click", () => {
        phaseIndex = index;
        if (index !== 1) { showAreas = false; showFaults = false; }
        render();
      });
      return button;
    }));
  }
  for (const button of $("phase-rail").children) {
    const active = Number(button.dataset.phaseIndex) === phaseIndex;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
  $("phase-prev").setAttribute("aria-label", `Fase precedente: ${PHASES[(phaseIndex - 1 + PHASES.length) % PHASES.length].label}`);
  $("phase-next").setAttribute("aria-label", `Fase successiva: ${PHASES[(phaseIndex + 1) % PHASES.length].label}`);
  $("phase-prev").title = $("phase-prev").getAttribute("aria-label");
  $("phase-next").title = $("phase-next").getAttribute("aria-label");
}

function rotationZones() {
  const base = config.positions.base[String(rotation)];
  const frontToBack = [...config.players].sort((a, b) => base[a.id].y - base[b.id].y);
  const front = frontToBack.slice(0, 3).sort((a, b) => base[a.id].x - base[b.id].x);
  const back = frontToBack.slice(3).sort((a, b) => base[a.id].x - base[b.id].x);
  const zones = {};
  front.forEach((player, index) => { zones[player.id] = [4, 3, 2][index]; });
  back.forEach((player, index) => { zones[player.id] = [5, 6, 1][index]; });
  const swap = config.liberoSwaps[String(rotation)]?.receive;
  if (swap) { zones[swap.libero] = zones[swap.replaces]; delete zones[swap.replaces]; }
  return zones;
}

function faultRelations(zones, players) {
  const points = Object.fromEntries(players.map(({ player, point }) => [player.id, point]));
  const byZone = Object.fromEntries(Object.entries(zones).map(([id, zone]) => [zone, id]));
  return CONSTRAINTS.map(([kind, firstZone, secondZone]) => {
    const firstId = byZone[firstZone];
    const secondId = byZone[secondZone];
    const a = points[firstId];
    const b = points[secondId];
    return { kind, firstId, secondId, firstZone, secondZone, ok: kind === "frontBack" ? a.y < b.y : a.x < b.x };
  });
}

function svgElement(tag, attrs) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

function polygonPath(zones, area) {
  const points = area.vertices.map((id) => zones.vertices[id]);
  return `M ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} Z`;
}

function signedArea(points) {
  return points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0) / 2;
}

function claimedSide(zones, area, a, b) {
  const vertices = area.vertices;
  const j = vertices.indexOf(a);
  const forward = vertices[(j + 1) % vertices.length] === b;
  const from = zones.vertices[forward ? a : b];
  const to = zones.vertices[forward ? b : a];
  const direction = Math.sign(signedArea(vertices.map((id) => zones.vertices[id]))) || 1;
  const nx = direction * (to.y - from.y);
  const ny = direction * -(to.x - from.x);
  return Math.abs(nx) >= Math.abs(ny) ? (nx < 0 ? "left" : "right") : (ny < 0 ? "front" : "back");
}

function renderAreas(ids) {
  const layer = $("areas-layer");
  layer.replaceChildren();
  if (!showAreas || phaseIndex !== 1) return [];
  const zones = config.receptionZones[String(rotation)];
  const selectedAreas = zones.areas.filter((area) => ids.includes(area.playerId));
  const defs = svgElement("defs", {});
  layer.append(defs);
  zones.areas.forEach((area) => {
    const selected = ids.includes(area.playerId);
    const path = polygonPath(zones, area);
    layer.append(svgElement("path", {
      d: path, fill: selected ? area.color : "#ffffff", "fill-opacity": selected ? "0.39" : "0.06",
      stroke: selected ? area.color : "#ffffff", "stroke-opacity": selected ? "0.95" : "0.7", "stroke-width": selected ? "3" : "2",
    }));
    if (!selected) return;
    const clipId = `area-clip-${area.playerId}`;
    const clip = svgElement("clipPath", { id: clipId });
    clip.append(svgElement("path", { d: path }));
    defs.append(clip);
    const group = svgElement("g", { "clip-path": `url(#${clipId})` });
    area.vertices.forEach((a, index) => {
      const b = area.vertices[(index + 1) % area.vertices.length];
      const shared = zones.areas.some((other) => other !== area && other.vertices.some((v, j) =>
        (v === a && other.vertices[(j + 1) % other.vertices.length] === b) ||
        (v === b && other.vertices[(j + 1) % other.vertices.length] === a)));
      if (!shared || !area.competence.includes(claimedSide(zones, area, a, b))) return;
      const p = zones.vertices[a];
      const q = zones.vertices[b];
      group.append(svgElement("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: area.color, "stroke-width": 25, "stroke-opacity": "0.7" }));
    });
    layer.append(group);
  });
  return selectedAreas;
}

function renderFaults(ids, players) {
  const layer = $("faults-layer");
  layer.replaceChildren();
  if (!showFaults || phaseIndex !== 1) return { zones: {}, relations: [] };
  const zones = rotationZones();
  const relations = faultRelations(zones, players).filter((r) => ids.includes(r.firstId) || ids.includes(r.secondId));
  const points = Object.fromEntries(players.map(({ player, point }) => [player.id, point]));
  const defs = svgElement("defs", {});
  for (const [name, color] of [["ok", "#17805c"], ["fault", "#bf3a32"]]) {
    const marker = svgElement("marker", { id: `arrow-${name}`, viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "8", markerHeight: "8", orient: "auto-start-reverse" });
    marker.append(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 Z", fill: color }));
    defs.append(marker);
  }
  layer.append(defs);
  for (const relation of relations) {
    const fromId = ids.includes(relation.firstId) ? relation.firstId : relation.secondId;
    const toId = fromId === relation.firstId ? relation.secondId : relation.firstId;
    const a = points[fromId];
    const b = points[toId];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (length <= 76) continue;
    const ux = dx / length;
    const uy = dy / length;
    layer.append(svgElement("line", {
      x1: a.x + ux * 34, y1: a.y + uy * 34, x2: b.x - ux * 36, y2: b.y - uy * 36,
      stroke: relation.ok ? "#17805c" : "#bf3a32", "stroke-width": relation.ok ? "4" : "6",
      "stroke-dasharray": relation.ok ? "9 7" : "none", "marker-end": `url(#arrow-${relation.ok ? "ok" : "fault"})`,
    }));
  }
  return { zones, relations };
}

function renderRoutes(ids, players) {
  const layer = $("routes-layer");
  layer.replaceChildren();
  if (!showRoutes) return { from: "", to: "", moving: [] };
  // Base previews the next step; every other phase shows the movement into it.
  const fromIndex = phaseIndex === 0 ? 0 : phaseIndex - 1;
  const toIndex = phaseIndex === 0 ? 1 : phaseIndex;
  const from = Object.fromEntries(activePlayers(PHASES[fromIndex].key).map(({ player, point }) => [player.id, point]));
  const targets = phaseIndex === 0 ? activePlayers(PHASES[toIndex].key) : players;
  const moving = [];
  const defs = svgElement("defs", {});
  const marker = svgElement("marker", { id: "route-arrow", viewBox: "0 0 12 12", refX: "10", refY: "6", markerWidth: "8", markerHeight: "8", orient: "auto" });
  marker.append(svgElement("path", { d: "M 1 1 L 11 6 L 1 11 Z", fill: "#184878" }));
  defs.append(marker);
  layer.append(defs);
  for (const { player, point: end } of targets) {
    if (!ids.includes(player.id)) continue;
    const start = from[player.id];
    if (!start) continue;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < 18) continue;
    const ux = dx / length;
    const uy = dy / length;
    const x1 = start.x + ux * 13;
    const y1 = start.y + uy * 13;
    const x2 = end.x - ux * 26;
    const y2 = end.y - uy * 26;
    if (Math.hypot(x2 - x1, y2 - y1) < 8) continue;
    layer.append(svgElement("circle", { cx: start.x, cy: start.y, r: 7, fill: "#fff", stroke: "#184878", "stroke-width": 3 }));
    layer.append(svgElement("line", { x1, y1, x2, y2, stroke: "#fff", "stroke-width": 9, "stroke-linecap": "round" }));
    layer.append(svgElement("line", { x1, y1, x2, y2, stroke: "#184878", "stroke-width": 4, "stroke-linecap": "round", "stroke-dasharray": "9 5", "marker-end": "url(#route-arrow)" }));
    const direction = [
      Math.abs(dx) >= 10 ? (dx > 0 ? "a destra" : "a sinistra") : "",
      Math.abs(dy) >= 10 ? (dy > 0 ? "verso il fondo" : "verso la rete") : "",
    ].filter(Boolean).join(" e ");
    moving.push(`${player.shortLabel}: ${direction}`);
  }
  return { from: PHASES[fromIndex].label, to: PHASES[toIndex].label, moving };
}

function renderBall(players) {
  const points = Object.fromEntries(players.map(({ player, point }) => [player.id, point]));
  let point = { x: 300, y: 30 };
  if (phaseIndex === 1) {
    const receivers = ["S1", "S2", "L1"].map((id) => points[id]).filter(Boolean);
    point = { x: receivers.reduce((sum, p) => sum + p.x, 0) / receivers.length,
      y: receivers.reduce((sum, p) => sum + p.y, 0) / receivers.length - 42 };
  } else if (phaseIndex === 2 && points.P) {
    point = { x: points.P.x + (points.P.x > 440 ? -58 : 58), y: points.P.y - 20 };
  }
  point.x = Math.max(94, Math.min(506, point.x));
  point.y = Math.max(13, Math.min(492, point.y));
  const distanceToPlayers = (candidate) => Math.min(...Object.values(points).map((p) => Math.hypot(candidate.x - p.x, candidate.y - p.y)));
  if (distanceToPlayers(point) < 53) {
    const candidates = [
      { x: Math.min(506, point.x + 65), y: point.y },
      { x: Math.max(94, point.x - 65), y: point.y },
      { x: point.x, y: Math.min(492, point.y + 65) },
      { x: point.x, y: Math.max(13, point.y - 65) },
    ];
    point = candidates.reduce((best, candidate) => distanceToPlayers(candidate) > distanceToPlayers(best) ? candidate : best);
  }
  const marker = $("ball-marker");
  marker.style.left = `${((point.x - 75) / 450) * 100}%`;
  marker.style.top = `${((point.y + 15) / 535) * 100}%`;
  marker.setAttribute("aria-label", `Pallone indicativo, fase ${PHASES[phaseIndex].label}`);
}

function addDetail(title, content) {
  const panel = document.createElement("section");
  panel.className = "overlay-detail-panel";
  const heading = document.createElement("strong");
  heading.textContent = title;
  panel.append(heading);
  if (Array.isArray(content)) {
    const list = document.createElement("ul");
    for (const item of content) { const li = document.createElement("li"); li.textContent = item.text; li.className = item.ok ? "is-ok" : "is-fault"; list.append(li); }
    panel.append(list);
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    panel.append(paragraph);
  }
  $("overlay-detail").append(panel);
}

function renderPlayersAndOverlays() {
  const players = activePlayers();
  const ids = focusIds(players);
  const layer = $("players");
  const present = new Set(players.map(({ player }) => player.id));
  for (const node of [...layer.children]) if (!present.has(node.dataset.player)) node.remove();
  const { zones, relations } = renderFaults(ids, players);
  const selectedAreas = renderAreas(ids);
  const routes = renderRoutes(ids, players);
  renderBall(players);

  for (const { player, point } of players) {
    let button = layer.querySelector(`[data-player="${player.id}"]`);
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.dataset.player = player.id;
      button.className = `player ${playerKind(player.id)}`;
      const label = document.createElement("span");
      label.textContent = player.shortLabel;
      const badge = document.createElement("small");
      badge.className = "zone-badge";
      button.append(label, badge);
      button.addEventListener("click", () => { role = player.role; selectedPlayer = player.id; render(); });
      layer.append(button);
    }
    button.style.left = `${((point.x - 75) / 450) * 100}%`;
    button.style.top = `${((point.y + 15) / 535) * 100}%`;
    button.classList.toggle("focused", ids.includes(player.id));
    button.classList.toggle("dimmed", !ids.includes(player.id));
    button.setAttribute("aria-pressed", String(ids.includes(player.id)));
    button.setAttribute("aria-label", `${player.label}${RECEIVERS.has(player.id) ? ", ricevitore" : ""}`);
    const badge = button.querySelector(".zone-badge");
    badge.hidden = !showFaults;
    if (showFaults) badge.textContent = zones[player.id];
  }
  const focused = players.filter(({ player }) => ids.includes(player.id)).map(({ player }) => `${player.shortLabel} · ${player.label}`);
  $("player-detail").textContent = `Focus: ${focused.join("; ")}. Tocca un bollino per isolare un giocatore.`;
  $("court").setAttribute("aria-label", `Campo della tua squadra, P${rotation}, ${PHASES[phaseIndex].label}. Focus: ${focused.join(", ")}.`);
  $("overlay-detail").replaceChildren();
  if (showAreas) {
    const sides = { left: "sinistra", right: "destra", front: "avanti", back: "dietro" };
    addDetail("Aree di competenza", selectedAreas.length
      ? selectedAreas.map((area) => `${area.playerId}: confini assegnati ${area.competence.map((side) => sides[side]).join(", ") || "nessuno"}`).join(". ") + "."
      : "Nessuna area assegnata al ruolo scelto in questa rotazione.");
  }
  if (showFaults) {
    const items = relations.map((relation) => {
      const fromId = ids.includes(relation.firstId) ? relation.firstId : relation.secondId;
      const otherId = fromId === relation.firstId ? relation.secondId : relation.firstId;
      const direction = relation.kind === "frontBack"
        ? (fromId === relation.firstId ? "dietro" : "davanti")
        : (fromId === relation.firstId ? "a destra" : "a sinistra");
      return { text: `${fromId} (zona ${zones[fromId]}) deve avere ${otherId} (zona ${zones[otherId]}) ${direction}: ${relation.ok ? "ordine rispettato" : "possibile fallo"}.`, ok: relation.ok };
    });
    addDetail("Falli di posizione", items);
    const note = document.createElement("p");
    note.className = "overlay-note";
    note.textContent = "Si confrontano le zone adiacenti al servizio avversario. In partita contano i piedi; qui si usa il centro del bollino.";
    $("overlay-detail").append(note);
  }
  if (showRoutes) {
    addDetail("Percorsi", routes.moving.length
      ? `${routes.from} → ${routes.to}: ${routes.moving.join("; ")}. Il punto vuoto indica la partenza; la freccia indica l’arrivo.`
      : `${routes.from} → ${routes.to}: nessuno spostamento visibile per il focus scelto.`);
  }
}

function render() {
  const phase = PHASES[phaseIndex];
  renderControls();
  renderPlayersAndOverlays();
  $("phase-title").textContent = phase.label;
  $("phase-count").textContent = `${phaseIndex + 1} di 5`;
  $("phase-overline").textContent = `${String(phaseIndex + 1).padStart(2, "0")} / 05 · ${phase.label.toUpperCase()}`;
  $("phase-hint").textContent = phase.hint;
  saveView();
}

function step(direction) {
  if (!config) return;
  phaseIndex = (phaseIndex + direction + PHASES.length) % PHASES.length;
  if (phaseIndex !== 1) { showAreas = false; showFaults = false; }
  render();
}

$("role-select").addEventListener("change", (event) => { role = event.target.value; selectedPlayer = null; render(); });
$("areas-toggle").addEventListener("click", () => { showAreas = !showAreas; if (showAreas) phaseIndex = 1; render(); });
$("faults-toggle").addEventListener("click", () => { showFaults = !showFaults; if (showFaults) phaseIndex = 1; render(); });
$("routes-toggle").addEventListener("click", () => { showRoutes = !showRoutes; render(); });
$("phase-prev").addEventListener("click", () => step(-1));
$("phase-next").addEventListener("click", () => step(1));
document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  if (event.target instanceof Element && event.target.closest("input, select, textarea, [contenteditable]")) return;
  if (!config) return;
  event.preventDefault();
  step(event.key === "ArrowRight" ? 1 : -1);
});
let touchStart = null;
$("court").addEventListener("touchstart", (event) => { touchStart = { x: event.changedTouches[0].screenX, y: event.changedTouches[0].screenY }; }, { passive: true });
$("court").addEventListener("touchend", (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].screenX - touchStart.x;
  const dy = event.changedTouches[0].screenY - touchStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  touchStart = null;
}, { passive: true });

fetch("references/rotazionivolley/ricezione-a-3.json")
  .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then((data) => {
    config = data;
    $("role-select").disabled = false;
    $("areas-toggle").disabled = false;
    $("faults-toggle").disabled = false;
    $("routes-toggle").disabled = false;
    $("phase-prev").disabled = false;
    $("phase-next").disabled = false;
    render();
  })
  .catch(() => { $("phase-hint").textContent = "Impossibile caricare lo schema. Ricarica la pagina."; });
