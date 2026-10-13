#!/usr/bin/env python3
"""Deterministic checks for the committed 5–1 and coach court database."""

import argparse
import hashlib
import json
import math
import subprocess
import sys
from pathlib import Path

from build_schemes import COURT_SPOTS, NEXT_POSITION, ROTATION_ORDER, ROOT, source_slots


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def position_of(slots, player):
    return next(int(slot) for slot, occupant in slots.items() if occupant == player)


def check_overlap(slots, points, server=None):
    # Rule 7.4 relationships apply to the receiving team at service hit. In
    # USAV, we also show a conservative legal serving stack. The server is
    # outside the court and is omitted from comparisons.
    for row in ((4, 3, 2), (5, 6, 1)):
        in_court = [slot for slot in row if slot != server]
        for left, right in zip(in_court, in_court[1:]):
            require(points[slots[str(left)]]["x"] < points[slots[str(right)]]["x"],
                    f"overlap left/right: {left}, {right}")
    for front, back in ((4, 5), (3, 6), (2, 1)):
        if back == server:
            continue
        require(points[slots[str(front)]]["y"] < points[slots[str(back)]]["y"],
                f"overlap front/back: {front}, {back}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--coach-pdf", type=Path, help="verify the original coach PDF digest locally")
    args = parser.parse_args()
    subprocess.run([sys.executable, str(ROOT / "scripts/build_schemes.py"), "--check"], check=True)
    data = json.loads((ROOT / "data/schemes.json").read_text())
    source = json.loads((ROOT / "references/rotazionivolley/ricezione-a-3.json").read_text())
    coach = json.loads((ROOT / "references/coach-open-smart-special/receive.json").read_text())
    require(coach["sourcePdfSha256"] == "40c49f169f65788ee71e43dc7dfb2eacb422900243e864b985adf25bacfc7bf9",
            "coach reference PDF digest changed")
    if args.coach_pdf:
        require(hashlib.sha256(args.coach_pdf.read_bytes()).hexdigest() == coach["sourcePdfSha256"],
                "local coach PDF differs from transcribed source")
    require(data["schemaVersion"] == 1, "unsupported database schema")
    require(data["rotationOrder"] == ROTATION_ORDER, "rotation sequence differs from FIVB 7.6")
    require(data["nextPosition"] == {str(k): v for k, v in NEXT_POSITION.items()},
            "sideout rotation differs from FIVB 7.6")
    require(set(data["scenarios"]) == {"libero", "no-libero", "libero-ds", "no-libero-ds", "open-smart-special"},
            "missing lineup variant")

    initial = data["rotations"]["1"]
    require(initial == {"1": "S", "2": "OH1", "3": "MB1", "4": "OP", "5": "OH2", "6": "MB2"},
            "R1 starting roles differ from the published reference")
    for index, rotation in enumerate(ROTATION_ORDER):
        slots = data["rotations"][str(rotation)]
        expected = {str(next_rotation(int(slot), index)): player for slot, player in initial.items()}
        require(slots == expected, f"P{rotation} did not rotate the original six together")
        source_zone_order = source_slots(source["positions"]["base"][str(rotation)])
        mapped = {str(slot): {"P": "S", "O": "OP", "S1": "OH1", "S2": "OH2",
                              "C2": "MB1", "C1": "MB2"}[player]
                  for slot, player in source_zone_order.items()}
        require(slots == mapped, f"P{rotation} differs from pinned reference base")
        setter = position_of(slots, "S")
        opposite = position_of(slots, "OP")
        require(next_rotation(setter, 3) == opposite,
                f"P{rotation}: opposite must remain three rotation slots from setter")

    coach_initial = {"1": "S", "2": "OH1", "3": "MB2", "4": "OP", "5": "OH2", "6": "MB1"}
    require(data["coachRotations"]["1"] == coach_initial, "coach P1 differs from the PDF")
    for index, rotation in enumerate(ROTATION_ORDER):
        slots = data["coachRotations"][str(rotation)]
        expected = {str(next_rotation(int(slot), index)): player for slot, player in coach_initial.items()}
        require(slots == expected, f"coach P{rotation} fails the six-player rotation")
        passers = data["coachPassers"][str(rotation)]
        require(passers == coach["passers"][str(rotation)], f"coach P{rotation} passer list changed")
        require(set(passers) == {"OH1", "OH2", next(player for player in ("MB1", "MB2")
                                                      if player in (slots["5"], slots["6"], slots["1"]))},
                f"coach P{rotation} must use both outsides and the back-row middle")

    scenarios_checked = 0
    steps_checked = 0
    for variant, by_serve in data["scenarios"].items():
        for serve, by_rules in by_serve.items():
            require(serve in ("ours", "theirs"), f"unexpected serve side {serve}")
            require(set(by_rules) == {"fivb", "usav", "trial"}, f"missing rule set for {variant}/{serve}")
            for rules, by_rotation in by_rules.items():
                require(set(by_rotation) == {str(n) for n in ROTATION_ORDER},
                        f"missing rotation for {variant}/{serve}/{rules}")
                for rotation, scenario in by_rotation.items():
                    label = f"{variant}/{serve}/{rules}/P{rotation}"
                    slots = scenario["bySlot"]
                    occupants = list(slots.values())
                    require(set(slots) == {str(n) for n in range(1, 7)}, label + ": missing slot")
                    require(len(set(occupants)) == 6, label + ": duplicate player")
                    require(position_of(slots, "S") == int(rotation), label + ": setter moved to wrong slot")
                    require(next_rotation(int(rotation), 3) == position_of(slots, "OP"),
                            label + ": opposite moved out of rotational order")
                    require(("DS" in occupants) == variant.endswith("-ds"), label + ": DS mismatch")
                    require(("OH2" in occupants) != variant.endswith("-ds"), label + ": outside 2 mismatch")
                    if variant.startswith("no-") or variant == "open-smart-special":
                        require("L" not in occupants, label + ": Libero in no-Libero lineup")
                        require({"MB1", "MB2"} <= set(occupants), label + ": both middles must remain")
                    elif "L" in occupants:
                        libero_spot = position_of(slots, "L")
                        require(libero_spot in (1, 5, 6), label + ": Libero in front row")
                        require(len({"MB1", "MB2"} & set(occupants)) == 1,
                                label + ": Libero must replace one middle")
                        require(not (serve == "ours" and rules in ("fivb", "trial") and libero_spot == 1),
                                label + ": FIVB Libero cannot serve")
                    phases = data["phasesByView"][serve][rules]
                    require(len(scenario["steps"]) == len(phases) == 5, label + ": missing game moment")
                    for step, (snapshot, phase) in enumerate(zip(scenario["steps"], phases)):
                        stage = f"{label}/step{step}"
                        require(snapshot["phase"] == phase, stage + ": phase mismatch")
                        points = snapshot["positions"]
                        require(set(points) == set(occupants), stage + ": marker set does not match lineup")
                        for player, point in points.items():
                            require(all(math.isfinite(point[axis]) for axis in ("x", "y")),
                                    stage + f": non-finite point for {player}")
                            require(-10 <= point["x"] <= 110 and -10 <= point["y"] <= 115,
                                    stage + f": point outside allowed view for {player}")
                        if step == 0:
                            for slot, player in slots.items():
                                expected = {"x": 82, "y": 109} if serve == "ours" and slot == "1" else COURT_SPOTS[int(slot)]
                                require(points[player] == expected, stage + f": {player} not in rotation spot")
                        if step == 1 and serve == "theirs":
                            check_overlap(slots, points)
                            if variant == "open-smart-special":
                                expected = {player: dict(zip(("x", "y"), point)) for player, point in
                                            coach["receiveAtContact"][rotation].items()}
                                require(points == expected, stage + ": coach serve-receive differs from PDF transcription")
                        if step == 1 and serve == "ours" and rules == "usav":
                            check_overlap(slots, points, server=1)
                        steps_checked += 1
                    scenarios_checked += 1
    require(scenarios_checked == 180 and steps_checked == 900,
            "database does not cover all enumerated 5–1 contexts")
    print(f"Verified {scenarios_checked} contexts / {steps_checked} moments against the pinned source and rotation rules")


def next_rotation(slot, turns):
    for _ in range(turns):
        slot = NEXT_POSITION[slot]
    return slot


if __name__ == "__main__":
    main()
