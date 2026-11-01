# Ricezione a tre — mobile prototype

A small, Italian-language viewer for the six rotations and five receive-side phases of the built-in **ricezione-a-3** scheme in [napo/rotazionivolley](https://github.com/napo/rotazionivolley). The three receivers are S1, S2 and L1. The scheme's player coordinates and libero substitutions are read directly from its JSON file; this prototype does not add coaching positions or other formations.

![Phone preview showing P1 during reception](preview/mobile.png)

## Try it

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` on a computer or, using the computer's local IP address, on a phone on the same network. Choose P1–P6 above the court. Choose a phase directly below the court, or swipe left/right on the court. Tapping a marker reveals the player's full role. The URL retains the selected rotation and phase.

## Source and licence

`references/rotazionivolley/ricezione-a-3.json` is an unmodified copy from upstream revision `d9e457ee05a2e57f3a7b86a0b176a2bc82d9352e` (release 2.5.2). See [NOTICE.md](references/rotazionivolley/NOTICE.md) for attribution. This prototype is provided under [AGPL-3.0-or-later](LICENSE); the position data also retains the original Apache 2.0 attribution described in the notice.
