# Checking replies and answering recruiters

## Find the right mailbox

Users often have several Google accounts signed in. `mail.google.com/mail/u/0/` is the first, `/u/1/` the second, and so on. Check the tab title shows the address used on applications (it's in `profile.md`) before searching; don't browse a work mailbox you don't need.

## Search

Use Gmail search in the URL hash, limited to the period since the last check:

```
https://mail.google.com/mail/u/<n>/#search/after%3A<YYYY>%2F<MM>%2F<DD>+(application+OR+interview+OR+unfortunately+OR+candidacy+OR+%22next+steps%22)
```

Then a second search naming the companies from the **Applied** list in `jobs-log.md`, plus common ATS senders (`hibob`, `greenhouse`, `lever`, `ashby`, `workable`).

Read the rows with JavaScript rather than screenshots (strip URLs before returning text). Gmail lists move while loading: click rows by `find` ref, not by coordinates, or you may open the wrong email.

## Reading

- Opening an unread email marks it read. Tell the user which ones you opened; if you opened one by mistake, mark it unread again (the envelope icon in the email toolbar).
- Sort what you find: **needs an answer** (screening questions, interview invites) → **rejections** → **closed / "restart later"** → automated acknowledgements.
- Log outcomes in `application.md` and `jobs-log.md`.

## Answering a recruiter

1. **Check it's genuine**: expand the sender details. Look for the company's or its ATS's domain in "signed-by"/"mailed-by" and a sensible reply-to (ATS threads often use a per-thread reply address, which is fine).
2. **Draft from `facts.md` and `profile.md` only.** Answer every question they asked, in their order, with short labelled paragraphs. If an answer needs a fact you don't have, ask the user rather than guess.
3. **Describing the user's own project**: if they point you at a code folder, read it read-only (README, package.json, docs, a grep for the claimed technology). Describe what the code shows. If they call it something the code doesn't support ("it has RAG" with no embeddings or vector search anywhere), tell them and propose accurate wording; an interviewer will ask about it.
4. Humanize and fact-check (`references/humanize.md`).
5. **Put it in the thread as an unsent reply**: open the email, click Reply, then insert the text. Gmail's compose box often ignores simulated typing and `form_input`; this works reliably:
   ```js
   const b=document.querySelector('div[aria-label="Message Body"]'); b.focus();
   document.execCommand('insertText', false, text);
   ```
   Confirm it landed (read `b.innerText` length and look for "Draft saved"). If keystrokes went somewhere else, check Sent and the email's labels to be sure nothing was sent, archived or deleted.
6. Show the user the final text, ask "Send the reply to <name> at <company>?", and send only on their yes. After sending, wait out the undo window, confirm it shows in the thread, and log it.
