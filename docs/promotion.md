# Promotion plan

How to get AI Rebuilds in front of people, what has been done, and ready-to-paste posts.
Last reviewed 16 Nov 2026.

## Done

| What | Where | Status (16 Nov 2026) |
| ---- | ----- | -------------------- |
| Repo description, homepage and 12 topics (`awesome-list`, `reverse-engineering`, `clean-room`…) | GitHub repo settings | Done |
| README turned into an awesome-list, generated from `data/projects.json` | `README.md` | Done |
| Social preview image, favicon, touch icon, sitemap, `robots.txt` | `assets/`, site root | Done |
| Related directories credited on the site and in the README | `data/projects.json` → `related` | Done |
| Pull request: add to "Related lists" | [morluto/awesome-reverse-engineering#29](https://github.com/morluto/awesome-reverse-engineering/pull/29) | Merged 30 Oct 2026 |
| Pull request: add to "Other lists" | [bobeff/open-source-games#147](https://github.com/bobeff/open-source-games/pull/147) | Open, no reply yet. The repo last merged a pull request in Feb 2026 and has 30 open |
| Suggestion issue for "Related Collections" | [reacher-z/Awesome-REA#2547](https://github.com/reacher-z/Awesome-REA/issues/2547) | Accepted 4 Nov 2026. Listed in the README and at [awesomerea.org](https://awesomerea.org/resources/ai-rebuilds-directory/) |
| Idea posted: a "related directories" section | [replicraft/remade#354](https://github.com/replicraft/remade/discussions/354) | Open since 16 Nov 2026 |
| Atom feed of new entries, linked from every page | [`feed.xml`](https://ai-rebuilds.com/feed.xml) | Live since 16 Nov 2026 |
| "Listed on AI Rebuilds" badge with copy-paste snippets | [Contribute page](https://ai-rebuilds.com/contribute/#badge), `assets/badge.svg` | Live since 16 Nov 2026. Offered on the site only; don't ask projects to add it |
| First outside suggestion (pgrust) answered and added | [#1](https://github.com/a-barzanti/ai-rebuilds/issues/1) | Done 16 Nov 2026 |

Check the open pull request from time to time and answer reviewers quickly. The fork
`a-barzanti/awesome-reverse-engineering` was deleted on 16 Nov 2026, after its pull request was merged. Keep
`a-barzanti/open-source-games` until #147 is closed, then delete it too.

Answer new issues within a few days. The first suggestion waited two weeks.

## Numbers

| Measure | 16 Nov 2026 | 19 Nov 2026 |
| ------- | ----------- | ----------- |
| Projects listed | 82 | 84 |
| GitHub stars | 9 | 13 |
| Repo views, last 14 days (GitHub traffic) | 505 views, 309 unique | 550 views, 323 unique |
| Top referrers to the repo | github.com 97, Google 77, ai-rebuilds.com 12 | not recorded |
| Site visits | Not measured, analytics is still off | Analytics on from 19 Nov |

GitHub keeps traffic for 14 days only, so copy the figures here at each review. Two other repos picked the
site up without being asked: `flexdinero/REA-Playbook` and `miles990/rea-case-rankings`.

## To do

- [x] **Social preview.** Uploaded by 19 Nov 2026; GitHub serves `assets/social-preview.png` as the repo's link card.
- [x] **Analytics.** On since 19 Nov 2026, through Google Tag Manager container `GTM-MSJT73V2`, whose GA4 tag
  sends to `G-CYQHS3F65L`. It loads only after a visitor chooses Allow. The ID is `TAG_ID` in `assets/js/analytics.js`.
- [x] **Google Search Console.** Verified on 19 Nov 2026 as a URL-prefix property for `https://ai-rebuilds.com/`,
  with `google1f29e96c426cae2c.html` at the site root (keep that file, or verification lapses). Sitemap submitted.
- [ ] **Hacker News**, then **Reddit**, then **X / Bluesky**. Drafts are below. Nothing is on Hacker News yet.
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
> Photopea). There are 84 entries. Each says what it rebuilds, how, and whether AI was involved, and stars and activity
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

> Software and games, rebuilt from the outside in. 84 projects, from the 1984 Phoenix BIOS to apps written by AI
> agents last month, each labelled by method and AI involvement. Updated weekly. https://ai-rebuilds.com

Attach `assets/social-preview.png` if the link card doesn't load.

### New this week: pgrust

Drafted 16 Nov 2026. Post it within a few days, while the entry is new.

Short, for X / Bluesky / Mastodon:

> New on AI Rebuilds: pgrust, a Rust reimplementation of PostgreSQL built by one developer directing coding agents,
> mainly Codex. It speaks the Postgres wire protocol and is in beta. Suggested by a reader.
> https://ai-rebuilds.com/#pgrust

Longer, for LinkedIn or a subreddit that allows it:

> **New on AI Rebuilds: Postgres, rebuilt in Rust by coding agents**
>
> A reader suggested pgrust this month and it is now on the list.
>
> Michael Malis started it in April 2026. He chose to write every component from scratch in Rust instead of
> replacing Postgres piece by piece, and he says coding agents, mainly Codex, did most of the building while he set
> the direction. Two weeks in, he reported 250,000 lines of Rust passing a third of the Postgres regression tests.
>
> Seven months later it is at v0.4-beta. It is wire compatible with Postgres, ships its own `postgres`, `initdb`
> and `psql`, and runs in the browser as WebAssembly. The project says it has formally verified 1,397 of the 3,400
> user-facing Postgres functions against the original.
>
> It is still a beta, and the authors say themselves that passing a test suite does not make the code correct.
>
> Entry: https://ai-rebuilds.com/#pgrust
> All AI-built projects on the list: https://ai-rebuilds.com/?ai=built

The figures come from the pgrust README and the author's write-up. Check them again if you post later than November.

### Newsletter pitch

Send to one newsletter at a time, through its own tip form or address, and change the first line to fit it.
Candidates: Console.dev, Changelog News, TLDR, Hacker Newsletter. Check each one's submission page first. Some only
take tools, and Hacker Newsletter picks from Hacker News, so the Show HN post has to come first for that one.

- **Subject:** `A tracked list of software rebuilt by AI agents (84 projects, open data)`

> Hi,
>
> A link your readers might like: AI Rebuilds, https://ai-rebuilds.com
>
> It is a list of 84 projects that rebuild existing software and games. Coding agents are now producing Photoshop
> clones, a C compiler that builds the Linux kernel and a Rust reimplementation of Postgres. The list puts them next
> to the clean-room work that came before, such as the Phoenix BIOS, Wine and Photopea.
>
> Each entry says what it rebuilds, how, and whether AI was involved, in the authors' own terms. Stars and
> activity refresh weekly. The data is one JSON file on GitHub and there is an Atom feed of new entries.
>
> It is a personal project with no ads and nothing to sell.
>
> Repo: https://github.com/a-barzanti/ai-rebuilds
> Feed: https://ai-rebuilds.com/feed.xml
>
> Thanks,
> Alessandro

### Follow-ups that work well

- **Filtered links.** The site keeps filters in the URL, so you can share exactly the slice you're talking about.
  - Only AI-built projects: <https://ai-rebuilds.com/?ai=built>
  - Only game decompilations: <https://ai-rebuilds.com/?category=ai-games>
  - Search "photoshop": <https://ai-rebuilds.com/?q=photoshop>
- **Weekly "new on the list" post.** Write one short post per week naming the entries added that week.
- **Write-up.** A blog post on dev.to or Medium about the AI clean-room question: the chardet dispute, ArtCraft and
  decomp.dev closing its index. Link the list as the source.

## Other lists

Reviewed on 16 Nov 2026. Follow each list's contribution guide.

| List | Decision | Why |
| ---- | -------- | --- |
| [replicraft/remade](https://github.com/replicraft/remade) (remade.wiki) | Asked, see "Done" | It has no section for other directories, so the ask is a discussion, not a catalog suggestion |
| [Sebastrion/awesome-unofficial-pc-ports](https://github.com/Sebastrion/awesome-unofficial-pc-ports) | Ask in Feb 2027 | The maintainer told another new catalog (issue #19) that he will wait a few months to see whether it stays maintained. This list was 18 days old at the review |
| [SubmitGame/awesome-decomp-games](https://github.com/SubmitGame/awesome-decomp-games) | Skipped | It has no "related" section, only data sources. It already has every game on this list except OpenLara, which it excludes on purpose. It also marks down projects that a source flags as AI-generated, so becoming a source would hurt the projects listed here |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Later | Large audience. Only a fit for the REA guide as a workflow resource, not for the list itself |
| [kaixinbaba/awesome-rea](https://github.com/kaixinbaba/awesome-rea) | Skipped | Lists individual projects with cover images, not directories |

## Don't

- Don't post the same link to many places on the same day. It reads as spam and can get the domain flagged.
- Don't open issues on listed projects to tell them they're listed.
- Don't buy stars, upvotes or followers.
