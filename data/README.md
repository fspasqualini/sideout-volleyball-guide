# Verified scheme catalog

The site reads `schemes.json` for every court marker and team diagram. It has
**one 5–1, three-receiver pattern** from the pinned `rotazionivolley` source:
two outside hitters and, when selected, the Libero receive. A legal volleyball
team can use many other tactical arrangements, so this file does not enumerate
every possible 5–1 strategy.

Coverage is explicit:

| Dimension | Values |
| --- | --- |
| Setter rotation | P1, P6, P5, P4, P3, P2 |
| Serve side | Our team, other team |
| Lineup | With or without Libero |
| Optional ordinary substitution | Defensive specialist for Outside 2 |
| Rule timing | FIVB 2025–28, USA Volleyball 2025–27, selected FIVB 2026 trial |
| Moments | Numbered rotation, serve, first response, attack, defense |

This is 144 contexts and 720 stored court moments. The source has seven phases:
`base`, `serveServe`, `switchServe`, `receiveReceive`, `receiveSet`,
`receiveHit`, and `switchReceive`. `phasesByView` declares which source phase
each moment uses in each rule set. The FIVB serving team may switch into its
defensive shape before service contact; the USA Volleyball example stays in a
legal serving arrangement until contact. The 2026 trial is a separate choice.

`scripts/build_schemes.py` generates the database from the pinned source JSON.
`scripts/check_schemes.py` fails if the source digest or generated data changes,
if a rotation or substitution breaks the rules encoded in the checker, if a
required view is missing, or if the required serve-contact order is broken.
The no-Libero variant uses the middle coordinates that the source includes;
the defensive specialist takes Outside 2's ordinary substitution spot. The
"our serve → attack" moment reuses the source's general attack phase. These
derived choices are declared in the generator for review.
Run it before publishing:

```bash
python3 scripts/check_schemes.py
```

The verifier checks structural and rule relationships. It cannot prove that a
coaching pattern is optimal or suitable for every competition. The published
source provides one example of where players move; the applicable official
rulebook governs when they may move.
