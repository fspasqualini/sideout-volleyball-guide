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
};
roles.middle2 = { ...roles.middle, name: "Middle blocker 2", short: "MB2" };
roles.outside2 = { ...roles.outside, name: "Outside hitter 2", short: "OH2" };
roles.middle.name = "Middle blocker 1";

function roleInfo(key) {
  return state.lang === "it" ? { ...roles[key], ...roleItalian[key] } : roles[key];
}

const copy = (english, italian) => state.lang === "it" ? italian : english;
const visibleRoles = () => ["setter", "outside", "outside2", "opposite", "middle", "middle2", "libero"].filter(
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
  OP: "O", L: "L",
};
const markerLabel = (id) => state.lang === "it" ? italianMarkerLabels[id] : id;
function playerName(id) {
  if (id === "L") return "Libero";
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
  opponents: params.has("opponents") ? ["1", "true"].includes(params.get("opponents")) : true,
  step: valid(
    params.has("step") ? Number(params.get("step")) : null,
    [0, 1, 2, 3, 4, 5, 6, 7],
    0,
  ),
  view: valid(params.get("view"), ["animation", "cards"], "animation"),
};
if (state.lineup !== "libero" && state.role === "libero") state.role = "setter";

const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const rallyTitles = {
  rotation: ["Rotation positions", "Posizioni di rotazione"],
  serve: ["Serve", "Battuta"],
  receive: ["Serve reception", "Ricezione della battuta"],
  "receive-set": ["Sideout set", "Alzata del cambio palla"],
  "receive-attack": ["Sideout attack", "Attacco del cambio palla"],
  "transition-dig": ["Dig · transition", "Difesa · transizione"],
  "transition-set": ["Transition set", "Alzata della transizione"],
  counterattack: ["Counterattack", "Contrattacco"],
};
let playhead = state.step;
let playing = false;
let lastFrameTime = 0;
let animationFrame = 0;
// Time between touches: slow enough to follow the routes, without freezing at each touch.
const teachingLegMs = [1800, 2600, 1900, 1800, 2400, 1900, 1800];
const ballContactLiftPx = 32;
const phases = () => schemeDatabase.rallyPhases[state.serve];
const phaseTitle = (phase) => rallyTitles[phase.key][state.lang === "it" ? 1 : 0];
const ownerLabel = (phase) => phase.owner === "none" ? "" : phase.owner === "ours"
  ? copy("Our team", "Noi") : copy("Other team", "Avversari");
function phasePositions(team, phase, opponent = false) {
  const view = opponent ? phase.opponentView : phase.view;
  const mix = opponent ? phase.opponentMix : phase.mix;
  if (!mix) return team.steps[view].positions;
  const [from, to, fraction] = mix;
  const start = team.steps[from].positions;
  const end = team.steps[to].positions;
  return Object.fromEntries(Object.keys(start).map((id) => [id, {
    x: start[id].x + (end[id].x - start[id].x) * fraction,
    y: start[id].y + (end[id].y - start[id].y) * fraction,
  }]));
}
function rallyPositions(team, sequence, index, opponent = false) {
  const base = phasePositions(team, sequence[index], opponent);
  const receiving = opponent ? state.serve === "ours" : state.serve === "theirs";
  const settingSpot = team.steps[3].positions.S;
  const points = { ...base };
  if (receiving && index === 3) {
    // The front row begins its attacking transition during the pass, rather
    // than holding the serve-receive stack until the next timeline moment.
    for (const slot of ["4", "3", "2"]) {
      const player = team.bySlot[slot];
      if (player !== "S") points[player] = team.steps[3].positions[player];
    }
  }
  let fraction = 0;
  if (receiving && index === 2) fraction = 0.78;
  if (receiving && index === 3) fraction = 1;
  if (!receiving && index === 5) fraction = 0.38;
  if (!receiving && index === 6) fraction = 1;
  if (!fraction) return points;
  // The checked serve-contact stack is unchanged. The setter's route after
  // contact is an illustrative bridge to the checked attack view.
  const start = receiving
    ? phasePositions(team, sequence[1], opponent).S
    : phasePositions(team, sequence[4], opponent).S;
  return { ...points, S: {
    x: start.x + (settingSpot.x - start.x) * fraction,
    y: start.y + (settingSpot.y - start.y) * fraction,
  } };
}

function rallyTouch(team, sequence, index, opponent = false) {
  const points = rallyPositions(team, sequence, index, opponent);
  if (index === 0 || index === 1) {
    const player = team.bySlot["1"];
    const server = points[player];
    return { x: server.x, y: Math.min(server.y, 105), player };
  }
  if (index === 3 || index === 6) return { ...points.S, player: "S" };
  const slots = index === 4 || index === 7 ? ["4", "3", "2"] : ["5", "6", "1"];
  const candidates = slots.map((slot) => team.bySlot[slot]).filter((id) => id !== "S" && points[id]);
  if (index === 4 || index === 7) {
    // One outside is in the front row in every 5–1 rotation. This is an
    // illustrative attack choice, not a claim about the coach's play call.
    const player = candidates.find((id) => id === "OH1" || id === "OH2") || candidates[0];
    return { ...points[player], player };
  }
  // In a reception, prefer one of the coach's named three passers. A back-row
  // player nearest zone 6 handles the illustrative dig after an attack.
  const rotation = schemeDatabase.rotationOrder[team.turns || 0];
  const passers = schemeDatabase.coachPassers[String(rotation)];
  const eligible = index === 2 && !opponent && state.lineup === "open-smart-special"
    ? candidates.filter((id) => passers.includes(id)) : candidates;
  const pool = eligible.length ? eligible : candidates;
  const target = { x: 50, y: 65 };
  const id = pool.reduce((best, current) =>
    Math.hypot(points[current].x - target.x, points[current].y - target.y) <
      Math.hypot(points[best].x - target.x, points[best].y - target.y) ? current : best);
  return { ...points[id], player: id };
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
};

function activeLineup() {
  const anchor = selectedStartingId[state.role];
  const rotations = state.lineup === "open-smart-special"
    ? schemeDatabase.coachRotations : schemeDatabase.rotations;
  const rotation = schemeDatabase.rotationOrder.find((number) =>
    rotations[number][state.position] === anchor,
  );
  if (rotation === undefined) throw new Error(`No verified rotation for ${state.role} in ${state.position}`);
  const variant = state.lineup;
  const scenario = schemeDatabase.scenarios[variant][state.serve][state.rules][rotation];
  const candidate = {
    setter: "S", outside: "OH1", outside2: "OH2", opposite: "OP", middle: "MB1",
    middle2: "MB2", libero: "L",
  }[state.role];
  const selected = Object.values(scenario.bySlot).includes(candidate) ? candidate : null;
  return {
    bySlot: scenario.bySlot,
    steps: scenario.steps,
    turns: schemeDatabase.rotationOrder.indexOf(rotation),
    selected,
  };
}

function opponentLineup() {
  // A generic P1 5–1 example, checked for the chosen rules but not a claim
  // about the real opponents' roster or play calls.
  return schemeDatabase.scenarios["no-libero"][state.serve === "ours" ? "theirs" : "ours"][state.rules]["1"];
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
    if (state.serve === "theirs" && state.role === "setter") return frontRow()
      ? copy("Hold right front, read their set, and help block when they counterattack.", "Resta davanti a destra, leggi la loro alzata e aiuta a murare il contrattacco.")
      : copy("Return to right-back defense after our attack. On our next first touch, run toward the setting area.", "Dopo il nostro attacco torna a difendere in zona 1. Al nostro prossimo primo tocco, vai verso la zona di alzata.");
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

const rotationNeighbors = {
  4: { right: 3, back: 5 }, 3: { left: 4, right: 2, back: 6 },
  2: { left: 3, back: 1 }, 5: { right: 6, front: 4 },
  6: { left: 5, right: 1, front: 3 }, 1: { left: 6, front: 2 },
};

function phaseInstruction(phase) {
  const previousStep = state.step;
  state.step = phase.view;
  const instruction = stepCopy();
  state.step = previousStep;
  if (phase.key === "receive-set" && phase.owner === "ours" && !invalidLibero() && !middleOffCourt()) {
    const body = state.role === "setter"
      ? copy("Reach the setting spot as the pass travels toward you; take the second touch. If you began in the back row, you still cannot block.", "Raggiungi la zona d'alzata mentre la ricezione viaggia verso di te; prendi il secondo tocco. Se sei partito in seconda linea, non puoi comunque murare.")
      : state.role === "libero"
        ? copy("Stay behind the attack and cover your teammates as the setter takes the second touch. You cannot block or attack a ball entirely above the net.", "Resta dietro l'attacco e copri i compagni mentre il palleggiatore prende il secondo tocco. Non puoi murare né attaccare una palla completamente sopra la rete.")
      : frontRow()
        ? copy("After covering the serve, move into your attacking lane and watch the setter. Be ready for the set or to cover the hitter.", "Dopo aver coperto la battuta, vai nella tua corsia d'attacco e guarda il palleggiatore. Preparati all'alzata o a coprire chi attacca.")
        : copy("Stay behind the attack and cover your teammates as the setter takes the second touch. If you attack above the net, take off behind the attack line.", "Resta dietro l'attacco e copri i compagni mentre il palleggiatore prende il secondo tocco. Se attacchi sopra la rete, stacca da dietro la linea dei tre metri.");
    return { ...instruction, body };
  }
  const opposingAction = phase.owner === "theirs" && phase.key !== "serve"
    ? phase.key === "receive" ? copy("They receive; we take our defensive shape. ", "Loro ricevono; noi ci disponiamo in difesa. ")
      : phase.key === "receive-set" || phase.key === "transition-set" ? copy("They set; read the setter and stay ready to defend. ", "Loro alzano; leggi il palleggiatore e preparati a difendere. ")
        : phase.key === "transition-dig" ? copy("They dig our attack; move back into defense. ", "Loro difendono il nostro attacco; torna in difesa. ")
          : copy("They attack; keep your defensive responsibility. ", "Loro attaccano; mantieni il tuo compito difensivo. ")
    : "";
  return { ...instruction, body: `${opposingAction}${instruction.body}` };
}

function courtArea(point) {
  if (point.y > 100) return copy("behind the baseline to serve", "dietro la linea di fondo per battere");
  const side = point.x < 34 ? copy("left", "sinistra")
    : point.x > 66 ? copy("right", "destra") : copy("middle", "centro");
  const depth = point.y < 34 ? copy("near the net", "vicino alla rete")
    : point.y < 68 ? copy("around the attack line", "intorno alla linea dei tre metri")
      : copy("in the back court", "nella parte di fondo campo");
  return copy(`${side === "middle" ? "In the middle" : `On the ${side}`}, ${depth}`, `${side === "centro" ? "Al" : "A"} ${side}, ${depth}`);
}

function teammatesAtPhase(phase, team, sequence, index) {
  const ours = (phase.owner === "none" ? state.serve : phase.owner) === "ours";
  const touch = rallyTouch(ours ? team : opponentLineup(), sequence, index, !ours);
  const actor = ours && touch?.player ? playerName(touch.player) : null;
  switch (phase.key) {
    case "rotation": return copy("Everyone checks the numbered rotation before the serve.", "Tutti controllano la rotazione numerata prima della battuta.");
    case "serve": return state.serve === "ours"
      ? copy(`${playerName(team.bySlot[1])} serves; the others prepare to defend the return.`, `${playerName(team.bySlot[1])} batte; gli altri si preparano a difendere il ritorno.`)
      : copy("The opponents serve; our receivers and setter prepare for the first two touches.", "Gli avversari battono; i nostri ricevitori e il palleggiatore preparano i primi due tocchi.");
    case "receive": return ours
      ? copy(`${actor} receives the serve; the setter moves toward the second touch.`, `${actor} riceve la battuta; il palleggiatore si sposta verso il secondo tocco.`)
      : copy("They receive our serve; our team takes its defensive shape.", "Loro ricevono la nostra battuta; la nostra squadra si dispone in difesa.");
    case "receive-set": return ours
      ? copy("The setter reaches the ball; front-row hitters prepare their approaches.", "Il palleggiatore raggiunge la palla; gli attaccanti di prima linea preparano la rincorsa.")
      : copy("Their setter prepares the attack; watch their hitters.", "Il loro palleggiatore prepara l'attacco; osserva i loro attaccanti.");
    case "receive-attack": return ours
      ? copy(`${actor} attacks; teammates cover the hitter and prepare for a return.`, `${actor} attacca; i compagni lo coprono e si preparano al ritorno.`)
      : copy("They attack; our team reads the shot and defends.", "Loro attaccano; la nostra squadra legge il colpo e difende.");
    case "transition-dig": return ours
      ? copy(`${actor} digs their attack; the setter moves toward the next touch.`, `${actor} difende il loro attacco; il palleggiatore va verso il prossimo tocco.`)
      : copy("They dig our attack; our team returns to defensive cover.", "Loro difendono il nostro attacco; la nostra squadra torna in copertura difensiva.");
    case "transition-set": return ours
      ? copy("Our setter takes the second touch; hitters get ready again.", "Il nostro palleggiatore prende il secondo tocco; gli attaccanti si preparano di nuovo.")
      : copy("They set their next attack; our defenders track the ball and hitters.", "Loro alzano per il prossimo attacco; i nostri difensori seguono palla e attaccanti.");
    default: return ours
      ? copy(`${actor} counterattacks; the others cover and prepare to defend again.`, `${actor} contrattacca; gli altri coprono e si preparano a difendere ancora.`)
      : copy("They counterattack; our team is ready for the next dig.", "Loro contrattaccano; la nostra squadra è pronta alla prossima difesa.");
  }
}

function renderCards() {
  const team = activeLineup();
  const sequence = phases();
  const selected = team.selected;
  const actualSlot = Number(Object.keys(team.bySlot).find((slot) => team.bySlot[slot] === selected));
  const slot = actualSlot || state.position;
  const showRelations = Boolean(actualSlot) && !invalidLibero() && !middleOffCourt();
  $("checklist-kicker").textContent = `${state.serve === "ours" ? copy("OUR SERVE", "BATTUTA NOSTRA") : copy("THEIR SERVE", "BATTUTA AVVERSARIA")} · R${team.turns + 1}`;
  $("checklist-title").textContent = copy(`${roleInfo(state.role).name} · rotation position ${state.position}`, `${roleInfo(state.role).name} · posizione di rotazione ${state.position}`);
  $("checklist-intro").textContent = copy(
    "Eight still frames from the same rally. The net is above; left and right are seen while facing it. Choose a phase below to inspect your place and the whole team.",
    "Otto fotogrammi dello stesso scambio. La rete è in alto; sinistra e destra sono viste guardandola. Scegli una fase per controllare dove sei e vedere tutta la squadra.",
  );
  if (showRelations) {
    const relations = Object.entries(rotationNeighbors[slot]).map(([direction, neighborSlot]) => {
      const label = {
        left: copy("Left of you in your row", "Alla tua sinistra nella fila"),
        right: copy("Right of you in your row", "Alla tua destra nella fila"),
        front: copy("In front of you", "Davanti a te"),
        back: copy("Behind you", "Dietro di te"),
      }[direction];
      return `<div><span>${label}</span><strong>${playerName(team.bySlot[neighborSlot])} · ${neighborSlot}</strong></div>`;
    }).join("");
    $("checklist-relationships").innerHTML = `<h4>${copy("Your rotation references", "I tuoi riferimenti nella rotazione")}</h4><div class="relationship-grid">${relations}</div><p>${timingText()} ${copy("At the required moment, relative foot positions determine legality; the dots are teaching markers. Your front- or back-row status remains the same for the rally.", "Al momento previsto contano i rapporti tra i piedi; i pallini sono indicativi. Resti di prima o seconda linea per tutto lo scambio.")}</p>`;
  } else {
    $("checklist-relationships").innerHTML = `<h4>${copy("Your rotation references", "I tuoi riferimenti nella rotazione")}</h4><p>${invalidLibero() ? copy("The Libero cannot occupy this front-row spot or serve under the selected rules. Choose a legal back-row spot.", "Il Libero non può occupare questa posizione di prima linea né battere con le regole selezionate. Scegli una posizione consentita in seconda linea.") : copy("The Libero replaces this middle between rallies; follow the six players from the sideline.", "Il Libero sostituisce questo centrale tra gli scambi; segui i sei giocatori da fuori campo.")}</p>`;
  }
  $("checklist-grid").innerHTML = sequence.map((phase, index) => {
    const points = rallyPositions(team, sequence, index);
    const instruction = phaseInstruction(phase);
    const locationText = selected ? courtArea(points[selected]) : copy("On the sideline for this rotation", "Fuori campo in questa rotazione");
    const rowText = frontRow() ? copy("front-row player", "giocatore di prima linea") : copy("back-row player", "giocatore di seconda linea");
    const markers = Object.entries(points).map(([id, point]) =>
      `<span class="check-player ${id === selected ? "is-selected" : ""}" style="left:${point.x}%;top:${point.y}%" title="${playerName(id)}">${markerLabel(id)}</span>`).join("");
    return `<article class="check-card ${state.step === index ? "is-current" : ""}" id="check-phase-${index}" aria-labelledby="check-title-${index}">
      <div class="check-card-heading"><span>0${index + 1} · ${ownerLabel(phase) || copy("Before play", "Prima dello scambio")}</span><h4 id="check-title-${index}">${phaseTitle(phase)}</h4></div>
      <div class="check-court" role="img" aria-label="${copy("Our team. Your position", "La nostra squadra. La tua posizione")}: ${locationText}"><div class="check-court-surface"><span class="check-net">${copy("NET", "RETE")}</span><span class="check-attack-line"></span>${markers}</div><span class="check-baseline">${copy("BASELINE", "LINEA DI FONDO")}</span></div>
      <dl class="check-facts"><div><dt>${copy("Your place", "Dove sei")}</dt><dd>${locationText}${selected ? ` · ${rowText}` : ""}</dd></div><div><dt>${copy("Your job", "Il tuo compito")}</dt><dd>${instruction.body}</dd></div><div><dt>${copy("Watch the team", "Guarda gli altri")}</dt><dd>${teammatesAtPhase(phase, team, sequence, index)}</dd></div></dl>
      <button type="button" class="check-open-animation" data-open-step="${index}">${copy("Watch this moment move", "Guarda questo momento animato")} <span aria-hidden="true">↗</span></button>
    </article>`;
  }).join("");
  $("checklist-source").textContent = state.lineup === "open-smart-special"
    ? copy("When our team receives, serve-reception positions follow the coach's transcribed 2015 diagrams. Attack, defense and timing are illustrative adaptations; the original PDF is not in this repository.", "Quando riceviamo noi, le posizioni di ricezione seguono la trascrizione degli schemi del coach del 2015. Attacco, difesa e tempi sono adattamenti illustrativi; il PDF originale non è in questo repository.")
    : copy("Positions come from checked scheme data. Attack, defense and timing are illustrative adaptations of the published example.", "Le posizioni provengono dagli schemi verificati. Attacco, difesa e tempi sono adattamenti illustrativi dell'esempio pubblicato.");
}

function renderPrintPages() {
  if (!schemeDatabase) return;
  document.documentElement.classList.add("printing-cards");
  const layout = Number($("print-layout").value) === 2 ? 2 : 4;
  const perPage = 8 / layout;
  const cards = [...$("checklist-grid").querySelectorAll(".check-card")];
  const relations = [...$("checklist-relationships").querySelectorAll(".relationship-grid div")]
    .map((item) => `${item.querySelector("span").textContent}: ${item.querySelector("strong").textContent}`);
  const reference = relations.length
    ? relations.join(" · ")
    : $("checklist-relationships").querySelector("p")?.textContent || "";
  const lineup = state.lineup === "open-smart-special" ? "Open smart special"
    : state.lineup === "libero" ? copy("5–1 with Libero", "5–1 con Libero")
      : copy("5–1 without Libero", "5–1 senza Libero");
  const context = `${lineup} · ${$("checklist-kicker").textContent} · ${$("rules-select").selectedOptions[0].textContent}`;
  const root = $("print-pages");
  root.replaceChildren();
  for (let pageIndex = 0; pageIndex < layout; pageIndex++) {
    const page = document.createElement("section");
    page.className = "print-page";
    page.dataset.layout = String(layout);
    const header = document.createElement("header");
    header.className = "print-header";
    const top = document.createElement("div");
    top.className = "print-topline";
    const brand = document.createElement("strong");
    brand.textContent = "sideout.";
    const number = document.createElement("span");
    number.textContent = `${copy("PERSONAL PHASE CARDS", "SCHEDE PERSONALI DELLE FASI")} · ${pageIndex + 1}/${layout}`;
    top.append(brand, number);
    const title = document.createElement("h1");
    title.textContent = $("checklist-title").textContent;
    const meta = document.createElement("p");
    meta.className = "print-meta";
    meta.textContent = context;
    const nearby = document.createElement("p");
    nearby.className = "print-nearby";
    nearby.textContent = reference;
    const timing = document.createElement("p");
    timing.className = "print-timing";
    timing.textContent = timingText();
    header.append(top, title, meta, nearby, timing);
    const grid = document.createElement("div");
    grid.className = "print-card-grid";
    for (const card of cards.slice(pageIndex * perPage, (pageIndex + 1) * perPage)) {
      const printed = card.cloneNode(true);
      printed.classList.remove("is-current");
      printed.removeAttribute("id");
      printed.removeAttribute("aria-labelledby");
      printed.querySelector("h4")?.removeAttribute("id");
      printed.querySelector("button")?.remove();
      grid.appendChild(printed);
    }
    const footer = document.createElement("footer");
    footer.className = "print-footer";
    footer.textContent = $("checklist-source").textContent;
    page.append(header, grid, footer);
    root.appendChild(page);
  }
}

function renderOptions() {
  $("role-options").innerHTML = visibleRoles().map((key) => [key, roleInfo(key)])
    .map(
      ([key, role]) =>
        `<button type="button" class="role-option ${state.role === key ? "active" : ""}" data-role="${key}" aria-pressed="${state.role === key}">${key === "outside" ? copy("Outside 1", "Banda 1") : key === "outside2" ? copy("Outside 2", "Banda 2") : key === "middle" ? copy("Middle 1", "Centrale 1") : key === "middle2" ? copy("Middle 2", "Centrale 2") : key === "opposite" ? copy("Opposite", "Opposto") : role.name}</button>`,
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
  $("lineup-help").textContent = state.lineup === "open-smart-special"
    ? copy("Coach's three-player receive: two outsides and the back-row middle. No Libero; the opposite covers only very short serves.", "Ricezione a tre del coach: due bande e il centrale dietro. Senza Libero; l'Opposto copre solo le battute cortissime.")
    : state.lineup === "libero"
      ? copy("Libero replaces the back-row middle between rallies.", "Il Libero sostituisce il centrale di seconda linea tra gli scambi.")
      : copy("Both middles stay on court, including in the back row.", "Entrambi i centrali restano in campo, anche in seconda linea.");
  $("lineup-options").setAttribute("aria-label", copy("Choose a team plan", "Scegli lo schema di squadra"));
  $("player-selection-summary").textContent = `${roleInfo(state.role).name} · ${copy("position", "posizione")} ${state.position}`;
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
      ? copy("They receive and attack first; we defend and counterattack.", "Loro ricevono e attaccano per primi; noi difendiamo e contrattacchiamo.")
      : copy("We receive and attack first; they defend and counterattack.", "Noi riceviamo e attacchiamo per primi; loro difendono e contrattaccano.");
  $("rules-help").textContent = timingText();
}

function renderCourt() {
  const team = activeLineup();
  const selected = team.selected;
  const opponent = opponentLineup();
  $("opponent-court").hidden = !state.opponents;
  document.querySelector(".opponent-strip").hidden = state.opponents;
  document.querySelector(".court-stage").classList.toggle("two-sides", state.opponents);
  $("opponent-toggle").setAttribute("aria-pressed", String(state.opponents));
  $("opponent-toggle").textContent = state.opponents
    ? copy("Hide the other team", "Nascondi gli avversari")
    : copy("Show the other team", "Mostra anche gli avversari");
  $("opponent-note").hidden = !state.opponents;
  $("opponent-note").textContent = copy(
    "A1–A6 mark their rotation spots in an illustrative 5–1 lineup, not their real roster.",
    "A1–A6 indicano le loro posizioni di rotazione in un 5–1 illustrativo, non la formazione reale.",
  );
  $("opponent-players").innerHTML = Object.entries(opponent.bySlot)
    .map(([slot, id]) => `<div class="team-player opponent-player" data-player="${id}" aria-label="${copy("Other team", "Avversari")}: ${playerName(id)}, ${copy("position", "posizione")} ${slot}" title="${copy("Other team", "Avversari")}: ${playerName(id)}">A${slot}</div>`)
    .join("");
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
  $("player-key").innerHTML = ["S", "OH1", "OH2", "MB1", "MB2", "OP", "L"]
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
  const rawFraction = playhead - fromIndex;
  const fraction = reducedMotion.matches ? 0 : rawFraction;
  const travel = fraction * fraction * (3 - 2 * fraction);
  const from = rallyPositions(team, sequence, fromIndex);
  const to = rallyPositions(team, sequence, toIndex);
  const place = (element, point) => {
    element.style.left = `${point.x}%`;
    element.style.top = `${point.y}%`;
  };
  const interpolate = (a, b, progress = travel) => ({
    x: a.x + (b.x - a.x) * progress,
    y: a.y + (b.y - a.y) * progress,
  });
  const frontProgress = fromIndex === 2
    ? Math.min(1, travel * 2) : travel;
  const ourFront = new Set(["4", "3", "2"].map((slot) => team.bySlot[slot]));
  document.querySelectorAll("#team-players [data-player]").forEach((marker) => {
    const id = marker.dataset.player;
    const approach = state.serve === "theirs" && ourFront.has(id) && id !== "S";
    place(marker, interpolate(from[id], to[id], approach ? frontProgress : travel));
  });
  if (state.opponents) {
    const opponent = opponentLineup();
    const opponentFrom = rallyPositions(opponent, sequence, fromIndex, true);
    const opponentTo = rallyPositions(opponent, sequence, toIndex, true);
    const opponentFront = new Set(["4", "3", "2"].map((slot) => opponent.bySlot[slot]));
    document.querySelectorAll("#opponent-players [data-player]").forEach((marker) => {
      const id = marker.dataset.player;
      const approach = state.serve === "ours" && opponentFront.has(id) && id !== "S";
      const point = interpolate(opponentFrom[id], opponentTo[id], approach ? frontProgress : travel);
      place(marker, { x: 100 - point.x, y: 100 - point.y });
    });
  }
  const selected = team.selected;
  if (selected) {
    const approach = state.serve === "theirs" && ourFront.has(selected) && selected !== "S";
    place($("target-token"), interpolate(from[selected], to[selected], approach ? frontProgress : travel));
  }
  const pathIndex = travel > 0 ? toIndex : fromIndex;
  const previous = rallyPositions(team, sequence, Math.max(0, pathIndex - 1));
  const destination = rallyPositions(team, sequence, pathIndex);
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
    rotation: null, serve: { x: 82, y: 105 },
    receive: { x: 45, y: 67 }, "receive-set": { x: 75, y: 22 },
    "receive-attack": { x: 37, y: 10 }, "transition-dig": { x: 48, y: 68 },
    "transition-set": { x: 75, y: 22 }, counterattack: { x: 37, y: 10 },
  };
  const stage = document.querySelector(".court-stage").getBoundingClientRect();
  const ourCourt = $("court");
  const opposingArea = state.opponents
    ? $("opponent-court") : document.querySelector(".opponent-strip");
  const ballPoint = (index) => {
    const phase = sequence[index];
    const ours = (phase.owner === "none" ? state.serve : phase.owner) === "ours";
    const touch = rallyTouch(ours ? team : opponentLineup(), sequence, index, !ours);
    const local = touch || ballByEvent[phase.key] || ballByEvent.serve;
    const area = ours ? ourCourt : opposingArea;
    const rect = area.getBoundingClientRect();
    const contactLift = touch && index > 1 && (ours || state.opponents)
      ? -ballContactLiftPx : 0;
    const boxLeft = rect.left - stage.left + (touch ? area.clientLeft : 0);
    const boxTop = rect.top - stage.top + (touch ? area.clientTop : 0);
    const boxWidth = touch ? area.clientWidth : rect.width;
    const boxHeight = touch ? area.clientHeight : rect.height;
    return {
      // The same inner court box positions the ball and player markers.
      x: boxLeft + (ours ? local.x : 100 - local.x) * boxWidth / 100,
      y: boxTop + (ours ? local.y * boxHeight / 100
        : state.opponents ? Math.max(0, 100 - local.y) * boxHeight / 100
          : boxHeight / 2)
        + contactLift,
    };
  };
  $("rally-ball").hidden = fromIndex === 0 && travel === 0;
  const ballFrom = ballPoint(fromIndex);
  const ballTo = ballPoint(toIndex);
  const passToSetter = toIndex === 3 || toIndex === 6;
  if (passToSetter && sequence[toIndex].owner === "ours") {
    const depth = ourCourt.clientHeight;
    // The ball leaves the passer in their lane, then approaches the setter
    // from above. It avoids an apparent early touch on the moving player.
    const control1 = { x: ballFrom.x, y: ballFrom.y + depth * 0.38 };
    const control2 = { x: ballFrom.x, y: ballTo.y - depth * 0.33 };
    const remaining = 1 - travel;
    const cubic = (axis) => remaining ** 3 * ballFrom[axis]
      + 3 * remaining ** 2 * travel * control1[axis]
      + 3 * remaining * travel ** 2 * control2[axis]
      + travel ** 3 * ballTo[axis];
    $("rally-ball").style.left = `${cubic("x")}px`;
    $("rally-ball").style.top = `${cubic("y")}px`;
  } else {
    const arc = reducedMotion.matches ? 0 : Math.sin(Math.PI * travel) *
      Math.min(54, Math.hypot(ballTo.x - ballFrom.x, ballTo.y - ballFrom.y) * 0.11);
    $("rally-ball").style.left = `${ballFrom.x + (ballTo.x - ballFrom.x) * travel}px`;
    $("rally-ball").style.top = `${ballFrom.y + (ballTo.y - ballFrom.y) * travel
      + (passToSetter ? arc : -arc)}px`;
  }
  $("rally-scrub").value = String(Math.round(playhead * 100));
  $("rally-scrub").setAttribute("aria-valuetext", `${ownerLabel(sequence[fromIndex]) ? `${ownerLabel(sequence[fromIndex])} · ` : ""}${phaseTitle(sequence[fromIndex])}`);
}

function renderTimeline() {
  const sequence = phases();
  $("rally-preview-note").textContent = copy(
    "The ball and all players move together between touches in every lineup.",
    "Palla e giocatori si muovono insieme tra un tocco e l'altro in tutti gli schemi.",
  );
  $("timeline").innerHTML = sequence
    .map(
      (phase, step) =>
        `<button type="button" class="${state.step === step ? "active" : ""}" data-step="${step}" aria-pressed="${state.step === step}"><span class="step-num">0${step + 1}${step === 1 || step >= 5 ? " · K2" : step >= 2 ? " · K1" : ""}</span><span class="step-title">${ownerLabel(phase) ? `${ownerLabel(phase)} · ` : ""}${phaseTitle(phase)}</span></button>`,
    )
    .join("");
  $("rally-cycle-note").textContent = copy(
    "K1 (sideout): serve reception → set → attack. K2 (break point): serve, defend the attack → set → counterattack. If the ball returns, continue the transition cycle.",
    "K1 (cambio palla): ricezione della battuta → alzata → attacco. K2 (fase break point): battuta, difesa dell’attacco → alzata → contrattacco. Se la palla torna, la transizione continua.",
  );
  const phase = sequence[state.step];
  const instruction = phaseInstruction(phase);
  const firstTouch = phase.key === "receive"
    ? copy("Serve reception is the first touch after a serve.", "La ricezione è il primo tocco dopo la battuta.")
    : phase.key === "transition-dig"
      ? copy("Defense is the first touch after an attack, not after a serve.", "La difesa è il primo tocco dopo un attacco, non dopo una battuta.")
      : "";
  const provenance = state.step >= 3
    ? state.lineup === "open-smart-special"
      ? copy("Attack and defense paths are illustrative adaptations; the coach's 2015 diagrams document reception only.", "I percorsi di attacco e difesa sono adattamenti illustrativi; gli schemi del coach del 2015 documentano solo la ricezione.")
      : copy("Attack and defense positions adapt the published example; travel paths and the ball are illustrative.", "Le posizioni di attacco e difesa adattano l'esempio pubblicato; i percorsi intermedi e la palla sono illustrativi.")
    : copy("Player identities and service positions come from checked scheme data.", "Identità dei giocatori e posizioni alla battuta provengono dagli schemi verificati.");
  $("rally-event").textContent = `${firstTouch ? `${firstTouch} ` : ""}${provenance}`;
  $("instruction-kicker").textContent =
    `${state.lang === "it" ? "PASSO" : "STEP"} 0${state.step + 1} · ${roleInfo(state.role).name.toUpperCase()}`;
  $("instruction-title").textContent = `${ownerLabel(phase) ? `${ownerLabel(phase)} · ` : ""}${phaseTitle(phase)}`;
  $("instruction-body").textContent = instruction.body;
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
  renderTabs();
  renderOptions();
  renderCourt();
  renderTimeline();
  renderCards();
  $("print-cards").disabled = false;
  renderRoles();
  renderTeam();
  const url = new URL(location.href);
  url.searchParams.delete("team");
  Object.entries(state).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  history.replaceState(null, "", url);
}

function renderTabs() {
  for (const view of ["animation", "cards"]) {
    const selected = state.view === view;
    const tab = $(`${view}-tab`);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    $(`${view}-panel`).hidden = !selected;
  }
  document.querySelector(".playbook-tabs").setAttribute("aria-label", copy("Playbook views", "Viste della guida"));
}

function chooseView(view, focus = false) {
  if (!["animation", "cards"].includes(view)) return;
  pauseRally();
  state.view = view;
  render();
  if (view === "animation") renderPlayhead();
  if (focus) $(`${view}-tab`).focus();
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
    let remaining = Math.min(time - lastFrameTime, 120) * speed;
    while (remaining > 0 && playhead < phases().length - 1) {
      const segment = Math.floor(playhead);
      const duration = teachingLegMs[segment];
      const available = (segment + 1 - playhead) * duration;
      const used = Math.min(remaining, available);
      playhead = used >= available - 0.000001
        ? segment + 1 : playhead + used / duration;
      remaining -= used;
    }
    const activeStep = Math.min(phases().length - 1, Math.floor(playhead));
    if (activeStep !== state.step) {
      state.step = activeStep;
      render();
      const panel = document.querySelector(".controls-panel");
      const active = $("timeline").querySelector(".active");
      if (window.innerWidth > 780 && active) {
        const panelBox = panel.getBoundingClientRect();
        const activeBox = active.getBoundingClientRect();
        if (activeBox.bottom > panelBox.bottom - 16)
          panel.scrollTop += activeBox.bottom - panelBox.bottom + 16;
      }
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
  if (state.view === "cards") chooseView("animation");
  if (playhead >= phases().length - 1) seekRally(0);
  playing = true;
  renderTimeline();
  animationFrame = requestAnimationFrame(tickRally);
});
$("print-cards").addEventListener("click", () => {
  pauseRally();
  renderPrintPages();
  window.print();
});
window.addEventListener("beforeprint", () => {
  if (state.view === "cards") renderPrintPages();
  else document.documentElement.classList.remove("printing-cards");
});
window.addEventListener("afterprint", () => document.documentElement.classList.remove("printing-cards"));
$("rally-back").addEventListener("click", () => seekRally(state.step - 1));
$("rally-next").addEventListener("click", () => seekRally(state.step + 1));
$("rally-scrub").addEventListener("input", (event) => seekRally(Number(event.target.value) / 100));
reducedMotion.addEventListener("change", () => { pauseRally(); renderPlayhead(); });

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.view) {
    chooseView(button.dataset.view);
    return;
  }
  if (button.dataset.openStep) {
    pauseRally();
    state.step = Number(button.dataset.openStep);
    playhead = state.step;
    state.view = "animation";
    render();
    $("animation-panel").focus();
    return;
  }
  if (button.dataset.role) {
    pauseRally();
    state.role = button.dataset.role;
    render();
  }
  if (button.dataset.lineup) {
    pauseRally();
    state.lineup = button.dataset.lineup;
    if (state.lineup !== "libero" && state.role === "libero") state.role = "middle";
    render();
  }
  if (button.dataset.lang) {
    pauseRally();
    state.lang = button.dataset.lang;
    render();
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

document.querySelector(".playbook-tabs").addEventListener("keydown", (event) => {
  const tabs = ["animation", "cards"];
  const current = tabs.indexOf(state.view);
  const target = event.key === "ArrowRight" ? tabs[(current + 1) % tabs.length]
    : event.key === "ArrowLeft" ? tabs[(current + tabs.length - 1) % tabs.length]
      : event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[tabs.length - 1] : null;
  if (!target) return;
  event.preventDefault();
  chooseView(target, true);
});

$("opponent-toggle").addEventListener("click", () => {
  state.opponents = !state.opponents;
  render();
});

$("jump-to-rally").addEventListener("click", () => {
  const group = document.querySelector(".rally-group");
  if (window.innerWidth > 780) {
    const panel = document.querySelector(".controls-panel");
    panel.scrollTop += group.getBoundingClientRect().top - panel.getBoundingClientRect().top - 16;
  } else {
    group.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
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
    $("share-status").textContent = copy("Link copied to clipboard.", "Link copiato negli appunti.");
  } catch {
    button.textContent = copy("Copy URL from address bar", "Copia l'indirizzo dalla barra del browser");
    $("share-status").textContent = copy("Copy the URL from the browser address bar.", "Copia l'indirizzo dalla barra del browser.");
  }
  setTimeout(() => {
    button.innerHTML = `${copy("Share this view", "Condividi questa vista")} <span aria-hidden="true">↗</span>`;
    $("share-status").textContent = "";
  }, 2400);
});

const mobileNavigation = window.matchMedia("(max-width: 780px)");
$("player-navigation").open = true;
mobileNavigation.addEventListener("change", (event) => {
  if (!event.matches) $("player-navigation").open = true;
});

fetch("./data/schemes.json?v=5")
  .then((response) => {
    if (!response.ok) throw new Error(`Court database returned ${response.status}`);
    return response.json();
  })
  .then((database) => {
    if (database.schemaVersion !== 5) throw new Error("Unsupported court database version");
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
