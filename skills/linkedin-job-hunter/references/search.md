# Searching LinkedIn

Last verified: November 2026. LinkedIn changes its markup often; if a snippet returns nothing, fall back to `get_page_text` and update this file.

## Search URL

LinkedIn's job search is now an AI-powered page. The old filter parameters (`f_WT`, `f_TPR`, `f_JT`, `sortBy`) are ignored, and a missing `geoId` defaults to the account's own city. Put filters into the natural-language `keywords` instead:

```
https://www.linkedin.com/jobs/search-results/?keywords=<url-encoded query>&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&geoId=<geoId>
```

Example query text: `full stack engineer React Node.js TypeScript visa sponsorship posted in the past 24 hours`.

Good query ingredients: role + 2–3 core skills + one eligibility phrase (`visa sponsorship`, `relocation`, `remote worldwide`, `remote <country>`) + time window (`posted in the past 24 hours` / `past week`).

### geoId values that have worked

| Location | geoId |
|---|---|
| Worldwide | 92000000 (often falls back to the account's country; prefer a country) |
| United Kingdom | 101165590 |
| Netherlands | 102890719 |
| Germany | 101282230 |
| Ireland | 104738515 |
| Pakistan | 101022442 |
| United States | 103644278 |
| India | 102713980 |

For another country, type it into LinkedIn's location box once and copy the `geoId` from the URL.

## Reading the result list

The result cards are `div[role="button"]` elements whose `componentkey` starts with `job-card-component-ref-`; the job ID is the suffix. The list lazy-loads, so scroll its scroll container first. Store the snippet in `localStorage` once so it survives navigation, then `await eval(...)` it on each results page.

JavaScript output from the Chrome tool is cut at about 1,000 characters, so keep the result in `window.__x` and read it in slices: `window.__x.slice(0,950)`, `slice(950,1900)`, …

```js
localStorage.setItem('jh_grab', `(async()=>{
  const seen=new Set((localStorage.getItem('jh_seen')||'').split(',').filter(Boolean));
  const cards=()=>[...document.querySelectorAll('div[role="button"][componentkey^="job-card-component-ref-"]')];
  let sc=cards()[0];
  while(sc&&sc.parentElement&&!(sc.scrollHeight>sc.clientHeight+20&&getComputedStyle(sc).overflowY!='visible')) sc=sc.parentElement;
  for(let i=0;i<6;i++){ if(sc) sc.scrollTop+=1500; await new Promise(r=>setTimeout(r,700)); }
  const re=/engineer|developer|full.?stack|front.?end|back.?end|software|react|node|typescript|programmer/i;
  const out=cards().map(c=>({id:c.getAttribute('componentkey').replace('job-card-component-ref-',''),
    t:c.innerText.replace(/\\s+/g,' ').replace(/\\(Verified job\\)/g,'').slice(0,150)}))
    .filter(x=>re.test(x.t)&&!seen.has(x.id));
  window.__x=out.map(x=>x.id+' | '+x.t).join('\\n');
  return [cards().length,out.length];
})()`);
```

Run on each results page: `await eval(localStorage.getItem('jh_grab'))`. Adjust the title regex `re` to the user's field.

After a run, add every ID you checked to the seen-list so the next run skips them:

```js
const add=['<id1>','<id2>'];
const s=new Set((localStorage.getItem('jh_seen')||'').split(',').filter(Boolean));
add.forEach(x=>s.add(x)); localStorage.setItem('jh_seen',[...s].join(',')); s.size
```

`jobs-log.md` is still the source of truth (localStorage is per browser).

## Reading a job page

Open `https://www.linkedin.com/jobs/view/<id>/`. This reader returns the top card (company, place, age, applicant count, Easy Apply vs Apply) and only the description lines that matter for vetting:

```js
localStorage.setItem('jh_read', `(()=>{
  const m=(document.querySelector('main')||document.body).innerText.replace(/https?:\\S+/g,'');
  const i=m.indexOf('About the job');
  const top=m.slice(0,Math.max(0,i)).replace(/\\s+/g,' ').replace(/Promoted by hirer.*|Use AI to assess.*/,'').slice(-400);
  let d=m.slice(i); const j=d.search(/About the company|Set alert for similar jobs/); if(j>0) d=d.slice(0,j);
  const keep=d.split('\\n').map(s=>s.trim()).filter(s=>s&&/visa|sponsor|relocat|remote|located|eligib|right to work|authori|based in|time ?zone|utc|gmt|cet|years|salary|hybrid|office|language|fluent/i.test(s)).map(s=>s.slice(0,160)).slice(0,10);
  return 'TOP: '+top+'\\n'+keep.join('\\n');
})()`);
```

Run: `eval(localStorage.getItem('jh_read'))`. For the full description (to judge fit or language), slice `main.innerText` between "About the job" and "About the company".

Why the URL stripping: the Chrome tool blocks JavaScript output that contains URLs with query strings ("[BLOCKED: Cookie/query string data]"), so remove URLs before returning text.

## What the numbers mean

- "Over 100 applicants" / "Over 100 people clicked apply" → skip by default.
- "Reposted" means the clock restarted; the applicant count usually didn't.
- "Responses managed off LinkedIn" → external ATS.
- Strong jobs pass 100 applicants within 2–5 days, so daily runs with a 24-hour window find far more usable jobs than weekly runs.
