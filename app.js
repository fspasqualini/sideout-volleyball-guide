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
    name: "Outside hitter 1",
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
roles.outside2 = { ...roles.outside, name: "Outside hitter 2", short: "OH2" };
roles.middle.name = "Middle blocker 1";

function roleInfo(key) {
  return state.lang === "it" ? { ...roles[key], ...roleItalian[key] } : roles[key];
}

const copy = (english, italian) => state.lang === "it" ? italian : english;
const visibleRoles = () => ["setter", "outside", "outside2", "opposite", "middle", "middle2", "libero", "ds"].filter(
  (key) => (key !== "libero" || state.lineup === "libero") &&
    (key !== "ds" || state.lineup !== "open-smart-special"),
);

const positions = {
  4: { x: 18, y: 20, label: "Front left" },
  3: { x: 50, y: 20, label: "Front middle" },
  2: { x: 82, y: 20, label: "Front right" },
  5: { x: 18, y: 75, label: "Back left" },
  6: { x: 50, y: 75, label: "Back middle" },
  1: { x: 82, y: 75, label: "Back right" },
};

let schemeDatabase = null;
let nextPosition = null;
let previousPosition = null;
const exampleNames = {
  S: "Setter",
  OH1: "Outside hitter 1",
  OH2: "Outside hitter 2",
  MB1: "Middle blocker 1",
  MB2: "Middle blocker 2",
  OP: "Opposite",
};
const italianMarkerLabels = {
  S: "P", OH1: "B1", OH2: "B2", MB1: "C1", MB2: "C2",
  OP: "O", L: "L", DS: "SD",
};
const markerLabel = (id) => state.lang === "it" ? italianMarkerLabels[id] : id;
function playerName(id) {
  if (id === "L") return "Libero";
  if (id === "DS") return copy("Defensive specialist", "Specialista difensivo");
  const italian = {
    S: "Palleggiatore", OH1: "Banda 1", OH2: "Banda 2",
    MB1: "Centrale 1", MB2: "Centrale 2", OP: "Opposto",
  };
  return state.lang === "it" ? italian[id] : exampleNames[id];
}

const params = new URLSearchParams(location.search);
const valid = (value, options, fallback) =>
  options.includes(value) ? value : fallback;
const state = {
  lang: valid(params.get("lang"), ["en", "it"],
    valid(localStorage.getItem("sideout-lang"), ["en", "it"], "it")),
  lineup: valid(params.get("lineup"), ["open-smart-special", "libero", "no-libero"], "open-smart-special"),
  role: valid(params.get("role"), Object.keys(roles), "setter"),
  position: valid(Number(params.get("position")), [1, 2, 3, 4, 5, 6], 1),
  serve: valid(params.get("serve"), ["ours", "theirs"], "theirs"),
  rules: valid(params.get("rules"), ["fivb", "usav", "trial"], "fivb"),
  step: valid(
    params.has("step") ? Number(params.get("step")) : null,
    [0, 1, 2, 3, 4, 5, 6, 7],
    0,
  ),
};
if (state.lineup !== "libero" && state.role === "libero") state.role = "setter";
if (state.lineup === "open-smart-special" && state.role === "ds") state.role = "setter";

const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const rallyTitles = {
  rotation: ["Before the serve", "Prima della battuta"],
  serve: ["Our serve", "La nostra battuta"],
  "first-dig": ["Their attack · our dig", "Attacco avversario · difesa"],
  "first-set": ["First set", "Prima alzata"],
  "first-attack": ["First attack", "Primo attacco"],
  "second-dig": ["Second defense", "Seconda difesa"],
  "second-set": ["Second set", "Seconda alzata"],
  "second-attack": ["Second attack", "Secondo attacco"],
  pass: ["Serve reception", "Ricezione"],
};
let playhead = state.step;
let playing = false;
let lastFrameTime = 0;
let animationFrame = 0;
const phases = () => schemeDatabase.rallyPhases[state.serve];
const phaseTitle = (phase) => phase.key === "serve" && state.serve === "theirs"
  ? copy("Their serve", "Battuta avversaria")
  : rallyTitles[phase.key][state.lang === "it" ? 1 : 0];
function phasePositions(team, phase) {
  if (!phase.mix) return team.steps[phase.view].positions;
  const [from, to, fraction] = phase.mix;
  const start = team.steps[from].positions;
  const end = team.steps[to].positions;
  return Object.fromEntries(Object.keys(start).map((id) => [id, {
    x: start[id].x + (end[id].x - start[id].x) * fraction,
    y: start[id].y + (end[id].y - start[id].y) * fraction,
  }]));
}
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
  outside2: "OH2",
  opposite: "OP",
  middle: "MB1",
  middle2: "MB2",
  libero: "MB1",
  ds: "OH2",
};

function activeLineup() {
  const anchor = selectedStartingId[state.role];
  const rotations = state.lineup === "open-smart-special"
    ? schemeDatabase.coachRotations : schemeDatabase.rotations;
  const rotation = schemeDatabase.rotationOrder.find((number) =>
    rotations[number][state.position] === anchor,
  );
  if (rotation === undefined) throw new Error(`No verified rotation for ${state.role} in ${state.position}`);
  const variant = state.lineup === "open-smart-special" ? state.lineup
    : `${state.lineup}${state.role === "ds" ? "-ds" : ""}`;
  const scenario = schemeDatabase.scenarios[variant][state.serve][state.rules][rotation];
  const candidate = {
    setter: "S", outside: "OH1", outside2: "OH2", opposite: "OP", middle: "MB1",
    middle2: "MB2", libero: "L", ds: "DS",
  }[state.role];
  const selected = Object.values(scenario.bySlot).includes(candidate) ? candidate : null;
  return {
    bySlot: scenario.bySlot,
    steps: scenario.steps,
    turns: schemeDatabase.rotationOrder.indexOf(rotation),
    selected,
  };
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
  const coachRotation = state.lineup === "open-smart-special"
    ? schemeDatabase.rotationOrder[activeLineup().turns] : null;
  const coachPasser = coachRotation !== null &&
    schemeDatabase.coachPassers[String(coachRotation)].includes({
      outside: "OH1", outside2: "OH2", middle: "MB1", middle2: "MB2",
    }[state.role] || "");
  const defensiveJob = () => {
    if (state.lineup === "open-smart-special" && !frontRow()) {
      if (["middle", "middle2"].includes(state.role)) return copy(
        "Defend zone 5 on the left, then move to cover your team's attack.",
        "Difendi in zona 5 a sinistra, poi spostati a coprire l'attacco della tua squadra.");
      if (["outside", "outside2"].includes(state.role)) return copy(
        "Defend zone 6 in the middle back; call the ball and be ready to cover the next attack.",
        "Difendi in zona 6 al centro dietro; chiama la palla e preparati a coprire il prossimo attacco.");
    }
    return frontRow() ? role.serveFront : role.serveBack;
  };
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
        body: state.role === "setter"
          ? copy(
            "You are in rotation position 1; the other five are shown in their numbered rotation spots. The opposite is in 4, across the rotation from you. You remain a back-row player for this rally.",
            "Sei in posizione di rotazione 1; gli altri cinque sono nelle loro posizioni numerate. L'Opposto è in zona 4, opposto a te nella rotazione. Resti un giocatore di seconda linea per tutto lo scambio.",
          )
          : copy(
            "You are in rotation position 1; the other five are shown in their numbered rotation spots. You remain a back-row player for this rally.",
            "Sei in posizione di rotazione 1; gli altri cinque sono nelle loro posizioni numerate. Resti un giocatore di seconda linea per tutto lo scambio.",
          ),
      };
    if (state.serve === "ours" && state.rules !== "usav")
      return {
        title: copy("Start in your rotation spot.", "Parti dalla tua posizione di rotazione."),
        body: copy(
          `This view shows the numbered rotation: you are in position ${state.position}. Under FIVB rules, the serving team may switch before contact; the next moment shows that defensive shape. You remain a ${row} player for the rally.`,
          `Questa vista mostra la rotazione numerata: sei in posizione ${state.position}. Secondo la FIVB, la squadra in battuta può spostarsi prima del contatto; il passo successivo mostra la difesa. Resti un giocatore di ${row} per tutto lo scambio.`,
        ),
      };
    return {
      title: copy("Start in your rotation spot.", "Parti dalla tua posizione di rotazione."),
      body: state.lang === "it"
        ? `Questa vista mostra la rotazione numerata: sei in posizione ${state.position} (${positionLabel(state.position)}). Nel passo successivo puoi avvicinarti alla zona di gioco, rispettando l'ordine richiesto fino al momento previsto dalle regole.`
        : `This view shows the numbered rotation: you are in position ${state.position} (${positions[state.position].label.toLowerCase()}). In the next moment, you can stack closer to your playing area while keeping the required order until the rules allow you to move.`,
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
      body: state.lineup === "open-smart-special" && state.serve === "theirs"
        ? coachPasser
          ? copy("You are one of the three passers. Watch your lane and send the serve toward the setter; then move to your playing area.", "Sei uno dei tre ricevitori. Copri la tua corsia e indirizza la battuta al palleggiatore; poi vai nella tua zona di gioco.")
          : state.role === "opposite"
            ? copy("You do not join the three-player receive line. Cover only a very short serve, then get ready to attack.", "Non partecipi alla ricezione a tre. Copri solo una battuta cortissima, poi preparati ad attaccare.")
            : state.role === "setter"
              ? copy("Let the three passers take the serve. Move toward the setting area as soon as the ball is hit and prepare for the second touch.", "Lascia ricevere ai tre ricevitori. Appena la palla è battuta, vai verso la zona di alzata e preparati per il secondo tocco.")
              : copy("Stay low and cover a very short serve; then move to your playing area.", "Stai basso e copri una battuta cortissima; poi vai nella tua zona di gioco.")
        :
        state.serve === "ours"
          ? defensiveJob()
          : frontRow()
            ? role.receiveFront
            : role.receiveBack,
    };
  if (state.step === 4)
    return {
      title: copy("Switch back to defense.", "Torna in difesa."),
      body: state.lineup === "open-smart-special" && state.serve === "theirs" && coachRotation === 1 && frontRow() && state.role === "opposite"
        ? copy("Stay on the left in zone 4, as in the coach's P1 plan. Watch the opponent's right-side hitter and help block.", "Resta a sinistra in zona 4, come nello schema P1 del coach. Osserva l'attaccante avversario a destra e aiuta a murare.")
        : state.lineup === "open-smart-special" && state.serve === "theirs" && coachRotation === 1 && frontRow() && state.role === "outside"
          ? copy("Stay on the right in zone 2, as in the coach's P1 plan. Cover tips and help block on this side.", "Resta a destra in zona 2, come nello schema P1 del coach. Copri i pallonetti e aiuta a murare su questo lato.")
          : defensiveJob(),
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
  attackCopy.outside2 = attackCopy.outside;
  if (coachRotation === 1 && state.serve === "theirs") {
    if (state.role === "opposite") attackCopy.opposite = copy(
      "In this P1 plan, stay on the left and attack from zone 4.",
      "In questo schema P1 resti a sinistra e attacchi da zona 4.");
    if (state.role === "outside") attackCopy.outside = copy(
      "In this P1 plan, Outside 1 attacks from zone 2; do not swap with the opposite.",
      "In questo schema P1, Banda 1 attacca da zona 2: non scambiarti con l'Opposto.");
  }
  if (coachRotation === 2 && state.serve === "theirs" && state.role === "opposite") {
    attackCopy.opposite = copy(
      "This P2 plan has no zone-2 attack. Cover the hitter and prepare for the next ball.",
      "In questo schema P2 non c'è un attacco da zona 2. Copri l'attaccante e preparati alla palla successiva.");
  }
  return {
    title: copy("Switch from first touch to attack.", "Passa dal primo tocco all'attacco."),
    body: attackCopy[state.role],
  };
}

function renderOptions() {
  $("role-options").innerHTML = visibleRoles().map((key) => [key, roleInfo(key)])
    .map(
      ([key, role]) =>
        `<button type="button" class="role-option ${state.role === key ? "active" : ""}" data-role="${key}" aria-pressed="${state.role === key}">${key === "outside" ? copy("Outside 1", "Banda 1") : key === "outside2" ? copy("Outside 2", "Banda 2") : key === "middle" ? copy("Middle 1", "Centrale 1") : key === "middle2" ? copy("Middle 2", "Centrale 2") : key === "opposite" ? copy("Opposite", "Opposto") : key === "ds" ? copy("DS", "SD") : role.name}</button>`,
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
  document.querySelectorAll("[data-focus]").forEach((button) => {
    const active = button.dataset.focus === (phases()[state.step].key === "first-attack" ? "attack" : phases()[state.step].key === "second-dig" ? "defense" : "");
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("lineup-help").textContent = state.lineup === "open-smart-special"
    ? copy("Coach's three-player receive: two outsides and the back-row middle. No Libero; the opposite covers only very short serves.", "Ricezione a tre del coach: due bande e il centrale dietro. Senza Libero; l'Opposto copre solo le battute cortissime.")
    : state.lineup === "libero"
      ? copy("Libero replaces the back-row middle between rallies.", "Il Libero sostituisce il centrale di seconda linea tra gli scambi.")
      : copy("Both middles stay on court, including in the back row.", "Entrambi i centrali restano in campo, anche in seconda linea.");
  $("lineup-options").setAttribute("aria-label", copy("Choose a team plan", "Scegli lo schema di squadra"));
  $("player-selection-summary").textContent = `${roleInfo(state.role).name} · ${copy("position", "posizione")} ${state.position}`;
  $("focus-options").setAttribute("aria-label", copy("Choose attack or defense view", "Scegli vista attacco o difesa"));
  document.querySelector(".setup-bar").setAttribute("aria-label", copy("General game settings", "Impostazioni generali di gioco"));
  document.querySelector(".controls-panel").setAttribute("aria-label", copy("Player navigation", "Scelte del giocatore"));
  $("serve-options").setAttribute("aria-label", copy("Whose serve", "Chi batte"));
  $("rules-select").setAttribute("aria-label", copy("Select volleyball rule set", "Scegli il regolamento di pallavolo"));
  $("timeline").setAttribute("aria-label", copy("Steps through the play", "Passi dello scambio"));
  document.querySelector(".rotation-key").setAttribute("aria-label", copy("Numbered court positions", "Posizioni numerate del campo"));
  $("player-key").setAttribute("aria-label", copy("Player marker abbreviations", "Abbreviazioni dei giocatori sul campo"));
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
  const selected = team.selected;
  $("court-positions").innerHTML = Object.entries(positions)
    .map(
      ([number, pos]) =>
        `<div class="position-ghost ${Number(number) === state.position ? "selected" : ""}" style="left:${pos.x}%;top:${pos.y}%" aria-hidden="true">${number}</div>`,
    )
    .join("");
  $("team-players").innerHTML = Object.entries(team.steps[0].positions)
    .filter(([id]) => id !== selected)
    .map(
      ([id]) =>
        `<div class="team-player" data-player="${id}" aria-label="${playerName(id)}" title="${playerName(id)}">${markerLabel(id)}</div>`,
    )
    .join("");
  $("target-token").classList.toggle("hidden", !selected);
  if (selected) {
    $("target-token-text").textContent = markerLabel(selected);
    $("target-token").setAttribute("aria-label", playerName(selected));
    $("target-token").title = playerName(selected);
  }
  $("server-area").style.visibility =
    state.serve === "ours" && state.step < 2 ? "visible" : "hidden";
  $("court-kicker").textContent =
    `${state.serve === "ours" ? copy("OUR SERVE", "BATTUTA NOSTRA") : copy("THEIR SERVE", "BATTUTA AVVERSARIA")} · ${state.lineup === "open-smart-special" ? "OPEN SMART SPECIAL" : `5–1 ${state.lineup === "libero" ? copy("WITH LIBERO", "CON LIBERO") : copy("NO LIBERO", "SENZA LIBERO")}`} · R${team.turns + 1}`;
  $("scheme-source-label").textContent = state.lineup === "open-smart-special"
    ? copy("Coach's 2015 serve-receive diagrams · later play adapted from", "Schemi di ricezione del coach (2015) · gioco successivo adattato da")
    : copy("5–1 three-receiver example · court positions from", "Esempio 5–1 con tre ricevitori · posizioni in campo da");
  $("court-side-tag").textContent =
    state.lang === "it"
      ? `Giocatore di ${frontRow() ? "prima" : "seconda"} linea · posizione ${state.position}`
      : `${frontRow() ? "Front" : "Back"}-row player · position ${state.position}`;
  $("court-title").textContent = invalidLibero()
    ? copy("Choose a legal libero spot", "Scegli una posizione consentita al Libero")
    : middleOffCourt()
      ? copy("Libero on court · middle off court", "Libero in campo · centrale fuori")
      : `${roleInfo(state.role).name} · ${positionLabel(state.position)}`;
  const onCourt = new Set(Object.values(team.bySlot));
  $("player-key").innerHTML = ["S", "OH1", "OH2", "MB1", "MB2", "OP", "L", "DS"]
    .filter((id) => onCourt.has(id))
    .map((id) => `<span><b>${markerLabel(id)}</b> ${playerName(id)}</span>`)
    .join("");
  const setterSpot = Number(Object.keys(team.bySlot).find((slot) => team.bySlot[slot] === "S"));
  const oppositeSpot = Number(Object.keys(team.bySlot).find((slot) => team.bySlot[slot] === "OP"));
  $("rotation-relationship").textContent = copy(
    `Rotation spots: setter ${setterSpot}, opposite ${oppositeSpot}. Players can move to their playing areas when the rules allow.`,
    `Posizioni di rotazione: palleggiatore ${setterSpot}, opposto ${oppositeSpot}. I giocatori si spostano nelle zone di gioco quando le regole lo permettono.`,
  );
  renderPlayhead();
}

function renderPlayhead() {
  if (!schemeDatabase) return;
  const team = activeLineup();
  const sequence = phases();
  const fromIndex = Math.min(Math.floor(playhead), sequence.length - 1);
  const toIndex = Math.min(fromIndex + 1, sequence.length - 1);
  const fraction = reducedMotion.matches ? 0 : playhead - fromIndex;
  const from = phasePositions(team, sequence[fromIndex]);
  const to = phasePositions(team, sequence[toIndex]);
  const place = (element, point) => {
    element.style.left = `${point.x}%`;
    element.style.top = `${point.y}%`;
  };
  const interpolate = (a, b) => ({
    x: a.x + (b.x - a.x) * fraction,
    y: a.y + (b.y - a.y) * fraction,
  });
  document.querySelectorAll("#team-players [data-player]").forEach((marker) => {
    const id = marker.dataset.player;
    place(marker, interpolate(from[id], to[id]));
  });
  const selected = team.selected;
  if (selected) place($("target-token"), interpolate(from[selected], to[selected]));
  const pathIndex = fraction > 0 ? toIndex : fromIndex;
  const previous = phasePositions(team, sequence[Math.max(0, pathIndex - 1)]);
  const destination = phasePositions(team, sequence[pathIndex]);
  const origin = selected && previous[selected];
  const end = selected && destination[selected];
  const moving = pathIndex > 0 && origin && end && Math.hypot(end.x - origin.x, end.y - origin.y) > 7;
  $("start-token").classList.toggle("hidden", !moving);
  $("movement-svg").classList.toggle("hidden", !moving);
  if (moving) {
    place($("start-token"), origin);
    $("start-token").classList.remove("server");
    $("start-token-text").textContent = "·";
    $("movement-path").setAttribute("d", `M ${origin.x * 10} ${origin.y * 10} L ${end.x * 10} ${end.y * 10}`);
  }
  const ballByEvent = {
    rotation: null, serve: { x: 58, y: -5 },
    "first-dig": { x: 48, y: 70 }, "second-dig": { x: 48, y: 70 },
    pass: { x: 45, y: 66 }, "first-set": { x: 75, y: 22 },
    "second-set": { x: 75, y: 22 }, "first-attack": { x: 37, y: 9 },
    "second-attack": { x: 37, y: 9 },
  };
  const ball = ballByEvent[sequence[fromIndex].key];
  $("rally-ball").hidden = !ball;
  if (ball) place($("rally-ball"), ball);
  $("rally-scrub").value = String(Math.round(playhead * 100));
  $("rally-scrub").setAttribute("aria-valuetext", phaseTitle(sequence[fromIndex]));
}

function renderTimeline() {
  const sequence = phases();
  $("timeline").innerHTML = sequence
    .map(
      (phase, step) =>
        `<button type="button" class="${state.step === step ? "active" : ""}" data-step="${step}" aria-pressed="${state.step === step}"><span class="step-num">0${step + 1}</span><span class="step-title">${phaseTitle(phase)}</span></button>`,
    )
    .join("");
  $("rally-cycle-note").textContent = copy(
    "If the ball returns after the second attack, repeat: defense → set → attack.",
    "Se la palla torna dopo il secondo attacco, ripeti: difesa → alzata → attacco.",
  );
  const phase = sequence[state.step];
  const originalStep = state.step;
  state.step = phase.view;
  const instruction = stepCopy();
  state.step = originalStep;
  const firstTouch = phase.key === "pass"
    ? copy("A serve pass starts when the other team serves. Guide that ball toward the setter.", "La ricezione parte dalla battuta avversaria. Indirizza quella palla al palleggiatore.")
    : phase.key === "first-dig" || phase.key === "second-dig"
      ? copy("A dig follows an opponent's attack. Keep the ball alive, then build the next play.", "La difesa segue un attacco avversario. Tieni viva la palla, poi costruisci l'azione successiva.")
      : "";
  $("rally-event").textContent = phase.key === "second-attack"
    ? copy("If the ball comes back, repeat from second defense. These later movements are illustrative.", "Se la palla torna, riprendi dalla seconda difesa. Questi spostamenti successivi sono illustrativi.")
    : firstTouch || (state.lineup === "open-smart-special" && state.step > 2
    ? copy("Attack and defense movement is an illustrative adaptation; the coach's 2015 diagrams cover reception only.", "Gli spostamenti di attacco e difesa sono adattamenti illustrativi; gli schemi del coach del 2015 mostrano solo la ricezione.")
    : copy("All six markers move between checked scheme positions; intermediate motion and the ball are illustrative.", "Tutti e sei i giocatori si spostano tra posizioni verificate; i movimenti intermedi e la palla sono illustrativi."));
  $("instruction-kicker").textContent =
    `${state.lang === "it" ? "PASSO" : "STEP"} 0${state.step + 1} · ${roleInfo(state.role).name.toUpperCase()}`;
  $("instruction-title").textContent = phaseTitle(phase);
  $("instruction-body").textContent = `${firstTouch ? `${firstTouch} ` : ""}${instruction.body}`;
  $("instruction-icon").textContent = invalidLibero()
    ? "!"
    : ["◎", "⇢", "↗", "✦", "↑", "↓", "✦", "↑"][state.step];
  $("rally-play").textContent = playing ? "❚❚" : "▶";
  $("rally-play").setAttribute("aria-label", playing ? copy("Pause rally", "Pausa lo scambio") : copy("Play rally", "Avvia lo scambio"));
  $("rally-back").setAttribute("aria-label", copy("Previous phase", "Fase precedente"));
  $("rally-next").setAttribute("aria-label", copy("Next phase", "Fase successiva"));
  $("rally-speed").setAttribute("aria-label", copy("Animation speed", "Velocità dell'animazione"));
  $("rally-scrub").setAttribute("aria-label", copy("Rally timeline", "Sequenza dello scambio"));
  document.querySelector(".rally-controls").setAttribute("aria-label", copy("Rally animation controls", "Comandi dell'animazione dello scambio"));
  $("rally-back").disabled = state.step === 0;
  $("rally-next").disabled = state.step === sequence.length - 1;
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
    outside: ["OH1"],
    outside2: ["OH2"],
    opposite: ["OP"],
    middle: ["MB1", "MB2"],
    middle2: ["MB2"],
    libero: ["L"],
    ds: ["DS"],
  }[state.role];
  $("team-grid").innerHTML = [4, 3, 2, 5, 6, 1]
    .map((spot) => {
      const role = lineup[spot];
      return `<div class="team-cell ${highlighted.includes(role) ? "highlighted" : ""}" aria-label="${copy("Position", "Posizione")} ${spot}, ${positionLabel(spot)}, ${playerName(role)}"><span class="team-cell-position">${copy("POSITION", "POSIZIONE")} ${spot}</span><strong>${markerLabel(role)}</strong><small>${playerName(role)}</small></div>`;
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
  if (!schemeDatabase) return;
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

function pauseRally() {
  playing = false;
  cancelAnimationFrame(animationFrame);
  lastFrameTime = 0;
  if (schemeDatabase) renderTimeline();
}

function seekRally(value) {
  pauseRally();
  playhead = Math.max(0, Math.min(phases().length - 1, value));
  state.step = Math.floor(playhead);
  render();
}

function tickRally(time) {
  if (!playing) return;
  if (lastFrameTime) {
    const speed = Number($("rally-speed").value);
    playhead = Math.min(phases().length - 1, playhead + (time - lastFrameTime) * speed / 1650);
    const activeStep = Math.min(phases().length - 1, Math.floor(playhead));
    if (activeStep !== state.step) {
      state.step = activeStep;
      render();
    } else renderPlayhead();
    if (playhead >= phases().length - 1) {
      pauseRally();
      renderPlayhead();
      return;
    }
  }
  lastFrameTime = time;
  animationFrame = requestAnimationFrame(tickRally);
}

$("rally-play").addEventListener("click", () => {
  if (playing) { pauseRally(); return; }
  if (playhead >= phases().length - 1) seekRally(0);
  playing = true;
  renderTimeline();
  animationFrame = requestAnimationFrame(tickRally);
});
$("rally-back").addEventListener("click", () => seekRally(state.step - 1));
$("rally-next").addEventListener("click", () => seekRally(state.step + 1));
$("rally-scrub").addEventListener("input", (event) => seekRally(Number(event.target.value) / 100));
reducedMotion.addEventListener("change", () => { pauseRally(); renderPlayhead(); });

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.role) {
    pauseRally();
    state.role = button.dataset.role;
    render();
  }
  if (button.dataset.lineup) {
    pauseRally();
    state.lineup = button.dataset.lineup;
    if (state.lineup !== "libero" && state.role === "libero") state.role = "middle";
    if (state.lineup === "open-smart-special" && state.role === "ds") state.role = "outside";
    render();
  }
  if (button.dataset.lang) {
    pauseRally();
    state.lang = button.dataset.lang;
    render();
  }
  if (button.dataset.focus) {
    seekRally(button.dataset.focus === "attack" ? 4 : 5);
  }
  if (button.dataset.position) {
    pauseRally();
    state.position = Number(button.dataset.position);
    render();
  }
  if (button.dataset.serve) {
    pauseRally();
    state.serve = button.dataset.serve;
    state.step = 0;
    playhead = 0;
    render();
  }
  if (button.dataset.step) {
    seekRally(Number(button.dataset.step));
  }
});

$("rules-select").addEventListener("change", (event) => {
  pauseRally();
  state.rules = event.target.value;
  render();
});
$("my-next-rotation").addEventListener("click", () => {
  pauseRally();
  if (!nextPosition) return;
  state.position = nextPosition[state.position];
  state.step = 0;
  playhead = 0;
  render();
});
$("team-next").addEventListener("click", () => {
  pauseRally();
  if (!nextPosition) return;
  state.position = nextPosition[state.position];
  state.step = 0;
  playhead = 0;
  render();
});
$("team-prev").addEventListener("click", () => {
  pauseRally();
  if (!previousPosition) return;
  state.position = previousPosition[state.position];
  state.step = 0;
  playhead = 0;
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

const mobileNavigation = window.matchMedia("(max-width: 780px)");
$("player-navigation").open = !mobileNavigation.matches;
mobileNavigation.addEventListener("change", (event) => {
  $("player-navigation").open = !event.matches;
});

fetch("./data/schemes.json?v=3")
  .then((response) => {
    if (!response.ok) throw new Error(`Court database returned ${response.status}`);
    return response.json();
  })
  .then((database) => {
    if (database.schemaVersion !== 3) throw new Error("Unsupported court database version");
    schemeDatabase = database;
    nextPosition = database.nextPosition;
    previousPosition = Object.fromEntries(
      Object.entries(nextPosition).map(([from, to]) => [to, Number(from)]),
    );
    render();
  })
  .catch((error) => {
    console.error(error);
    $("court-title").textContent = "Court data could not load / Impossibile caricare i dati del campo";
  });
