# Digitalfeet Claude tools

Claude Code plugins for the Digitalfeet team. The full workflow guide is the
"Design to Elementor workflow" doc.

## df-workflow

| Part | Type | Use it like this |
|---|---|---|
| design-brief | Agent | `@agent-df-workflow:design-brief <design link>` or "Make a design brief for <link>" |
| elementor-build-rules | Skill | Loads by itself when Claude builds in Elementor |
| qa-run | Skill | "Run QA on <staging link> against <design link>" or `/df-workflow:qa-run <links>` |
| qa-visual, qa-technical, qa-content | Agents | Started by qa-run; can also be run alone with `@agent-df-workflow:qa-...` |

Briefs are saved to `Desktop/design-briefs/`, QA reports to `Desktop/qa-reports/`.

## Install (once per person)

Needs Claude Code, Node.js and Microsoft Edge. In Claude Code:

```
/plugin marketplace add Levi271997/df-claude-tools
/plugin install df-workflow@digitalfeet
```

Then start a new Claude Code session. The first QA run installs the screenshot tool's
one dependency by itself (`npm install`, about 10 seconds).

## Update

After someone pushes a change to this repo: `/plugin marketplace update digitalfeet`,
then start a new session.

## Change a rule or an agent

1. Edit the file under `plugins/df-workflow/` (agents in `agents/`, skills in `skills/`).
2. Raise `version` in `plugins/df-workflow/.claude-plugin/plugin.json` and in
   `.claude-plugin/marketplace.json` (e.g. 1.0.0 → 1.1.0), so everyone's Claude sees there is an update.
3. Commit, push, and tell the team to update.

Rules of thumb: write rules as plain instructions with the reason behind them, keep one
rule per idea, and test a changed agent on a real page before pushing.
