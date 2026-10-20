# Sideout

A beginner-friendly, bilingual (Italian/English) guide to six-player indoor volleyball rotations and roles. The first formation choice, **Open Smart One on One**, is the default and focuses on the six serve-reception diagrams in the Sporting Club 2000 coach PDF. **Open smart special** keeps the full-rally animation and personal phase cards; both use the same checked reception data.

## Run locally

Serve this folder with any static file server, because the app loads its court
database from `data/schemes.json`:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Host it

There are no build dependencies or environment variables.

- **GitHub Pages:** Set **Settings → Pages → Source** to **GitHub Actions**. The committed workflow verifies the scheme database before publishing the static site from `main`.
- **Cloudflare Pages:** Connect the GitHub repository with no framework preset. Use `exit 0` as the build command and `.` (the repository root) as the output directory.

All asset links are relative, so the same files work at a GitHub Pages project URL or a custom domain. The "Share this view" button copies the current language, lineup, role, and rule settings in the URL. The language choice is also remembered in the browser.

## Content scope

**Open Smart One on One** shows one of the coach's P1, P6, P5, P4, P3, or P2 reception arrangements at a time. P is the setter; the number is the setter's rotation zone, and the six diagrams are consecutive rotations of one lineup. A two-position selector shows the checked PDF reception stack before the opponent serves and the playing zones described by the PDF's written role rules after reception. All six players remain visible, with the two outsides and the back-row middle highlighted as regular passers; a player can select a role and see its start and destination zones. The second snapshot's marker centers are illustrative and do not prescribe when each player leaves the passing line. The opposite is outside that regular passing line but covers very short serves when needed, as the P1 note in the PDF says. Concise spacing cues come from the PDF text. This view does not show inferred later-rally paths. Under the [FIPAV 2026/27 competition provisions](https://www.federvolley.it/documenti-UG), receiving players may change positions when the server begins a movement tied to the service action; this local timing is explained directly in the view. The FIPAV [October 2026 clarification](https://overjoyed-wilson.s3.eu-south-mil.io.cloud.ovh.net/s3fs-public/2026-10/Precisazioni%20ed%20istruzioni%20operative%20Sperimentazioni%20Regolamentari%202026.2027.pdf?VersionId=1791656462.573255) distinguishes that movement from unrelated ball bouncing or repositioning. The original PDF's third panel incorrectly says “zone 1 · P5”; its diagram is P5.

The optional [agent skills used for interface reviews](docs/agent-skills.md)
are documented separately from the static site.

In the full-rally formations, the main court reads the [verified scheme catalog](data/README.md) and animates eight moments in ball order for either side's serve: numbered rotation positions, serve, reception, set, sideout attack, defense of that attack, transition set, and counterattack. Each action names the team with the ball. K1 (sideout) is the receiving team's reception–set–attack; K2 (break point) is the serving team's serve–defense–set–counterattack. On our serve, the opponents perform K1 and we perform K2; on their serve, we perform K1 and they perform K2. If the ball returns, the transition cycle continues. Reception follows a serve; a dig follows an attack. The player, position, and eight-moment controls are together in the left sidebar, which scrolls independently beside the two courts. Play, pause, step, scrub, and speed controls move our six players between checked snapshots. The selected player has a red outline and the ball is orange. The opponent court is shown by default and can be hidden; its six markers form a generic, checked 5–1 example, not the real opponent's lineup. All three lineups use continuous teaching playback across the eight moments: the receiving setter starts toward the setting area during the serve flight, while the front row begins moving toward its attack positions as the pass travels through the receiver’s lane to the setter; the serving setter moves toward the second touch as the opposing attack arrives and the dig is passed. Ball contact points align with a passer, setter, and the available front-row outside hitter; the ball is drawn just above the player marker at contact. Intermediate travel paths, touch choices, and ball flight are illustrative. Reduced-motion preferences replace moving markers and ball with discrete phase changes. A player replaced by the Libero is shown off court. The numbered position determines each player's front/back status for the whole rally even after moving. The diagram is a teaching example; real overlap calls depend on players' feet and teams use different systems.

The **My phase cards** tab uses the same eight stored rally moments and player coordinates as the animation. Each card shows our whole team, highlights the selected role, and gives a short personal job and a cue about the other players. A rotation reference names the teammates immediately left, right, in front, or behind the selected player's numbered position; the selected rule set still determines when those relationships must be held. Each card links back to its moment in the animation. Both tabs share lineup, role, position, serve, rule set, and language settings, and the selected tab is included in shared URLs.

From **My phase cards**, choose a two-page compact or four-page larger A4 layout and use **Print / save PDF**. The browser's native print dialog provides physical printing and Save as PDF. Each page repeats the selected player, rotation, serve situation, lineup, rule set, and nearby rotation references; the eight cards are grouped in rally order. Duplex printing makes a one- or two-sheet handout. The print view is generated from the same currently selected cards, without changing the scheme database.

The sample 5–1 lineup has one setter, one opposite, two outside hitters, and two middle blockers. **Without libero**, both middles stay on court, including the back-row middle. **With libero**, the libero replaces the back-row middle between rallies except when the regular middle must serve. Under the selected USA Volleyball rules, the example assigns the libero to serve for Middle 1 in one service position; under FIVB rules, neither libero may serve. Both middles are selectable separately. Outside 2 stays in the lineup; there is no defensive-specialist option. The team diagram reflects the selected lineup. These examples do not model every team's complete substitution plan.

**Open smart special** uses the six three-player serve-receive stacks from a coach-supplied Sporting Club 2000 U16 PDF (14 March 2015). The two outsides and the back-row middle receive; the opposite covers only very short serves. The coach's P1 plan keeps the opposite at left front and Outside 1 at right front. The original PDF is not redistributed. Its transcribed data and SHA-256 are in [references/coach-open-smart-special/receive.json](references/coach-open-smart-special/receive.json). Serving, attack, and defense views use the existing licensed example adapted to the coach's player order, because the PDF only documents reception.

The full-rally views default to FIVB 2025–28. Their selector also includes USA Volleyball 2025–27 and a 2026 FIVB trial used at specified competitions. Open Smart One on One explains the FIPAV 2026/27 receiving-team timing directly. Confirm the local league rules before relying on the timing of movement.

Official sources reviewed 13 October 2026:

- [FIVB Official Volleyball Rules 2025–2028](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN.pdf), especially rules 7.4, 7.6, 13, 14, and 19.
- [USA Volleyball Indoor Rules 2025–2027](https://usavolleyball.org/wp-content/uploads/2023/03/2025-2027-USAV-Indoor-Rules-Book_FINAL.pdf), especially rules 7.4, 7.6, 13, 14, and 19.
- [USA Volleyball 2026 rules interpretation](https://usavolleyball.org/wp-content/uploads/2026/01/2026-Rules-Interp-1.pdf), including second-contact and screening updates.
- [FIVB announcement of 2026 competition trials](https://en.volleyballworld.com/news/fivb-board-of-administration-approves-rule-tests-for-2026-competitions), including receiving-team movement timing.
- [FIVB guide to volleyball roles](https://www.fivb.com/volleyball/the-game/) for the general role descriptions.
- [FIVB Level I Coaches Manual](https://www.fivb.com/wp-content/uploads/2024/03/FIVB_Coach_Manual_EN.pdf) for service reception and defensive systems.
- [FIVB Level II Coaches Manual](https://www.fivb.com/wp-content/uploads/2024/03/Coaches_Manual_Level_II_EN.pdf) for the 5–1 offense.
- [FIPAV Lombardia's 2026 coach course programme](https://lombardia.federvolley.it/data-files/fipavlombardia/article_attachments/1_Indizioneeprogramma2Grado2026.pdf) for the terms *fase cambio palla* and *fase break point*.
- [rotazionivolley](https://rotazioni.volleyserve.it/) for the Apache-licensed three-receiver example, pinned and attributed in [references/rotazionivolley/NOTICE.md](references/rotazionivolley/NOTICE.md).
