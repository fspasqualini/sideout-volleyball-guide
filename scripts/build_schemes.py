#!/usr/bin/env python3
"""Build the static court database from the pinned, licensed reference scheme.

Only the bounded 5–1 / three-receiver pattern described in data/README.md is
generated. A tactical formation is a coaching choice, so this is a catalog of
verified examples rather than a claim to enumerate every legal arrangement.
"""

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "references/rotazionivolley/ricezione-a-3.json"
OUTPUT = ROOT / "data/schemes.json"
COACH = ROOT / "references/coach-open-smart-special/receive.json"
SOURCE_SHA256 = "9fec10d49f723d5036feaa5ea78a7288d04409d759cf05c601c57d0585d0b5c2"
COACH_TRANSCRIPTION_SHA256 = "dca8b85a36f74d916f9dc8341aed25ce5d16f094e9670b5ff5a1cc4c00cf9b08"
SOURCE_REVISION = "ecd4455d2b9972fc56caa31323f8eb42855bf66f"

SOURCE_TO_APP = {
    "P": "S", "O": "OP", "S1": "OH1", "S2": "OH2",
    "C2": "MB1", "C1": "MB2", "L1": "L",
}
APP_TO_SOURCE = {value: key for key, value in SOURCE_TO_APP.items()}
COACH_TO_APP = {**SOURCE_TO_APP, "C1": "MB1", "C2": "MB2"}
APP_TO_COACH = {value: key for key, value in COACH_TO_APP.items()}
ROTATION_ORDER = [1, 6, 5, 4, 3, 2]
NEXT_POSITION = {1: 6, 6: 5, 5: 4, 4: 3, 3: 2, 2: 1}
COURT_SPOTS = {
    4: {"x": 18, "y": 20}, 3: {"x": 50, "y": 20},
    2: {"x": 82, "y": 20}, 5: {"x": 18, "y": 75},
    6: {"x": 50, "y": 75}, 1: {"x": 82, "y": 75},
}
COACH_PLAY_ZONES = {
    **{str(zone): point for zone, point in COURT_SPOTS.items()},
    "2-3": {"x": 68, "y": 20},
}
PHASES = {
    "ours": {
        "fivb": ["base", "switchServe", "switchServe", "receiveHit", "switchReceive"],
        "trial": ["base", "switchServe", "switchServe", "receiveHit", "switchReceive"],
        "usav": ["base", "serveServe", "switchServe", "receiveHit", "switchReceive"],
    },
    "theirs": {
        "fivb": ["base", "receiveReceive", "receiveSet", "receiveHit", "switchReceive"],
        "trial": ["base", "receiveReceive", "receiveSet", "receiveHit", "switchReceive"],
        "usav": ["base", "receiveReceive", "receiveSet", "receiveHit", "switchReceive"],
    },
}
RALLY_PHASES = {
    "ours": [
        {"key": "rotation", "owner": "none", "view": 0, "opponentView": 0},
        {"key": "serve", "owner": "ours", "view": 1, "opponentView": 1},
        {"key": "receive", "owner": "theirs", "view": 2, "opponentView": 2,
         "opponentMix": [1, 2, 0.22]},
        {"key": "receive-set", "owner": "theirs", "view": 2, "opponentView": 2},
        {"key": "receive-attack", "owner": "theirs", "view": 2, "opponentView": 3},
        {"key": "transition-dig", "owner": "ours", "view": 2, "mix": [2, 3, 0.12],
         "opponentView": 4},
        {"key": "transition-set", "owner": "ours", "view": 3, "mix": [2, 3, 0.72],
         "opponentView": 4},
        {"key": "counterattack", "owner": "ours", "view": 3, "opponentView": 4},
    ],
    "theirs": [
        {"key": "rotation", "owner": "none", "view": 0, "opponentView": 0},
        {"key": "serve", "owner": "theirs", "view": 1, "opponentView": 1},
        {"key": "receive", "owner": "ours", "view": 2, "mix": [1, 2, 0.22],
         "opponentView": 2},
        {"key": "receive-set", "owner": "ours", "view": 2, "opponentView": 2},
        {"key": "receive-attack", "owner": "ours", "view": 3, "opponentView": 2},
        {"key": "transition-dig", "owner": "theirs", "view": 4, "opponentView": 2},
        {"key": "transition-set", "owner": "theirs", "view": 4, "opponentView": 3,
         "opponentMix": [2, 3, 0.72]},
        {"key": "counterattack", "owner": "theirs", "view": 4, "opponentView": 3},
    ],
}


def source_slots(points):
    """Read numbered slots from the independent base diagram by row and x order."""
    front = sorted((point["x"], player) for player, point in points.items() if point["y"] < 200)
    back = sorted((point["x"], player) for player, point in points.items() if point["y"] >= 200)
    if len(front) != 3 or len(back) != 3:
        raise ValueError("Reference base must show three front and three back players")
    return dict(zip((4, 3, 2, 5, 6, 1), [player for _, player in front + back]))


def active_slots(reference, rotation, serve, rules, variant, base_slots):
    slots = dict(base_slots)
    if variant == "libero":
        side = "serve" if serve == "ours" else "receive"
        swap = reference.get("liberoSwaps", {}).get(str(rotation), {}).get(side)
        # The USAV example uses the permitted single libero service rotation
        # for Middle 1 (source C2). The pinned example does not include it.
        if side == "serve" and rules == "usav" and slots[1] == "C2":
            swap = {"libero": "L1", "replaces": "C2"}
        if swap:
            replaced = swap["replaces"]
            matches = [slot for slot, player in slots.items() if player == replaced]
            if len(matches) != 1 or matches[0] not in (1, 5, 6):
                raise ValueError(f"Invalid libero replacement in rotation {rotation}: {swap}")
            slots[matches[0]] = swap["libero"]
    return {str(slot): SOURCE_TO_APP[player] for slot, player in slots.items()}


def normalized(point):
    # Source court rectangle: x=75..525, y=-15..520. Our court uses percent.
    return {"x": round((point["x"] - 75) / 450 * 100, 2),
            "y": round((point["y"] + 15) / 535 * 100, 2)}


def source_point(reference, phase, rotation, player, slots):
    source_points = reference["positions"][phase][str(rotation)]
    source_player = APP_TO_SOURCE[player]
    if source_player == "L1" and source_player not in source_points:
        # The reference stores explicit Libero points only for some phases.
        # Its viewer uses the replaced middle's point otherwise.
        missing_middle = next(
            middle for middle in ("MB1", "MB2") if middle not in slots.values()
        )
        source_player = APP_TO_SOURCE[missing_middle]
    return source_points[source_player]


def layout(reference, rotation, serve, phase, slots):
    if phase == "base":
        positions = {player: dict(COURT_SPOTS[int(slot)]) for slot, player in slots.items()}
    else:
        positions = {}
        for player in slots.values():
            positions[player] = normalized(source_point(reference, phase, rotation, player, slots))
    if serve == "ours" and phase in ("base", "serveServe", "switchServe"):
        # The server is behind the end line until the ball is contacted.
        # switchServe also appears after contact (step 2), so the caller
        # restores the referenced defensive point for that step below.
        positions[slots["1"]] = {"x": 82, "y": 109}
    return positions


def coach_layout(reference, coach, rotation, serve, phase, slots):
    if phase == "base":
        positions = {player: dict(COURT_SPOTS[int(slot)]) for slot, player in slots.items()}
    elif serve == "theirs" and phase in ("receiveReceive", "receiveSet"):
        positions = {player: dict(zip(("x", "y"), point)) for player, point in
                     coach["receiveAtContact"][str(rotation)].items()}
    else:
        source_points = reference["positions"][phase][str(rotation)]
        positions = {player: normalized(source_points[APP_TO_COACH[player]])
                     for player in slots.values()}
    if serve == "ours" and phase in ("base", "serveServe", "switchServe"):
        positions[slots["1"]] = {"x": 82, "y": 109}
    return positions


def build_database(reference, coach):
    expected_first = {1: "P", 2: "S1", 3: "C2", 4: "O", 5: "S2", 6: "C1"}
    base = {}
    for rotation in ROTATION_ORDER:
        slots = source_slots(reference["positions"]["base"][str(rotation)])
        if rotation == 1 and slots != expected_first:
            raise ValueError(f"Reference R1 changed: {slots}")
        base[str(rotation)] = {str(slot): SOURCE_TO_APP[player] for slot, player in slots.items()}
    coach_base = {
        str(rotation): {str(slot): COACH_TO_APP[player] for slot, player in
                        source_slots(reference["positions"]["base"][str(rotation)]).items()}
        for rotation in ROTATION_ORDER
    }

    scenarios = {}
    for variant in ("libero", "no-libero"):
        scenarios[variant] = {}
        for serve in ("ours", "theirs"):
            scenarios[variant][serve] = {}
            for rules, phases in PHASES[serve].items():
                scenarios[variant][serve][rules] = {}
                for rotation in ROTATION_ORDER:
                    source_base = source_slots(reference["positions"]["base"][str(rotation)])
                    slots = active_slots(reference, rotation, serve, rules, variant, source_base)
                    steps = []
                    for index, phase in enumerate(phases):
                        positions = layout(reference, rotation, serve, phase, slots)
                        if serve == "ours" and index >= 2:
                            server = slots["1"]
                            positions[server] = normalized(source_point(reference, phase, rotation, server, slots))
                        steps.append({"phase": phase, "positions": positions})
                    scenarios[variant][serve][rules][str(rotation)] = {"bySlot": slots, "steps": steps}

    scenarios["open-smart-special"] = {}
    for serve in ("ours", "theirs"):
        scenarios["open-smart-special"][serve] = {}
        for rules, phases in PHASES[serve].items():
            scenarios["open-smart-special"][serve][rules] = {}
            for rotation in ROTATION_ORDER:
                slots = coach_base[str(rotation)]
                steps = []
                for index, phase in enumerate(phases):
                    positions = coach_layout(reference, coach, rotation, serve, phase, slots)
                    if serve == "ours" and index >= 2:
                        server = slots["1"]
                        positions[server] = normalized(
                            reference["positions"][phase][str(rotation)][APP_TO_COACH[server]])
                    steps.append({"phase": phase, "positions": positions})
                scenarios["open-smart-special"][serve][rules][str(rotation)] = {
                    "bySlot": slots, "steps": steps,
                }

    coach_first_set = {}
    for rotation in ROTATION_ORDER:
        key = str(rotation)
        zones = coach["firstSetZones"][key]
        positions = {player: dict(COACH_PLAY_ZONES[zone]) for player, zone in zones.items()}
        # The setter's temporary setting destination matches the existing
        # checked full-rally anchor. Defensive zone 1 is a later moment.
        positions["S"] = dict(scenarios["open-smart-special"]["theirs"]["trial"][key]["steps"][3]["positions"]["S"])
        coach_first_set[key] = {"zones": zones, "positions": positions}

    return {
        "schemaVersion": 5,
        "scope": "5-1 / three receivers, including a separate coach-supplied Open smart special",
        "reference": {
            "name": "rotazionivolley: ricezione-a-3",
            "url": "https://rotazioni.volleyserve.it/",
            "source": "https://github.com/napo/rotazionivolley/blob/" + SOURCE_REVISION + "/web/src/configs/ricezione-a-3.json",
            "revision": SOURCE_REVISION,
            "sha256": SOURCE_SHA256,
            "license": "Apache-2.0",
        },
        "rotations": base,
        "coachRotations": coach_base,
        "coachPassers": coach["passers"],
        "coachFirstSet": coach_first_set,
        "coachReference": {
            "title": coach["title"], "date": coach["date"],
            "sourcePdfSha256": coach["sourcePdfSha256"],
            "transcription": "references/coach-open-smart-special/receive.json",
            "firstSetNote": coach["firstSetNote"],
        },
        "rotationOrder": ROTATION_ORDER,
        "nextPosition": NEXT_POSITION,
        "phasesByView": PHASES,
        "rallyPhases": RALLY_PHASES,
        "scenarios": scenarios,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if the committed database is stale")
    args = parser.parse_args()
    raw = SOURCE.read_bytes()
    actual_sha = hashlib.sha256(raw).hexdigest()
    if actual_sha != SOURCE_SHA256:
        raise SystemExit(f"Reference digest changed: {actual_sha}")
    coach_raw = COACH.read_bytes()
    coach_sha = hashlib.sha256(coach_raw).hexdigest()
    if coach_sha != COACH_TRANSCRIPTION_SHA256:
        raise SystemExit(f"Coach transcription digest changed: {coach_sha}")
    result = build_database(json.loads(raw), json.loads(coach_raw))
    expected = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text() != expected:
            raise SystemExit("data/schemes.json differs from the pinned reference; rebuild and review it")
        print("Database matches pinned reference and generation rules")
    else:
        OUTPUT.write_text(expected)
        print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
