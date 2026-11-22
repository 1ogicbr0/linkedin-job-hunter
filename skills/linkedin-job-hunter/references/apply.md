# Applying

## Check the route before typing anything

After clicking an external "Apply", read the final URL (`tabs_context_mcp` shows new tabs). LinkedIn sometimes routes through a redirector (for example easyapply.jobs); follow it to the real form.

Fill only when the domain is the company's own site or a known applicant-tracking system: `greenhouse.io`, `lever.co`, `ashbyhq.com`, `workable.com`, `careers.hibob.com`, `bamboohr.com`, `smartrecruiters.com`, `recruitee.com`, `teamtailor.com`, `breezy.hr`, `jobvite.com`, `personio`, `rippling.com`, `wellfound.com`.

Stop and show the user the link when it's a URL shortener, a domain unrelated to the company, or a page asking for payment, bank details or ID documents.

The user does these themselves: any site that needs an account or password first (Workday, Taleo, iCIMS, SuccessFactors, Oracle), any CAPTCHA, any ID or financial details. If an account wall appears halfway, say exactly where it stopped.

## Filling forms

- Text fields: `find` the field, then `form_input` with its ref. It's more reliable than clicking and typing.
- Custom dropdowns (country, language, currency): click to open, type to filter, click the option, then read the field back.
- **Date pickers with an input mask** (HiBob and others): typing into them can corrupt the field and swallow later keystrokes into the wrong place (seen: "01/01/2026GBP"). Clear the field with its X, open the calendar and click the day.
- **File upload**: "Add file" usually opens a dialog containing an `input[type=file]`. `find` it, use `file_upload` with the absolute path, then click the dialog's Done/Save.
- Upload the DOCX when the form accepts it (ATS parsers read it better), else the PDF.
- Voluntary self-identification (gender, ethnicity, veteran, disability): "Prefer not to say" unless the user says otherwise.
- Untick "Follow <company>" on the Easy Apply review step.
- Salary: use the figure the user set for this kind of role in `profile.md`; if a new currency/country, ask.
- Right to work / sponsorship: answer plainly and honestly in the user's agreed wording (for example: "No current right to work in <country>; I would need <visa> sponsorship and can start once the visa is approved").

## Before Submit

Read the whole form back (scroll through it), then show the user:

- job title, company, link
- the domain it submits to
- every field and its value
- the CV file uploaded, and what was tailored
- the cover note / free-text answers (humanized and fact-checked)

Ask "Submit the application to <Company> for <Role>?" and end the turn. Only their explicit yes in chat counts.

## After Submit

- Click Submit once. Read the confirmation; screenshot it.
- If it fails (validation error, expired session), report the exact message. Don't retry blindly.
- Log under **Applied** in `jobs-log.md`: `- <date>: <Title> at <Company> (<place>), <link>, submitted via <Easy Apply | domain>, application file: <path>`.
- Set `Status: SUBMITTED <date time>` in `application.md`.
- If LinkedIn later asks "Did you apply?", answer only once the user has actually submitted.

## Tailoring the CV

`scripts/cv-builder/build.js` builds a 1-page A4 DOCX and PDF from a JSON file (see `templates/cv.example.json`).

```bash
cd <skill>/scripts/cv-builder && npm install   # first time only
node <skill>/scripts/cv-builder/build.js <application-folder>/cv.json <application-folder>
```

Tailoring means reordering and rewording true content so the first lines a recruiter reads match the job: summary leads with the job's core stack, the most relevant bullets move up, a skills row can be added or renamed. It never means adding skills, employers, metrics or dates that aren't in `facts.md`. Note in `application.md` what changed and what was deliberately not claimed (gaps).
