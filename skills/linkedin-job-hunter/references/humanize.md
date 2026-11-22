# Humanizing free text (cover notes, screening answers, recruiter replies)

Some recruiters and ATS tools flag text that reads as AI-written. If the user wants it, run Claude-drafted free text through a web AI humanizer they already have an account with (tested with isgen.ai's AI Humanizer and AI Detector). Skip this step if the user doesn't want it.

## Rules

- The user signs in to the humanizer themselves. If it shows a login page or a lower signed-out character limit, stop and ask them to sign in.
- Don't click upgrade, pricing or subscription offers.
- Send only free text. Keep out (and re-insert afterwards): greetings and sign-offs, short factual lines (location, salary, notice period), verbatim quotes, and lists of tool names, which humanizers mangle.
- Use a formal style for applications and recruiter emails.

## Mechanics (isgen.ai, Nov 2026)

1. Open `https://isgen.ai/ai-humanizer` in a new tab. Check the counter under the box shows the signed-in limit (e.g. `0/20000 Characters`).
2. `find` "Paste text or write here", `form_input` the text, confirm the counter changed.
3. Click Humanize; ~30 s for 2,500 characters.
4. Read the output with JavaScript (`get_page_text` returns nothing on this site). Store it and read in slices:
   ```js
   const els=[...document.querySelectorAll('div,p')].filter(e=>e.innerText&&e.innerText.includes('<a phrase from the output>')&&!e.querySelector('textarea'));
   els.sort((a,b)=>a.innerText.length-b.innerText.length); window.__out=els[0].innerText; window.__out.length
   ```
5. Optional score check at `https://isgen.ai` (AI Detector): paste the final repaired text, click "Detect AI Content", report the Human/AI split. At most two humanize-and-check rounds; don't chase a perfect score.

## Fact-check (mandatory)

Compare the output with the original, line by line, against `facts.md`. Humanizers reliably:

- **inflate claims**: "worked with Gemini" → "used Gemini in production"; "built" → "designed and launched"; "several" → "numerous"; "hands-on experience" → "knowledgeable"
- **invent details**: a line about "generating the applicant's resume" that nobody wrote; "from scratch"; "independently developed"
- **break facts**: "Claude Code" → "the Claude Code model"; "the client's brands" → "our brands"; a notice-period answer turned into "no notice from my previous employer" when the user is still employed
- **garble conditions**: "sponsorship now and while on the visa" → "sponsorship until my visa is granted, and also…"
- **drop structure**: list numbers, placeholders, emojis, product names shortened

Keep the humanizer's new sentence shapes where they're correct (that's what makes the text read less like AI); repair only what's wrong. Then save the final text and a short "What changed" list (facts restored, score) next to the application.
