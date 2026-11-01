"""Check the pinned rotazionivolley scheme required by the static viewer."""

import hashlib
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "references/rotazionivolley/ricezione-a-3.json"
SOURCE_SHA256 = "bffc9db86cd60e7b220c29a42ade9a1c3ed1e3aceda7109545559f0b3a53886d"
PHASES = ("base", "receiveReceive", "receiveSet", "receiveHit", "switchReceive")


def check_point(point):
    assert all(
        key in point and isinstance(point[key], (int, float)) and math.isfinite(point[key])
        for key in ("x", "y")
    )


def main():
    source = SOURCE.read_bytes()
    assert hashlib.sha256(source).hexdigest() == SOURCE_SHA256, "upstream JSON changed"
    scheme = json.loads(source)
    assert scheme["id"] == "ricezione-a-3"
    assert {player["id"] for player in scheme["players"]} == {"P", "O", "C1", "C2", "S1", "S2"}
    assert "L1" in {player["id"] for player in scheme["liberos"]}

    for rotation in range(1, 7):
        key = str(rotation)
        swap = scheme["liberoSwaps"][key]["receive"]
        assert swap["libero"] == "L1"
        assert swap["replaces"] in {"C1", "C2"}
        active = {player["id"] for player in scheme["players"]} - {swap["replaces"]} | {"L1"}
        assert len(active) == 6

        for phase in PHASES:
            positions = scheme["positions"][phase][key]
            for player_id in active:
                point = positions.get(player_id)
                if player_id == "L1" and point is None:
                    point = positions.get(swap["replaces"])
                assert point is not None, f"missing P{rotation} {phase} {player_id}"
                check_point(point)

        zones = scheme["receptionZones"][key]
        assert zones["areas"], f"missing P{rotation} competence areas"
        for area in zones["areas"]:
            assert area["playerId"] in active
            assert len(area["vertices"]) >= 3
            assert set(area["vertices"]) <= set(zones["vertices"])
            assert set(area["competence"]) <= {"left", "right", "front", "back"}
        for point in zones["vertices"].values():
            check_point(point)

    print("Pinned source and 30 receive-side court views verified")


if __name__ == "__main__":
    main()
