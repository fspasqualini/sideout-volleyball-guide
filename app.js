const roles = {
  setter: {
    name: "Setter",
    short: "S",
    icon: "✦",
    intro:
      "The playmaker. Usually takes the second touch and sends a hittable ball to a teammate.",
    front:
      "Head to the right side of the net to set. If the other team attacks, help block on your right.",
    back: "Run toward the right side of the net to set after your team's first touch. You remain a back-row player: do not block.",
    serveFront:
      "Set up near right front. Watch their pass, then block or cover the right side of the net.",
    serveBack:
      "Defend right back after the serve. On your team's first touch, run to your setting spot near right front.",
    receiveFront:
      "After the serve, get to your setting spot near right front. Call for the second touch and set a hitter.",
    receiveBack:
      "As the serve comes in, move from your rotation spot toward right front. Let a passer take the first ball; you take the second.",
  },
  outside: {
    name: "Outside hitter",
    short: "OH",
    icon: "↖",
    intro:
      "Hits from the left side and often helps receive serves. Also blocks on the left.",
    front:
      "Work toward left front. If you are a passer, receive first, then move into your hitting approach.",
    back: "Own the left-back passing lane and dig balls hit toward your side.",
    serveFront:
      "Move to left front to block their right-side hitter. Back off the net if the ball is tipped short.",
    serveBack:
      "Settle into left back, read the hitter, and be ready to dig or chase a short ball.",
    receiveFront:
      "Take your assigned passing lane, then transition to a left-side hitting approach after the pass.",
    receiveBack:
      "Receive from left back. Aim your pass toward the setter near right front, then cover the hitter.",
  },
  opposite: {
    name: "Opposite",
    short: "OP",
    icon: "↗",
    intro:
      "The right-side hitter. Often attacks from the right and blocks the opponent's outside hitter.",
    front:
      "Head to right front to attack and block. Leave room for the setter if they move there.",
    back: "Defend right back and be ready for a back-row attack only from behind the attack line.",
    serveFront:
      "Move to right front to block the opponent's left-side attack. Watch for tips behind the block.",
    serveBack:
      "Cover right back. Dig the ball, then prepare for a legal back-row attack if your team uses one.",
    receiveFront:
      "Move toward right front to offer a right-side attack after the pass; avoid crossing the setter's route.",
    receiveBack:
      "Hold the right-back lane unless your team gives you a passing job. Then prepare for a back-row option.",
  },
  middle: {
    name: "Middle blocker",
    short: "MB",
    icon: "↑",
    intro:
      "Moves along the net to block and is ready for quick sets in the center.",
    front:
      "Start near middle front; read the opponent's setter, move sideways to help block, then get ready for a quick set.",
    back: "Defend middle back when you are on court in the back row. In a libero lineup, the libero may replace you between rallies.",
    serveFront:
      "Move to middle front, read where their setter sends the ball, and help close the block.",
    serveBack:
      "Defend middle back. Watch the hitter and call any ball you can reach.",
    receiveFront:
      "Move to middle front, stay clear of the passers, then approach for a quick set.",
    receiveBack:
      "Cover the middle-back serve lane, call the ball, and pass toward the setter.",
  },
  libero: {
    name: "Libero",
    short: "L",
    icon: "◎",
    intro:
      "The back-row passing and digging specialist, usually in a different-color jersey.",
    front:
      "A libero does not play a front-row rotation. Ask which back-row player you replace.",
    back: "Organize the back-row defense, receive serves, and help cover tips and hard hits.",
    serveFront: "A libero does not play a front-row rotation.",
    serveBack:
      "Move into your agreed back-row digging lane and call the ball early.",
    receiveFront: "A libero does not play a front-row rotation.",
    receiveBack:
      "Take your assigned serve-receive lane. Call 'mine' early and pass toward the setter near right front.",
  },
  ds: {
    name: "Defensive specialist",
    short: "DS",
    icon: "↓",
    intro:
      "A back-row passer and defender. Unlike a libero, a DS follows ordinary substitution rules.",
    front:
      "A DS can legally play front row, but teams often substitute a front-row attacker here. Check your lineup.",
    back: "Cover an assigned back-row lane, receive serves, and dig attacks.",
    serveFront:
      "If you stay in front row, help block or cover; your team may substitute a hitter here.",
    serveBack:
      "Move into your assigned back-row defensive lane. Communicate with the libero or other passers.",
    receiveFront:
      "If on court in front row, follow the team passing plan, then prepare to cover the attack.",
    receiveBack:
      "Take your assigned serve-receive lane and pass toward the setter.",
  },
};
roles.middle2 = { ...roles.middle, name: "Middle blocker 2", short: "MB2" };
roles.middle.name = "Middle blocker 1";

function roleInfo(key) {
  return state.lang === "it" ? { ...roles[key], ...roleItalian[key] } : roles[key];
}

const copy = (english, italian) => state.lang === "it" ? italian : english;
const visibleRoles = () => ["setter", "outside", "opposite", "middle", "middle2", "libero", "ds"].filter(
  (key) => key !== "libero" || state.lineup === "libero",
);

const positions = {
  4: { x: 18, y: 20, label: "Front left" },
  3: { x: 50, y: 20, label: "Front middle" },
  2: { x: 82, y: 20, label: "Front right" },
  5: { x: 18, y: 75, label: "Back left" },
  6: { x: 50, y: 75, label: "Back middle" },
  1: { x: 82, y: 75, label: "Back right" },
};

const nextPosition = { 1: 6, 6: 5, 5: 4, 4: 3, 3: 2, 2: 1 };
const previousPosition = Object.fromEntries(
  Object.entries(nextPosition).map(([from, to]) => [to, Number(from)]),
);
const exampleStartingLineup = {
  1: "S",
  2: "OH1",
  3: "MB1",
  4: "OP",
  5: "OH2",
  6: "MB2",
};
const exampleNames = {
  S: "Setter",
  OH1: "Outside hitter 1",
  OH2: "Outside hitter 2",
  MB1: "Middle blocker 1",
  MB2: "Middle blocker 2",
  OP: "Opposite",
};
function playerName(id) {
  if (id === "L") return "Libero";
  if (id === "DS") return copy("Defensive specialist", "Specialista difensivo");
  const italian = {
    S: "Palleggiatore", OH1: "Schiacciatore 1", OH2: "Schiacciatore 2",
    MB1: "Centrale 1", MB2: "Centrale 2", OP: "Opposto",
  };
  return state.lang === "it" ? italian[id] : exampleNames[id];
}

const params = new URLSearchParams(location.search);
const valid = (value, options, fallback) =>
  options.includes(value) ? value : fallback;
const state = {
  lang: valid(params.get("lang"), ["en", "it"],
    localStorage.getItem("sideout-lang") || (navigator.language.startsWith("it") ? "it" : "en")),
  lineup: valid(params.get("lineup"), ["libero", "no-libero"], "libero"),
  role: valid(params.get("role"), Object.keys(roles), "setter"),
  position: valid(Number(params.get("position")), [1, 2, 3, 4, 5, 6], 1),
  serve: valid(params.get("serve"), ["ours", "theirs"], "ours"),
  rules: valid(params.get("rules"), ["fivb", "usav", "trial"], "fivb"),
  step: valid(
    params.has("step") ? Number(params.get("step")) : null,
    [0, 1, 2, 3, 4],
    2,
  ),
};
if (state.lineup === "no-libero" && state.role === "libero") state.role = "setter";

const $ = (id) => document.getElementById(id);
const positionLabel = (spot) => copy(positions[spot].label.toLowerCase(), {
  4: "davanti a sinistra", 3: "davanti al centro", 2: "davanti a destra",
  5: "dietro a sinistra", 6: "dietro al centro", 1: "dietro a destra",
}[spot]);
const frontRow = () => [2, 3, 4].includes(state.position);
const isServer = () => state.serve === "ours" && state.position === 1;
const invalidLibero = () =>
  state.role === "libero" &&
  (frontRow() || (isServer() && state.rules !== "usav"));
const middleOffCourt = () =>
  state.lineup === "libero" && ["middle", "middle2"].includes(state.role) &&
  !frontRow() && !(isServer() && (state.rules !== "usav" || state.role === "middle2"));

const selectedStartingId = {
  setter: "S",
  outside: "OH1",
  opposite: "OP",
  middle: "MB1",
  middle2: "MB2",
  libero: "MB1",
  ds: "OH2",
};

function advancePosition(spot, turns) {
  for (let i = 0; i < turns; i++) spot = nextPosition[spot];
  return spot;
}

function activeLineup() {
  const anchor = selectedStartingId[state.role];
  const anchorStart = Number(
    Object.keys(exampleStartingLineup).find(
      (spot) => exampleStartingLineup[spot] === anchor,
    ),
  );
  let turns = 0;
  while (advancePosition(anchorStart, turns) !== state.position) turns++;
  const bySlot = {};
  for (const [slot, id] of Object.entries(exampleStartingLineup)) {
    bySlot[advancePosition(Number(slot), turns)] = id;
  }

  let selected = {
    setter: "S",
    outside: "OH1",
    opposite: "OP",
    middle: "MB1",
    middle2: "MB2",
    libero: "L",
    ds: "DS",
  }[state.role];
  if (state.role === "ds") {
    bySlot[state.position] = "DS";
  }
  if (state.lineup === "libero") {
    for (const slot of [1, 5, 6]) {
      const middleId = bySlot[slot];
      if (!middleId?.startsWith("MB")) continue;
      const mayServe = state.serve === "ours" && slot === 1 &&
        (state.rules !== "usav" || middleId === "MB2");
      if (!mayServe) bySlot[slot] = "L";
    }
  }
  if (state.role === "libero" && invalidLibero()) selected = null;
  if (middleOffCourt()) selected = null;
  return { bySlot, turns, selected };
}

function playingPosition(id, slot, phase) {
  const front = [2, 3, 4].includes(Number(slot));
  if (phase === "receive") {
    if (id === "S") return { x: 68, y: 27 };
    if (id === "OH1") return { x: 20, y: 67 };
    if (id === "OH2") return { x: 80, y: 67 };
    if (id === "OP") return front ? { x: 87, y: 34 } : { x: 88, y: 84 };
    if (id.startsWith("MB")) return front ? { x: 49, y: 24 } : { x: 50, y: 76 };
    if (id === "DS" && front) return { x: 49, y: 47 };
    return { x: 50, y: 73 };
  }
  if (phase === "attack") {
    if (id === "S") return { x: 68, y: 27 };
    if (id.startsWith("OH")) return front ? { x: 18, y: 34 } : { x: 20, y: 78 };
    if (id === "OP") return front ? { x: 87, y: 34 } : { x: 87, y: 78 };
    if (id.startsWith("MB")) return front ? { x: 49, y: 26 } : { x: 50, y: 78 };
    if (id === "DS" && front) return { x: 48, y: 48 };
    return { x: 50, y: 78 };
  }
  if (id === "S") return front ? { x: 82, y: 27 } : { x: 82, y: 77 };
  if (id.startsWith("OH")) return front ? { x: 18, y: 29 } : { x: 20, y: 77 };
  if (id === "OP") return front ? { x: 86, y: 31 } : { x: 86, y: 78 };
  if (id.startsWith("MB")) return front ? { x: 50, y: 25 } : { x: 50, y: 76 };
  if (id === "DS" && front) return { x: 49, y: 45 };
  return { x: 50, y: 76 };
}

function legalStack(bySlot) {
  const phase = state.serve === "ours" ? "defense" : "receive";
  const layout = {};
  for (const row of [
    [4, 3, 2],
    [5, 6, 1],
  ]) {
    const xs = row.map((slot) => {
      const desired = playingPosition(bySlot[slot], slot, phase);
      layout[bySlot[slot]] = {
        x: positions[slot].x + 0.45 * (desired.x - positions[slot].x),
        y: positions[slot].y + 0.4 * (desired.y - positions[slot].y),
      };
      return layout[bySlot[slot]].x;
    });
    for (let i = 1; i < 3; i++) xs[i] = Math.max(xs[i], xs[i - 1] + 9);
    if (xs[2] > 92) {
      const shift = xs[2] - 92;
      xs.forEach((_, i) => {
        xs[i] -= shift;
      });
    }
    if (xs[0] < 8) {
      const shift = 8 - xs[0];
      xs.forEach((_, i) => {
        xs[i] += shift;
      });
    }
    row.forEach((slot, i) => {
      layout[bySlot[slot]].x = xs[i];
    });
  }
  for (const [frontSlot, backSlot] of [
    [4, 5],
    [3, 6],
    [2, 1],
  ]) {
    const front = layout[bySlot[frontSlot]];
    const back = layout[bySlot[backSlot]];
    front.y = Math.min(front.y, 58);
    back.y = Math.min(91, Math.max(back.y, front.y + 13));
  }
  return layout;
}

function stageLayout(step, bySlot) {
  let phase;
  if (step === 4) phase = "defense";
  else if (step === 3) phase = "attack";
  else if (
    step === 2 ||
    (step === 1 && state.serve === "theirs" && state.rules === "trial")
  ) {
    phase = state.serve === "ours" ? "defense" : "receive";
  } else if (state.serve === "ours" && state.rules !== "usav") {
    phase = "defense";
  } else {
    phase = "stack";
  }
  const layout =
    phase === "stack"
      ? legalStack(bySlot)
      : Object.fromEntries(
          Object.entries(bySlot).map(([slot, id]) => [
            id,
            playingPosition(id, slot, phase),
          ]),
        );
  if (state.serve === "ours" && step < 2) layout[bySlot[1]] = { x: 82, y: 109 };
  return layout;
}

function timingText() {
  if (state.serve === "ours") {
    return state.rules === "usav"
      ? copy("Keep rotation order until serve contact; then move.", "Rispetta l'ordine di rotazione fino al contatto con la battuta; poi spostati.")
      : copy("FIVB lets the serving team arrange freely before contact. The correct server still serves.", "La FIVB permette alla squadra in battuta di disporsi liberamente prima del contatto. Deve comunque battere il giocatore giusto.");
  }
  return state.rules === "trial"
    ? copy("At specified 2026 FIVB events: keep order at the whistle, then move when the serving motion begins.", "Negli eventi FIVB 2026 selezionati: rispetta l'ordine al fischio, poi muoviti quando inizia il gesto di battuta.")
    : copy("Keep rotation order until the opponent contacts the serve; then move.", "Rispetta l'ordine di rotazione finché l'avversario non colpisce la battuta; poi muoviti.");
}

function stepCopy() {
  const role = roleInfo(state.role);
  const row = frontRow()
    ? copy("front-row", "prima linea")
    : copy("back-row", "seconda linea");
  if (invalidLibero()) {
    if (frontRow())
      return {
        title: copy("The libero cannot play this front-row spot.", "Il Libero non può giocare in prima linea."),
        body: copy("Choose position 5, 6, or 1. When the middle rotates to the front row, the regular middle returns to court.", "Scegli la posizione 5, 6 o 1. Quando il centrale torna in prima linea, rientra al posto del Libero."),
      };
    return {
      title: copy("The regular player serves under FIVB rules.", "Secondo la FIVB batte il giocatore titolare."),
      body: copy("FIVB does not permit libero serving. USA Volleyball permits a libero to serve in one rotation per set; ask which service position your team has designated.", "La FIVB vieta al Libero di battere. USA Volleyball gli consente un turno di battuta per set; in questo esempio il turno assegnato è quello del Centrale 1."),
    };
  }
  if (middleOffCourt()) return {
    title: copy("The libero is on court for you.", "Il Libero è in campo al tuo posto."),
    body: copy("You are a back-row middle in this rotation. In this example, the libero replaces you between rallies. Follow the play from the sideline; you return when your position reaches the front row. The regular middle serves under FIVB rules.", "Sei un centrale di seconda linea in questa rotazione. In questo esempio il Libero ti sostituisce tra uno scambio e l'altro. Segui il gioco da fuori e rientri quando la tua posizione arriva in prima linea. Con le regole FIVB, il centrale titolare batte."),
  };
  if (state.step === 0) {
    if (isServer())
      return {
        title: copy("Start behind the baseline to serve.", "Parti dietro la linea di fondo per battere."),
        body: state.lang === "it"
          ? `Sei in posizione 1. Gli altri cinque giocatori prendono la ${state.rules === "usav" ? "disposizione iniziale regolare" : "posizione difensiva"} mostrata. Resti un giocatore di seconda linea per tutto lo scambio.`
          : `You are in position 1. The other five players take the shown ${state.rules === "usav" ? "legal stack" : "defensive shape"}. You remain a back-row player throughout this rally.`,
      };
    if (state.serve === "ours" && state.rules !== "usav")
      return {
        title: copy("Set up in your defensive shape.", "Prendi la tua posizione difensiva."),
        body: state.lang === "it"
          ? `Secondo la FIVB, la squadra in battuta può spostarsi prima del servizio. Il battitore giusto resta dietro la linea di fondo. Per tutto lo scambio sei un giocatore di ${row}.`
          : `Under FIVB rules, the serving team can switch before the serve. The correct server stays behind the baseline. You are a ${row} player throughout this rally.`,
      };
    return {
      title: copy("Take your legal stack.", "Prendi la disposizione iniziale regolare."),
      body: state.lang === "it"
        ? `Parti vicino alla zona del tuo ruolo, mantenendo l'ordine richiesto da sinistra a destra e da davanti a dietro. La tua posizione è ${state.position} (${positionLabel(state.position)}). Per la regolarità contano i piedi, non i simboli del disegno.`
        : `A stack puts teammates close to their next jobs while keeping the required left-to-right and front-to-back order. You begin in position ${state.position} (${positions[state.position].label.toLowerCase()}). Actual foot placement determines legality.`,
    };
  }
  if (state.step === 1) {
    if (state.serve === "theirs" && state.rules === "trial")
      return {
        title: copy("Switch as the server begins the motion.", "Spostati quando il battitore inizia il movimento."),
        body: copy("For the selected 2026 FIVB trial events, the receiving team is legal at the whistle and may leave its stack when the serving action begins. Watch the server and move to your first job.", "Negli eventi della sperimentazione FIVB 2026, chi riceve deve essere in posizione regolare al fischio e può spostarsi quando inizia il gesto di battuta. Osserva il battitore e vai nella tua zona."),
      };
    if (isServer())
      return {
        title: copy("Serve from behind the baseline.", "Batti da dietro la linea di fondo."),
        body: copy("Hit the ball, then step into the court and move to your defensive position. Your teammates track the other team's pass and setter.", "Colpisci la palla, entra in campo e vai nella tua zona difensiva. I compagni osservano la loro ricezione e il loro palleggiatore."),
      };
    if (state.serve === "ours" && state.rules !== "usav")
      return {
        title: copy("You are already in defensive shape.", "Sei già in posizione difensiva."),
        body: copy("Under FIVB rules, the serving team can be in its chosen shape when the serve is hit. Watch how well the opponent passes and prepare to defend their hit.", "Secondo la FIVB, al momento della battuta la squadra può essere già disposta per difendere. Guarda la ricezione avversaria e preparati al loro attacco."),
      };
    return {
      title: copy("Hold your stack until serve contact.", "Mantieni la disposizione fino al contatto con la battuta."),
      body: copy("Keep the required relationships to nearby teammates until the server hits the ball. Then switch into the shape shown in the next step.", "Rispetta l'ordine rispetto ai compagni vicini finché il battitore non colpisce la palla. Poi spostati nella disposizione mostrata al passo successivo."),
    };
  }
  if (state.step === 2)
    return {
      title:
        state.serve === "ours"
          ? copy("Defend their next attack.", "Difendi il prossimo attacco avversario.")
          : copy("Receive the serve together.", "Ricevete insieme la battuta."),
      body:
        state.serve === "ours"
          ? frontRow()
            ? role.serveFront
            : role.serveBack
          : frontRow()
            ? role.receiveFront
            : role.receiveBack,
    };
  if (state.step === 4)
    return {
      title: copy("Switch back to defense.", "Torna in difesa."),
      body: frontRow() ? role.serveFront : role.serveBack,
    };
  const attackCopy = {
    setter:
      copy("Move near right front for the second touch and set a teammate. If you started in the back row, you remain a back-row player and cannot block.", "Vai vicino a zona 2 per il secondo tocco e alza a un compagno. Se sei partito in seconda linea, resti di seconda linea e non puoi murare."),
    outside: frontRow()
      ? copy("After the pass or dig, move into a left-side hitting approach. Call for the ball and cover your teammate if they hit instead.", "Dopo la ricezione o la difesa, vai a sinistra per la rincorsa. Chiama la palla e copri il compagno se attacca lui.")
      : copy("Cover your team's hitter from the back row. A back-row attack above the net must start from behind the attack line.", "Copri l'attaccante dalla seconda linea. Per attaccare una palla sopra la rete devi staccare da dietro la linea dei tre metri."),
    opposite: frontRow()
      ? copy("Approach from right front for an attack. Leave the setter a clear path to the ball.", "Preparati ad attaccare da zona 2. Lascia al palleggiatore una strada libera verso la palla.")
      : copy("Cover the right-back area. If your team uses a back-row attack, take off from behind the attack line.", "Copri zona 1. Se attacchi da seconda linea, stacca da dietro la linea dei tre metri."),
    middle: frontRow()
      ? copy("Move near middle front for a quick set, then cover the hitter if the set goes elsewhere.", "Vai vicino a zona 3 per una palla veloce; se l'alzata va altrove, copri l'attaccante.")
      : copy("Cover your hitter from the back row and prepare to defend the next ball.", "Copri l'attaccante dalla seconda linea e preparati a difendere la palla successiva."),
    libero:
      copy("Stay behind the attack and cover tips or blocks that bounce back. You cannot block or attack a ball entirely above the net.", "Resta dietro l'attacco e copri pallonetti o palle respinte dal muro. Non puoi murare né attaccare una palla completamente sopra la rete."),
    ds: copy("Cover the hitters and be ready to dig if the ball comes back. Follow your team's substitution plan for the next rotation.", "Copri gli attaccanti e preparati a difendere la palla che torna. Segui il piano di sostituzioni della squadra alla prossima rotazione."),
  };
  attackCopy.middle2 = attackCopy.middle;
  return {
    title: copy("Switch from first touch to attack.", "Passa dal primo tocco all'attacco."),
    body: attackCopy[state.role],
  };
}

function renderOptions() {
  $("role-options").innerHTML = visibleRoles().map((key) => [key, roleInfo(key)])
    .map(
      ([key, role]) =>
        `<button type="button" class="role-option ${state.role === key ? "active" : ""}" data-role="${key}" aria-pressed="${state.role === key}">${key === "outside" ? copy("Outside", "Schiacciatore") : key === "middle" ? copy("Middle 1", "Centrale 1") : key === "middle2" ? copy("Middle 2", "Centrale 2") : key === "opposite" ? copy("Opposite", "Opposto") : key === "ds" ? "DS" : role.name}</button>`,
    )
    .join("");
  $("rotation-options").innerHTML = [4, 3, 2, 5, 6, 1]
    .map(
      (n) =>
        `<button type="button" class="rotation-option ${state.position === n ? "active" : ""}" data-position="${n}" aria-label="${copy("Position", "Posizione")} ${n}, ${positionLabel(n)}" aria-pressed="${state.position === n}">${n}</button>`,
    )
    .join("");
  for (const [attribute, current] of [["serve", state.serve], ["lineup", state.lineup], ["lang", state.lang]]) {
    document.querySelectorAll(`[data-${attribute}]`).forEach((button) => {
      const active = button.dataset[attribute] === current;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  $("lineup-help").textContent = state.lineup === "libero"
    ? copy("One libero replaces the back-row middle between rallies. In this example, FIVB middles serve their own turn; under USA Volleyball, the libero serves for Middle 1 only.", "Un Libero sostituisce il centrale di seconda linea tra uno scambio e l'altro. In questo esempio, con la FIVB i centrali battono nel proprio turno; con USA Volleyball il Libero batte solo al posto del Centrale 1.")
    : copy("Both middle blockers stay on court, including the middle in the back row. They receive, defend, and serve like regular players.", "Entrambi i centrali restano in campo, anche quello in seconda linea. Ricevono, difendono e battono come gli altri giocatori.");
  $("lineup-options").setAttribute("aria-label", copy("Choose a 5–1 lineup", "Scegli la formazione 5–1"));
  $("serve-options").setAttribute("aria-label", copy("Whose serve", "Chi batte"));
  $("rules-select").setAttribute("aria-label", copy("Select volleyball rule set", "Scegli il regolamento di pallavolo"));
  $("timeline").setAttribute("aria-label", copy("Steps through the play", "Passi dello scambio"));
  document.querySelector(".rotation-key").setAttribute("aria-label", copy("Numbered court positions", "Posizioni numerate del campo"));
  document.querySelector(".site-nav").setAttribute("aria-label", copy("Main navigation", "Navigazione principale"));
  document.querySelector(".brand").setAttribute("aria-label", copy("Sideout home", "Sideout, inizio pagina"));
  $("team-prev").setAttribute("aria-label", copy("Previous rotation", "Rotazione precedente"));
  document.documentElement.lang = state.lang;
  document.title = copy("Sideout — Find your place on court", "Sideout — Trova il tuo posto in campo");
  document.querySelector('meta[name="description"]').content = copy(
    "A visual, beginner-friendly guide to indoor volleyball rotations, roles, and where to move on serve and serve receive.",
    "Una guida visiva e semplice alle rotazioni, ai ruoli e agli spostamenti nella pallavolo durante battuta e ricezione.",
  );
  localStorage.setItem("sideout-lang", state.lang);
  $("share-button").innerHTML = `${copy("Share this view", "Condividi questa vista")} <span aria-hidden="true">↗</span>`;
  $("rules-select").value = state.rules;
  $("serve-help").textContent =
    state.serve === "ours"
      ? copy("Their return comes next. Be ready to defend.", "Arriva il loro attacco: preparati a difendere.")
      : copy("Your team receives first and tries to pass, set, and hit.", "La tua squadra riceve per prima e prova a ricevere, alzare e attaccare.");
  $("rules-help").textContent = timingText();
}

function renderCourt() {
  const team = activeLineup();
  const current = stageLayout(state.step, team.bySlot);
  const selected = team.selected;
  const previous =
    state.step === 0
      ? selected ? { [selected]: { ...positions[state.position] } } : {}
      : stageLayout(state.step - 1, team.bySlot);
  $("court-positions").innerHTML = Object.entries(positions)
    .map(
      ([number, pos]) =>
        `<div class="position-ghost ${Number(number) === state.position ? "selected" : ""}" style="left:${pos.x}%;top:${pos.y}%" aria-hidden="true">${number}</div>`,
    )
    .join("");
  $("team-players").innerHTML = Object.entries(current)
    .filter(([id]) => id !== selected)
    .map(
      ([id, point]) =>
        `<div class="team-player" style="left:${point.x}%;top:${point.y}%" aria-label="${playerName(id)}">${id}</div>`,
    )
    .join("");
  const destination = selected ? current[selected] : null;
  const origin = selected ? previous[selected] : null;
  const moving =
    origin &&
    destination &&
    Math.hypot(destination.x - origin.x, destination.y - origin.y) >= 7;
  $("target-token").classList.toggle("hidden", !destination);
  $("start-token").classList.toggle("hidden", !moving);
  $("movement-svg").classList.toggle("hidden", !moving);
  if (destination) {
    $("target-token").style.left = `${destination.x}%`;
    $("target-token").style.top = `${destination.y}%`;
    $("target-token-text").textContent = selected;
  }
  if (origin) {
    $("start-token").style.left = `${origin.x}%`;
    $("start-token").style.top = `${origin.y}%`;
    $("start-token").classList.toggle("server", origin.y > 100);
    $("start-token-text").textContent = state.step === 0 ? state.position : "·";
  }
  if (moving) {
    const dx = destination.x - origin.x;
    const dy = destination.y - origin.y;
    $("movement-path").setAttribute(
      "d",
      `M ${origin.x * 10} ${origin.y * 10} Q ${(origin.x + dx * 0.32) * 10} ${(origin.y + dy * 0.64) * 10} ${destination.x * 10} ${destination.y * 10}`,
    );
  }
  $("server-area").style.visibility =
    state.serve === "ours" && state.step < 2 ? "visible" : "hidden";
  $("court-kicker").textContent =
    `${state.serve === "ours" ? copy("OUR SERVE", "BATTUTA NOSTRA") : copy("THEIR SERVE", "BATTUTA AVVERSARIA")} · 5–1 ${state.lineup === "libero" ? copy("WITH LIBERO", "CON LIBERO") : copy("NO LIBERO", "SENZA LIBERO")} · R${team.turns + 1}`;
  $("court-side-tag").textContent =
    state.lang === "it"
      ? `Giocatore di ${frontRow() ? "prima" : "seconda"} linea · posizione ${state.position}`
      : `${frontRow() ? "Front" : "Back"}-row player · position ${state.position}`;
  $("court-title").textContent = invalidLibero()
    ? copy("Choose a legal libero spot", "Scegli una posizione consentita al Libero")
    : middleOffCourt()
      ? copy("Libero on court · middle off court", "Libero in campo · centrale fuori")
      : `${roleInfo(state.role).name} · ${positionLabel(state.position)}`;
}

function renderTimeline() {
  const titles =
    state.serve === "ours"
      ? [
          copy("Legal start", "Partenza regolare"),
          copy("Serve contact", "Contatto con la battuta"),
          copy("Defend return", "Difendi la risposta"),
          copy("Build attack", "Costruisci l'attacco"),
          copy("Defend again", "Torna in difesa"),
        ]
      : [
          copy("Legal stack", "Disposizione regolare"),
          state.rules === "trial" ? copy("Serving motion", "Gesto di battuta") : copy("Serve contact", "Contatto con la battuta"),
          copy("Pass the serve", "Ricevi la battuta"),
          copy("Build attack", "Costruisci l'attacco"),
          copy("Defend again", "Torna in difesa"),
        ];
  $("timeline").innerHTML = titles
    .map(
      (title, step) =>
        `<button type="button" class="${state.step === step ? "active" : ""}" data-step="${step}" aria-pressed="${state.step === step}"><span class="step-num">0${step + 1}</span><span class="step-title">${title}</span></button>`,
    )
    .join("");
  const instruction = stepCopy();
  $("instruction-kicker").textContent =
    `${state.lang === "it" ? "PASSO" : "STEP"} 0${state.step + 1} · ${roleInfo(state.role).name.toUpperCase()}`;
  $("instruction-title").textContent = instruction.title;
  $("instruction-body").textContent = instruction.body;
  $("instruction-icon").textContent = invalidLibero()
    ? "!"
    : ["◎", "⇢", "↗", "✦", "↓"][state.step];
}

function renderRoles() {
  $("roles-grid").innerHTML = visibleRoles().map((key) => [key, roleInfo(key)])
    .map(
      ([key, role]) =>
        `<button type="button" class="role-card ${state.role === key ? "active" : ""}" data-role="${key}" aria-pressed="${state.role === key}"><span class="role-card-head"><span class="role-card-icon">${role.icon}</span><span class="role-card-arrow">↗</span></span><h3>${role.name}</h3><p>${role.intro}</p></button>`,
    )
    .join("");
}

function renderTeam() {
  const { turns: teamRotation, bySlot: lineup } = activeLineup();
  const highlighted = {
    setter: ["S"],
    outside: ["OH1", "OH2"],
    opposite: ["OP"],
    middle: ["MB1", "MB2"],
    middle2: ["MB2"],
    libero: ["L"],
    ds: ["DS"],
  }[state.role];
  $("team-grid").innerHTML = [4, 3, 2, 5, 6, 1]
    .map((spot) => {
      const role = lineup[spot];
      return `<div class="team-cell ${highlighted.includes(role) ? "highlighted" : ""}" aria-label="${copy("Position", "Posizione")} ${spot}, ${positionLabel(spot)}, ${playerName(role)}"><span class="team-cell-position">${copy("POSITION", "POSIZIONE")} ${spot}</span><strong>${role}</strong><small>${playerName(role)}</small></div>`;
    })
    .join("");
  $("team-rotation-count").textContent = `${copy("ROTATION", "ROTAZIONE")} ${teamRotation + 1} ${copy("OF", "DI")} 6`;
  let setterSpot = 1;
  for (let i = 0; i < teamRotation; i++) setterSpot = nextPosition[setterSpot];
  const previousSpot = previousPosition[setterSpot];
  $("team-example-note").textContent =
    teamRotation === 0
      ? copy("The six numbered spots show who is on court in this lineup. The correct server is in position 1.", "Le sei posizioni numerate mostrano chi è in campo con questa formazione. Il battitore giusto è in posizione 1.")
      : state.lang === "it"
        ? `Dopo un cambio palla, il palleggiatore è passato dalla posizione ${previousSpot} alla ${setterSpot}. Tutti gli altri hanno avanzato di una posizione nello stesso senso.`
        : `After a sideout, the setter moved from position ${previousSpot} to ${setterSpot}. Everyone else moved one spot in the same direction.`;
}

function render() {
  translateStatic(state.lang);
  renderOptions();
  renderCourt();
  renderTimeline();
  renderRoles();
  renderTeam();
  const url = new URL(location.href);
  url.searchParams.delete("team");
  Object.entries(state).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  history.replaceState(null, "", url);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.role) {
    state.role = button.dataset.role;
    render();
  }
  if (button.dataset.lineup) {
    state.lineup = button.dataset.lineup;
    if (state.lineup === "no-libero" && state.role === "libero") state.role = "middle";
    render();
  }
  if (button.dataset.lang) {
    state.lang = button.dataset.lang;
    render();
  }
  if (button.dataset.position) {
    state.position = Number(button.dataset.position);
    render();
  }
  if (button.dataset.serve) {
    state.serve = button.dataset.serve;
    render();
  }
  if (button.dataset.step) {
    state.step = Number(button.dataset.step);
    render();
  }
});

$("rules-select").addEventListener("change", (event) => {
  state.rules = event.target.value;
  render();
});
$("my-next-rotation").addEventListener("click", () => {
  state.position = nextPosition[state.position];
  state.step = 0;
  render();
});
$("team-next").addEventListener("click", () => {
  state.position = nextPosition[state.position];
  state.step = 0;
  render();
});
$("team-prev").addEventListener("click", () => {
  state.position = previousPosition[state.position];
  state.step = 0;
  render();
});
$("share-button").addEventListener("click", async () => {
  const button = $("share-button");
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(location.href);
    } else {
      const field = document.createElement("textarea");
      field.value = location.href;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) throw new Error("Clipboard unavailable");
    }
    button.textContent = copy("Link copied ✓", "Link copiato ✓");
  } catch {
    button.textContent = copy("Copy URL from address bar", "Copia l'indirizzo dalla barra del browser");
  }
  setTimeout(() => {
    button.innerHTML = `${copy("Share this view", "Condividi questa vista")} <span aria-hidden="true">↗</span>`;
  }, 2400);
});

render();
