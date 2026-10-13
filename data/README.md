# Verified scheme catalog

The site reads `schemes.json` for every court marker and team diagram. It has
the pinned `rotazionivolley` 5–1, three-receiver pattern with and without a
Libero, plus **Open smart special**, a separate no-Libero 5–1 reception plan
transcribed from the user's coach-supplied 2015 PDF. In that plan the two
outsides and the back-row middle receive; the opposite covers very short serves
only.
These are coaching examples, not every possible 5–1 arrangement.

Coverage is explicit:

| Dimension | Values |
| --- | --- |
| Setter rotation | P1, P6, P5, P4, P3, P2 |
| Serve side | Our team, other team |
| Lineup | With Libero, without Libero, Open smart special |
| Optional ordinary substitution | Defensive specialist for Outside 2 |
| Rule timing | FIVB 2025–28, USA Volleyball 2025–27, selected FIVB 2026 trial |
| Moments | Numbered rotation, serve, first response, attack, defense |

This is 180 contexts and 900 stored court moments. The rotazionivolley source has seven phases:
`base`, `serveServe`, `switchServe`, `receiveReceive`, `receiveSet`,
`receiveHit`, and `switchReceive`. `phasesByView` declares which source phase
each moment uses in each rule set. The FIVB serving team may switch into its
defensive shape before service contact; the USA Volleyball example stays in a
legal serving arrangement until contact. The 2026 trial is a separate choice.

`scripts/build_schemes.py` generates the database from the pinned source JSON
and `references/coach-open-smart-special/receive.json`. The latter contains
approximate coordinates manually read from all six coach diagrams and their
three passers. Its PDF SHA-256 is recorded there. The original coach PDF is
not published in this repository. For Open smart special, the serve-contact
and serve-receive positions come from the coach diagrams; later attack and
defense positions adapt the published rotazionivolley coordinates to the
coach’s player naming, with the coach's P1 left/right attack exception.
The PDF shows no complete serving or defensive diagrams, so those views are
derived examples rather than directly verified coach positions. The third
PDF panel says “zona 1 - P5”; the numbered positions in its drawing show P5.

`scripts/check_schemes.py` fails if the source digest or generated data changes,
if a rotation or substitution breaks the rules encoded in the checker, if a
required view is missing, or if the required serve-contact order is broken.
The no-Libero variant uses the middle coordinates that the source includes;
the defensive specialist takes Outside 2's ordinary substitution spot. The
"our serve → attack" moment reuses the source's general attack phase. These
derived choices are declared in the generator for review.
Run it before publishing; if you have the source PDF, pass it to verify its
digest as well:

```bash
python3 scripts/check_schemes.py
python3 scripts/check_schemes.py --coach-pdf /path/to/coach.pdf
```

The verifier checks structural and rule relationships. It cannot prove that a
coaching pattern is optimal or suitable for every competition. The published
source provides one example of where players move; the applicable official
rulebook governs when they may move.
