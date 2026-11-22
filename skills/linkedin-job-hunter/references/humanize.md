# Humanizing free text (cover notes, screening answers, recruiter replies)

Text Claude drafts can read as AI-written: inflated wording, the rule of three, stock transitions, uniform sentence rhythm. This optional step rewrites free text so it reads more naturally, then fact-checks it.

## Let the user choose (once, at setup)

The choice is the user's. The first time free text is needed (or during workspace setup), ask which they want and save it in `profile.md` under **Humanizer**:

| | **Humanizer plugin for Claude** | **isgen.ai AI Humanizer** | **None** |
|---|---|---|---|
| What it is | Open-source Claude plugin ([blader/humanizer](https://github.com/blader/humanizer), in Anthropic's plugin directory) | Web app at isgen.ai, used in the user's Chrome | Claude's own draft, written plainly |
| Cost | Free | Paid plan needed for real use (see pricing below) | Free |
| Account / sign-in | None | Yes, the user signs in themselves | None |
| AI-detector score | No | Yes, isgen's AI Detector (Academic or Ultimate plans) | No |
| Limits | None | Per-plan word and character limits | None |
| Speed | Inside Claude, instant | ~30 s per 2,500 characters, via the browser | — |

When you present the choice, **tell the user isgen's pricing before they pick it** (prices change; check https://isgen.ai/pricing if the date below is old):

> **isgen.ai pricing (checked 2026-11-22, USD per month, billed annually; monthly billing costs more):**
> - **Writing — $15/mo:** AI Humanizer, 50,000 humanizer words/month, up to 15,000 characters per run. No AI Detector.
> - **Ultimate — $24/mo:** AI Humanizer and AI Detector, unlimited words, up to 20,000 characters per humanizer run.
> - **Academic — $8/mo:** AI Detector only. **No humanizer.**
> - A free plan exists, but signed-out use is capped at 3,000 characters and the Humanize button asks you to sign in. Unused words don't roll over; refunds only if usage is under 15% of the plan.

Whatever they choose, the fact-check below always applies.

## Option A: Humanizer plugin for Claude

**Install (once).** In Claude Code:

```
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

In the Claude desktop app, add **Humanizer** (by blader) from the plugin directory.

**Use.**
1. Draft from `facts.md` first. The humanizer improves wording; it can't fix wrong content.
2. Keep out of it, and re-insert unchanged afterwards: greetings and sign-offs, short factual lines (location, salary, notice period), verbatim quotes, lists of tool names.
3. Invoke the `humanizer` skill on the rest. Tell it the audience (recruiter or hiring manager), the register (professional, plain), and that every fact, name, number and date must stay exactly as written.
4. Fact-check (below).

## Option B: isgen.ai AI Humanizer (web, in the user's Chrome)

1. The user signs in to isgen.ai themselves. Never type their password or click Sign in for them; don't click upgrade or pricing buttons.
2. Open `https://isgen.ai/ai-humanizer` in a new tab. Check the counter under the box shows their plan's limit (e.g. `0/20000 Characters`); a `0/3000` counter or a "Sign in" link means they're signed out, so stop and ask them to sign in.
3. Settings: Mode **Advanced**, Writing style **Formal** for applications and recruiter emails.
4. Same exclusions as Option A (greetings, short factual lines, quotes, tool lists).
5. `find` "Paste text or write here", `form_input` the text, confirm the counter changed, click **Humanize**.
6. Read the output with JavaScript (`get_page_text` returns nothing on this site; output over ~1,000 characters is cut, so read in slices):
   ```js
   const els=[...document.querySelectorAll('div,p')].filter(e=>e.innerText&&e.innerText.includes('<a phrase from the output>')&&!e.querySelector('textarea'));
   els.sort((a,b)=>a.innerText.length-b.innerText.length); window.__out=els[0].innerText; window.__out.length
   ```
   then `window.__out.slice(0,900)`, `slice(900,1800)`, …
7. Optional (Academic/Ultimate plans): paste the final, repaired text into the AI Detector at `https://isgen.ai`, click **Detect AI Content**, and report the Human/AI split. At most two humanize-and-check rounds: scores swing widely on small wording changes, and recruiters rarely run detectors.
8. Fact-check (below). Close the tab.

## Option C: none

Write plainly yourself: short sentences of varied length, concrete details from `facts.md`, no filler openers ("I am excited to…"), no rule-of-three lists, no stock transitions.

## Fact-check (always, whichever option)

Any rewriting step can change meaning, so compare the output with the original line by line against `facts.md`. Watch for:

- **inflated claims**: "worked with X" → "used X in production"; "built" → "designed and launched"; "several" → "numerous"; "hands-on experience" → "knowledgeable"/"expert"
- **invented details**: "from scratch", "independently", "led the team", metrics nobody gave, whole new sentences
- **changed facts**: product or tool names altered ("Claude Code" → "the Claude Code model"), the client's brands turned into "our brands", wording that implies the user left a job they still hold
- **garbled conditions**: visa, notice-period and availability sentences reworded until they say something else
- **lost structure**: list numbering, labels the recruiter asked for, names shortened

Keep the new, more natural sentence shapes where they're correct; repair only what's wrong. Accuracy beats style. Save the final text and a short "What changed" note (facts restored, detector score if any) next to the application.
