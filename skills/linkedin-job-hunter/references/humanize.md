# Humanizing free text (cover notes, screening answers, recruiter replies)

Text Claude drafts can read as AI-written: inflated wording, the rule of three, stock transitions, uniform sentence rhythm. This step removes those patterns with the **Humanizer** plugin for Claude ([blader/humanizer](https://github.com/blader/humanizer), listed in Anthropic's plugin directory). It runs inside Claude: no browser, no account, no character limits.

The step is optional. Skip it if the user doesn't want it. It's most useful for longer text a person will read (cover notes, "why this company" answers). For short factual answers (location, salary, notice period, right to work), clear and true matters more than style.

## Install (once)

In Claude Code:

```
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

In the Claude desktop app, add **Humanizer** (by blader) from the plugin directory. If the plugin isn't installed, tell the user how to add it, and meanwhile apply the same idea yourself: plain words, varied sentence length, no filler, no rule-of-three lists, no "I am excited to…" openers.

## Use

1. Draft the text from `facts.md` first. The humanizer improves wording; it can't fix wrong content.
2. Keep out of the humanizer, and re-insert afterwards unchanged: greetings and sign-offs, short factual lines (location, salary, notice period), verbatim quotes, and lists of tool names.
3. Invoke the `humanizer` skill on the remaining text. Tell it the audience (a recruiter or hiring manager), the register (professional, plain), and that every fact, name, number and date must stay exactly as written.
4. Fact-check the result (below), then save the final text and a short "What changed" note next to the application.

## Fact-check (always)

Any rewriting step can change meaning, so compare the output with the original line by line against `facts.md`. Watch for:

- **inflated claims**: "worked with X" → "used X in production"; "built" → "designed and launched"; "several" → "numerous"; "hands-on experience" → "expert"
- **invented details**: "from scratch", "independently", "led the team", metrics nobody gave
- **changed facts**: product or tool names altered ("Claude Code" → "the Claude Code model"), the client's brands turned into "our brands", tense changes that imply the user left a job they still hold
- **garbled conditions**: visa, notice-period and availability sentences reworded until they say something else
- **lost structure**: list numbering, labels the recruiter asked for, names shortened

Keep the new, more natural sentence shapes where they're correct; repair only what's wrong. If a repair puts back a stiff phrase, that's fine. Accuracy beats style.

## Optional: a web humanizer instead

Some users prefer a web humanizer with an AI-detector score (several exist; most need an account). If so: the user signs in themselves, you fill the text box with `form_input`, read the output with JavaScript (store it in `window.__out` and read it in slices; output over ~1,000 characters is cut off), and run the same fact-check. Don't chase detector scores past two rounds; they swing widely on small wording changes and recruiters rarely run them.
