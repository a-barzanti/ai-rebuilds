# Promotion plan

How to get AI Rebuilds in front of people, what has been done, and ready-to-paste posts.
Last reviewed 29 Oct 2026.

## Done

| What | Where | Status (29 Oct 2026) |
| ---- | ----- | -------------------- |
| Repo description, homepage and 12 topics (`awesome-list`, `reverse-engineering`, `clean-room`…) | GitHub repo settings | Done |
| README turned into an awesome-list, generated from `data/projects.json` | `README.md` | Done |
| Social preview image, favicon, touch icon, sitemap, `robots.txt` | `assets/`, site root | Done |
| Related directories credited on the site and in the README | `data/projects.json` → `related` | Done |
| Pull request: add to "Related lists" | [morluto/awesome-reverse-engineering#29](https://github.com/morluto/awesome-reverse-engineering/pull/29) | Open |
| Pull request: add to "Other lists" | [bobeff/open-source-games#147](https://github.com/bobeff/open-source-games/pull/147) | Open |
| Suggestion issue for "Related Collections" | [reacher-z/Awesome-REA#2547](https://github.com/reacher-z/Awesome-REA/issues/2547) | Open |

Check these from time to time and answer reviewers quickly. Once both pull requests are closed, delete the forks
`a-barzanti/awesome-reverse-engineering` and `a-barzanti/open-source-games`.

## To do

- [ ] **Upload the social preview.** Go to [repo settings](https://github.com/a-barzanti/ai-rebuilds/settings) → General → Social preview → Edit → Upload `assets/social-preview.png`.
  GitHub has no API for this.
- [ ] **Turn on analytics.** Create a free GA4 property at analytics.google.com with a web stream for
  `https://ai-rebuilds.com`. Put the Measurement ID (`G-…`) in `GA_ID` in `assets/js/analytics.js` and push.
  Do this before the posts below, so you can see what they bring in.
- [ ] **Google Search Console.** Add `ai-rebuilds.com` as a domain property, then add the TXT record it gives you in
  the IONOS DNS settings. Submit `https://ai-rebuilds.com/sitemap.xml`.
- [ ] **Hacker News**, then **Reddit**, then **X / Bluesky**. Drafts are below.
- [ ] **Keep the list growing.** New entries each week give people a reason to come back and give you something new to post.

## Posts

### Hacker News

Submit at <https://news.ycombinator.com/submit>. Post on a weekday between 8 and 10 in the morning, US Eastern time
(14:00–16:00 in Italy). Stay around for the first two hours to answer comments.

- **Title:** `Show HN: AI Rebuilds – a tracked list of software rebuilt by AI agents and clean-room teams`
- **URL:** `https://ai-rebuilds.com`
- **First comment:**

> AI agents are now rebuilding Photoshop clones, finishing N64 decompilations and porting browser engines. I wanted
> one place that tracks these projects next to the clean-room classics that came before them (Phoenix BIOS, Wine,
> Photopea). There are 81 entries. Each says what it rebuilds, how, and whether AI was involved, and stars and activity
> refresh weekly. The data is one JSON file, so pull requests are welcome.

### Reddit

Post a day or two apart, and read each subreddit's rules first. Some only allow self-promotion on certain days or
expect you to take part in the community as well.

| Subreddit | Title |
| --------- | ----- |
| r/ReverseEngineering | A tracked list of AI-assisted decompilations, engine reimplementations and clean-room rebuilds, with method and AI labels |
| r/opensource | AI Rebuilds: an open, one-JSON-file list of software and games rebuilt from the outside in (PRs welcome) |
| r/ClaudeAI | From PhotoCraft to Snowboard Kids 2: a list of software rebuilt with Claude and other agents |
| r/decomps or r/emulation | Decompilations, recompilations and PC ports, many finished with AI help, in one searchable list |

### X / Bluesky / Mastodon

> Software and games, rebuilt from the outside in. 81 projects, from the 1984 Phoenix BIOS to apps written by AI
> agents last month, each labelled by method and AI involvement. Updated weekly. https://ai-rebuilds.com

Attach `assets/social-preview.png` if the link card doesn't load.

### Follow-ups that work well

- **Filtered links.** The site keeps filters in the URL, so you can share exactly the slice you're talking about.
  - Only AI-built projects: <https://ai-rebuilds.com/?ai=built>
  - Only game decompilations: <https://ai-rebuilds.com/?category=ai-games>
  - Search "photoshop": <https://ai-rebuilds.com/?q=photoshop>
- **Weekly "new on the list" post.** Write one short post per week naming the entries added that week.
- **Write-up.** A blog post on dev.to or Medium about the AI clean-room question: the chardet dispute, ArtCraft and
  decomp.dev closing its index. Link the list as the source.

## Other lists to approach later

Wait until the open pull requests are answered, and follow each list's contribution guide.

| List | Why it fits | Note |
| ---- | ----------- | ---- |
| [replicraft/remade](https://github.com/replicraft/remade) (remade.wiki) | Directory of reimplementations of closed-source apps | Ask whether they link other directories |
| [SubmitGame/awesome-decomp-games](https://github.com/SubmitGame/awesome-decomp-games) | Game reconstruction index | Generated list, check whether it has a "related" section |
| [Sebastrion/awesome-unofficial-pc-ports](https://github.com/Sebastrion/awesome-unofficial-pc-ports) | PC ports of console games | |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Large audience | Only a fit for the REA guide as a workflow resource, not for the list itself |
| [kaixinbaba/awesome-rea](https://github.com/kaixinbaba/awesome-rea) | REA reconstructions | Skipped: lists individual projects with cover images, not directories |

## Don't

- Don't post the same link to many places on the same day. It reads as spam and can get the domain flagged.
- Don't open issues on listed projects to tell them they're listed.
- Don't buy stars, upvotes or followers.
