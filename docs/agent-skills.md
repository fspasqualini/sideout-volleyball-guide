# Agent skills used for this web app

These skills guide Codex reviews. They are not JavaScript dependencies and are
not included in the published site. Install their `SKILL.md` files under
`~/.codex/skills/<skill-name>/` to make them available in a local Codex setup.

| Skill | Official source, pinned revision | Use here |
| --- | --- | --- |
| `web-design-guidelines` | [Vercel](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines/SKILL.md) | Review `index.html`, `styles.css`, `app.js`, and `i18n.js` for interface and accessibility issues. It fetches current Web Interface Guidelines for each review; this review used [revision `434b7f9`](https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/command.md). |
| `frontend-testing-debugging` | [OpenAI](https://github.com/openai/plugins/blob/0722921d5542fc593105c27bd52630babd8b8c2a/plugins/build-web-apps/skills/frontend-testing-debugging/SKILL.md) | Exercise the lineup, role, timeline, and sharing controls in a browser at desktop and phone widths. |

The first review found that keyboard users could not skip directly to the
interactive guide, the opponent server marker overlapped the court controls,
and copying a share link lacked an accessible status announcement. The fixes
are on `codex/official-web-skills-audit` for review before production release.
