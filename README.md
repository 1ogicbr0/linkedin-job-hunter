# LinkedIn Job Hunter: a Claude skill

A [Claude](https://claude.com/claude-code) skill that runs a careful, end-to-end job hunt in your own signed-in Chrome:

- **Find**: searches LinkedIn for fresh roles that match your stack and where you can legally work, skips jobs with 100+ applicants, region-locked "remote", language requirements and scams, and reports matches with links.
- **Apply**: tailors a 1-page CV per job (DOCX + PDF), drafts answers only from facts you've approved, optionally humanizes them and fact-checks the result, fills Easy Apply or the company's ATS form (Greenhouse, Lever, Ashby, Workable, HiBob…), and **stops before Submit** until you say yes.
- **Follow up**: checks your inbox for recruiter replies, sorts rejections from questions, drafts answers, and sends only on your yes.
- **Keep records**: a single log of every job seen and every application, plus a folder per application with the exact answers and CV sent.

It was built and refined over a few weeks of real use: dozens of searches, 20+ applications, recruiter screening emails. The lessons from that (LinkedIn's new search page, ATS form quirks, humanizers inventing claims) are baked into the instructions.

## What you need

- **Claude Code** (CLI or desktop app) or another Claude client that supports skills.
- **[Claude in Chrome](https://claude.com/chrome)**, the browser extension, connected to the Chrome where you're signed in to LinkedIn and your email.
- **Node.js 18+** and **Google Chrome/Chromium** for the CV builder (PDF output).
- *Optional:* an account with a web AI humanizer (tested with isgen.ai).

## Install

Copy the skill folder into your skills directory:

```bash
# for all your projects
cp -r skills/linkedin-job-hunter ~/.claude/skills/

# or just one project
cp -r skills/linkedin-job-hunter <your-project>/.claude/skills/
```

Then install the CV builder's one dependency:

```bash
cd ~/.claude/skills/linkedin-job-hunter/scripts/cv-builder && npm install
```

## First run

Ask Claude something like *"set up my job hunt"* or just *"find me jobs"*. It creates a `job-hunt/` folder from the templates and walks you through:

- `profile.md`: contact details, salary, notice period, which countries you can work in or would move to, your stack and level.
- `facts.md`: the only claims Claude may make about you. Be precise here; it's what keeps applications honest.
- `cv/cv-base.json`: your base CV (see `templates/cv.example.json`).

## Example prompts

- "Scan LinkedIn for full-stack jobs in the UK and Netherlands posted in the last 24 hours"
- "Apply to the second one"
- "Tailor my CV for this job: https://www.linkedin.com/jobs/view/1234567890/"
- "Did anyone reply to my applications this week?"
- "Draft an answer to the recruiter's questions from Acme" *(Claude drafts, you approve, then it sends)*

## Safety and your account

- Claude never types passwords, creates accounts, solves CAPTCHAs, or enters ID or bank details. You do those.
- Nothing is submitted or sent without your explicit yes for that specific job or email.
- LinkedIn is browsed at a human pace (about 15 page loads per run), read-only while searching, in a separate tab.
- Automating any website can conflict with its terms of service. LinkedIn's User Agreement restricts automated access; use this as an assistant you supervise, not a bot you leave running, and at your own risk.
- Your personal files (`job-hunt/`, CVs) are git-ignored here; don't commit them to a public repo.

## Layout

```
skills/linkedin-job-hunter/
├── SKILL.md                 # the workflow Claude follows
├── references/
│   ├── search.md            # LinkedIn search URLs, location IDs, page-reading snippets
│   ├── apply.md             # ATS route checks, form quirks, CV tailoring
│   ├── humanize.md          # optional humanizer step + the fact-check it needs
│   └── inbox.md             # finding replies and answering recruiters
├── templates/               # profile, facts, jobs log, example CV
└── scripts/cv-builder/      # node build.js <cv.json> <out-dir> → DOCX + PDF
```

## Contributing

LinkedIn changes its markup often. If a snippet in `references/search.md` stops working, open an issue or a PR with the fix and the date you verified it.

## License

MIT
