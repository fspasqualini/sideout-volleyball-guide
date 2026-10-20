# Verified scheme catalog

The site reads `schemes.json` for every court marker and team diagram. It has
the pinned `rotazionivolley` 5–1, three-receiver pattern with and without a
Libero, plus **Open smart special**, a separate no-Libero 5–1 reception plan
transcribed from the user's coach-supplied 2015 PDF. In that plan the two
outsides and the back-row middle receive; the opposite covers very short serves
only.
These are coaching examples, not every possible 5–1 arrangement.

The Open Smart One on One view has two static moments for each of the six
rotations. The first uses the PDF's plotted reception positions before the
opponent's serve. The second shows where all six prepare for the first set.
The setter moves between zones 2 and 3 for the second touch even when starting
in the back row; its point matches the full-rally setting anchor. Other
back-row players hold their PDF reception sectors through this first set.
Front-row hitters prepare to attack from their role areas, with the P1
opposite/outside exception recorded in `receive.json`. P1 Outside 1 is a
front-row player in rotation zone 2 even though its reception marker is deep.
The PDF's written assignments of back-row middles to zone 5, back-row outsides
to zone 6, and back-row setter/opposite to zone 1 apply to later defense after
our attack. They do not require two passers to swap during reception. The
arrows and exact centers in the second view are illustrative; receivers
complete their pass before leaving the passing lane.

Coverage is explicit:

| Dimension | Values |
| --- | --- |
| Setter rotation | P1, P6, P5, P4, P3, P2 |
| Serve side | Our team, other team |
| Lineup | With Libero, without Libero, Open smart special |
| Rule timing | FIVB 2025–28, USA Volleyball 2025–27, selected FIVB 2026 trial |
| Moments | Numbered rotation, serve, first response, attack, defense |

This is 108 contexts and 540 stored court moments. The rotazionivolley source has seven phases:
`base`, `serveServe`, `switchServe`, `receiveReceive`, `receiveSet`,
`receiveHit`, and `switchReceive`. `phasesByView` declares which source phase
each moment uses in each rule set. The FIVB serving team may switch into its
defensive shape before service contact; the USA Volleyball example stays in a
legal serving arrangement until contact. The 2026 trial is a separate choice.

`rallyPhases` orders eight on-screen events for either serve side. Moments 3–5
belong to the receiving team's K1 (reception, set, attack); moments 6–8 belong
to the serving team's K2 (defense, set, counterattack), which starts with the
serve at moment 2. Each event declares
the ball owner and points to one of five checked court moments for our team.
The optional opponent view uses the opposite-serve, no-Libero P1 example and
its separately declared `opponentView` anchor. This is a structurally checked
example, not a reconstruction of a real opponent's lineup or tactics. A few
short intermediate events interpolate between checked moments; these travel
paths and the ball cue are illustrative. In all three lineups, the
receiving setter begins moving during the serve flight, and the front row
transitions toward its checked attack view as the pass travels to the setter.
The serving setter moves during the opposing attack and ensuing pass. These
timing choices and the player chosen for each touch are illustrative: the two
attacks go to the available
front-row outside hitter, with the ball centered above that player at contact.
The intervening ball curves are illustrative, not extra coach diagrams.
The serve-receive pass follows a serve; a dig follows an attack and is distinct
from receiving a serve. Later
sets and attacks reuse checked attack shapes as illustrative continuation
moments, not new coaching diagrams.

`scripts/build_schemes.py` generates the database from the pinned source JSON
and `references/coach-open-smart-special/receive.json`. The latter contains
approximate coordinates manually read from all six coach diagrams and their
three passers. Its structured `firstSetZones` distinguish held back-row
reception sectors from front-row attack areas and the temporary setting
destination. They are checked for rotation identity and front/back status.
Its PDF SHA-256 is recorded there. The original coach PDF is
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
Outside 2 stays on court in both 5–1 variants. The
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
