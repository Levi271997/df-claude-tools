---
name: qa-run
description: Runs Digitalfeet's full QA on a built WordPress/Elementor page by starting three QA sub-agents in parallel (qa-visual, qa-technical, qa-content) and merging their findings into one report. Use whenever someone asks to QA, check, test or review a built page or staging site against its design, says "run QA", "is it ready", "check the build", or gives a staging URL together with a design/Cloudflare link, even if they don't say "QA".
---

# QA run

One QA run = three checkers working at the same time, then one merged report the
developer works through. Sub-agents can't start other sub-agents, so this skill runs in the
main conversation and starts them.

## 1. Collect the inputs

- **Built URL**: the staging page (required). Several pages → one run per page, or ask
  which pages matter most.
- **Design URL**: the mockup page that matches it (needed for visual and text checks;
  without it, run qa-technical and qa-content only and say so).
- **Brief**: `design-briefs/<project>.md` on the user's Desktop, if it exists (its
  "Notes for QA" list what to look at).
- **Output folder**: `qa-reports/<project>-<page>-<YYYY-MM-DD>/` on the user's Desktop
  (`$HOME/Desktop`, or `$HOME/OneDrive/Desktop` when it is synced to OneDrive).

If the staging site needs a login or is behind a password, the checkers can't see it: ask
the developer for a public preview link or to turn off the protection for the run.

## 2. Prepare the screenshot tool

The tool is `scripts/shot.mjs` in this skill's own folder (the "Base directory for this
skill" shown when the skill loads); call that full path `<shot>`. The first time on a PC,
if `scripts/node_modules/playwright-core` is missing, run `npm install` in `scripts`
(about 10 s). It drives the installed Microsoft Edge, so no browser download is needed.

## 3. Start the three checkers in ONE message (parallel)

Send three Agent calls in the same message, one per sub-agent type, each with the same
inputs. Installed as the Digitalfeet plugin, they are named `df-workflow:qa-visual`,
`df-workflow:qa-technical` and `df-workflow:qa-content`.

- `qa-visual`: `<shot>`, design URL, built URL, output folder, brief path.
- `qa-technical`: `<shot>`, built URL, design URL, output folder.
- `qa-content`: `<shot>`, built URL, design URL, output folder.

Starting them together is the point: the run takes as long as the slowest checker, not all
three added up.

## 4. Merge into one report

When all three are back, read their files and write
`<output folder>\QA report.md`:

```
# QA report: <project> · <page>
<date> · Built: <url> · Design: <url>

## Verdict
Ready / Ready after fixes / Not ready, with the count: High n · Medium n · Low n

## Fix list
| # | Severity | Area | Problem | Where | How to fix | Done |
(High first, then Medium, then Low; duplicates from different checkers merged into one row;
Done column = [ ] for the developer)

## Check in the editor
(things the front end can't show: container names in the Navigator, global colours used, draft status)

## Passed
(one line each: what was checked and was fine)
```

Then reply in chat with the verdict, the top 3 problems and the report path. Don't fix
anything unless the developer asks; when they do, follow the `elementor-build-rules` skill
and run the QA again afterwards.

## 5. Optional: post it

If the developer asks, post the verdict and the fix list as an update on the project's
monday or ClickUp item. Ask which item if it isn't clear.
