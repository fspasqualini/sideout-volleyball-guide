# Sideout

A beginner-friendly, bilingual (Italian/English) guide to six-player indoor volleyball rotations and roles. Choose a 5–1 lineup with or without a libero, your role, numbered rotation position, serve situation, and rule set to see a path and short instructions. The sample lineup shows all six players moving after each sideout.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Host it

There are no build dependencies or environment variables.

- **GitHub Pages:** Put the files at the root of a GitHub repository. In **Settings → Pages**, publish from the main branch and `/ (root)`.
- **Cloudflare Pages:** Connect the GitHub repository with no framework preset. Use `exit 0` as the build command and `.` (the repository root) as the output directory.

All asset links are relative, so the same files work at a GitHub Pages project URL or a custom domain. The "Share this view" button copies the current language, lineup, role, and rule settings in the URL. The language choice is also remembered in the browser.

## Content scope

The main court shows a full example 5–1 team. It rotates the lineup so the selected role starts in the chosen numbered spot, then shows five stages: legal start, serve contact, serve receive or defense, the switch into attack, and the switch back to defense. The orange player is the selected role; dark players are teammates. The diagram is a teaching example, not a legal lineup checker. Its stack uses conservative player-center spacing; real overlap calls depend on players' feet. Teams can use different serve-receive and defensive patterns. The numbered position determines each player's front/back status for the whole rally even after moving.

The sample 5–1 lineup has one setter, one opposite, two outside hitters, and two middle blockers. **Without libero**, both middles stay on court, including the back-row middle. **With libero**, the libero replaces the back-row middle between rallies except when the regular middle must serve. Under the selected USA Volleyball rules, the example assigns the libero to serve for Middle 1 in one service position; under FIVB rules, neither libero may serve. Both middles are selectable separately. The defensive specialist is an optional ordinary substitution for Outside 2, so both middles remain visible in the no-libero setup. The team diagram reflects the selected lineup. These examples do not model every team's complete substitution plan.

The default rules are FIVB 2025–28. The selector also includes USA Volleyball 2025–27 and a 2026 FIVB trial used at specified competitions. Confirm the local league rules before relying on the timing of movement.

Official sources reviewed 13 October 2026:

- [FIVB Official Volleyball Rules 2025–2028](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN.pdf), especially rules 7.4, 7.6, 13, 14, and 19.
- [USA Volleyball Indoor Rules 2025–2027](https://usavolleyball.org/wp-content/uploads/2023/03/2025-2027-USAV-Indoor-Rules-Book_FINAL.pdf), especially rules 7.4, 7.6, 13, 14, and 19.
- [USA Volleyball 2026 rules interpretation](https://usavolleyball.org/wp-content/uploads/2026/01/2026-Rules-Interp-1.pdf), including second-contact and screening updates.
- [FIVB announcement of 2026 competition trials](https://en.volleyballworld.com/news/fivb-board-of-administration-approves-rule-tests-for-2026-competitions), including receiving-team movement timing.
- [FIVB guide to volleyball roles](https://www.fivb.com/volleyball/the-game/) for the general role descriptions.
- [FIVB Level I Coaches Manual](https://www.fivb.com/wp-content/uploads/2024/03/FIVB_Coach_Manual_EN.pdf) for service reception and defensive systems.
- [FIVB Level II Coaches Manual](https://www.fivb.com/wp-content/uploads/2024/03/Coaches_Manual_Level_II_EN.pdf) for the 5–1 offense.
