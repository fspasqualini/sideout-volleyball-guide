# Sideout

A beginner-friendly, bilingual (Italian/English) guide to six-player indoor volleyball rotations and roles. Choose Open smart special or a 5–1 lineup with or without a Libero, your role, numbered rotation position, serve situation, and rule set to see a path and short instructions. The default view uses Open smart special, Italian, FIVB 2025–28, and the other team's serve.

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

The main court reads the [verified scheme catalog](data/README.md), a pinned 5–1 three-receiver example, and animates seven rally phases for either side's serve. Play, pause, step, scrub, and speed controls move all six players between the catalog's checked snapshots. Short intermediate positions are linear interpolations between those snapshots; the ball cue is illustrative. Reduced-motion preferences replace moving markers with discrete phase changes. On the other team's serve, the first touch is a serve pass. On our serve, the team prepares for an opponent attack, then the first touch is a dig. The orange player is the selected role; dark players are teammates. A player replaced by the Libero is shown off court. The numbered position determines each player's front/back status for the whole rally even after moving. The diagram is a teaching example, not a legal lineup checker. Real overlap calls depend on players' feet. Teams can use different serve-receive and defensive patterns.

The sample 5–1 lineup has one setter, one opposite, two outside hitters, and two middle blockers. **Without libero**, both middles stay on court, including the back-row middle. **With libero**, the libero replaces the back-row middle between rallies except when the regular middle must serve. Under the selected USA Volleyball rules, the example assigns the libero to serve for Middle 1 in one service position; under FIVB rules, neither libero may serve. Both middles are selectable separately. The defensive specialist is an optional ordinary substitution for Outside 2, so both middles remain visible in the no-libero setup. The team diagram reflects the selected lineup. These examples do not model every team's complete substitution plan.

**Open smart special** uses the six three-player serve-receive stacks from a coach-supplied Sporting Club 2000 U16 PDF (14 March 2015). The two outsides and the back-row middle receive; the opposite covers only very short serves. The coach's P1 plan keeps the opposite at left front and Outside 1 at right front. The original PDF is not redistributed. Its transcribed data and SHA-256 are in [references/coach-open-smart-special/receive.json](references/coach-open-smart-special/receive.json). Serving, attack, and defense views use the existing licensed example adapted to the coach's player order, because the PDF only documents reception.

The default rules are FIVB 2025–28. The selector also includes USA Volleyball 2025–27 and a 2026 FIVB trial used at specified competitions. Confirm the local league rules before relying on the timing of movement.

Official sources reviewed 13 October 2026:

- [FIVB Official Volleyball Rules 2025–2028](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN.pdf), especially rules 7.4, 7.6, 13, 14, and 19.
- [USA Volleyball Indoor Rules 2025–2027](https://usavolleyball.org/wp-content/uploads/2023/03/2025-2027-USAV-Indoor-Rules-Book_FINAL.pdf), especially rules 7.4, 7.6, 13, 14, and 19.
- [USA Volleyball 2026 rules interpretation](https://usavolleyball.org/wp-content/uploads/2026/01/2026-Rules-Interp-1.pdf), including second-contact and screening updates.
- [FIVB announcement of 2026 competition trials](https://en.volleyballworld.com/news/fivb-board-of-administration-approves-rule-tests-for-2026-competitions), including receiving-team movement timing.
- [FIVB guide to volleyball roles](https://www.fivb.com/volleyball/the-game/) for the general role descriptions.
- [FIVB Level I Coaches Manual](https://www.fivb.com/wp-content/uploads/2024/03/FIVB_Coach_Manual_EN.pdf) for service reception and defensive systems.
- [FIVB Level II Coaches Manual](https://www.fivb.com/wp-content/uploads/2024/03/Coaches_Manual_Level_II_EN.pdf) for the 5–1 offense.
- [rotazionivolley](https://rotazioni.volleyserve.it/) for the Apache-licensed three-receiver example, pinned and attributed in [references/rotazionivolley/NOTICE.md](references/rotazionivolley/NOTICE.md).
