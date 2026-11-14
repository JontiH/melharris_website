# AGENTS.md

Portfolio site for Harris Interiors, Mel Harris's interior design studio. Static HTML, CSS
and JS in `public/`, no build step and no server code, served by Cloudflare
Pages. The domain and copy are placeholders until she picks them.

## Layout

- `public/assets/site.js`: studio details (`SITE`: name, email, city,
  Instagram), the header and footer every page renders, the `picture()`
  helper and the scroll-in fade (`.reveal`).
- `public/assets/projects.js`: the portfolio. Each project has a slug,
  facts, text and a list of images. An image without `src` renders as a
  cartoon house (`placeholder.js`) in the project's `house` colour; add
  real photos under `public/images/<slug>/` and set `src`.
- `public/portfolio/project.html`: one page for every project.
  `_redirects` rewrites `/portfolio/<slug>` to it and `project.js` reads
  the slug from the path. Unknown slugs bounce to `/portfolio/`.
- `public/assets/contact.js`: the contact form opens the visitor's mail
  app with the message filled in, addressed to `SITE.email`. Nothing is
  sent from the site.
- Fonts (Cormorant Garamond, Jost) are self-hosted in `assets/fonts/`;
  `_headers` sets a CSP that allows only same-origin scripts, fonts and
  requests.

The page title and description in each HTML `<head>` repeat the studio
name, so a rename touches those as well as `SITE.name`.

## Git

Personal repo. Local git config sets `user.name = JontiH` and pushes over
SSH with `~/.ssh/JontiH`. Run `gh` with
`GH_TOKEN=$(gh auth token --user JontiH)`.

## Cloudflare

| Name | Value |
|------|-------|
| Account | `7679249973b3ca7cd658c198c69e1e5e` (Jonti's, shared with his other sites; move to her own account later) |
| Pages project | `harris-interiors` (`harris-interiors.pages.dev`) |

`scripts/setup.sh` does the one-time setup and is safe to re-run: asks for
the account ID and a token for this project only (Pages Edit, plus Zone Read and DNS Edit once a domain is set), creates the
Pages project, sets the `CLOUDFLARE_API_TOKEN` secret and
`CLOUDFLARE_ACCOUNT_ID` variable on the GitHub repo, and points the domain and `www` at Pages. It writes `.env`
(gitignored). The CNAME step fails if the domain already has an A record at
the apex from an old host; delete that record first.

Pushes to `main` run `.github/workflows/deploy.yml`:
`scripts/stamp-assets.sh` adds `?v=<sha>` to every script and stylesheet
URL (Cloudflare's default browser cache TTL would otherwise keep old JS and
CSS for 4 hours), then `wrangler pages deploy`. The job is skipped until the
`CLOUDFLARE_ACCOUNT_ID` variable exists.

When the domain moves to Cloudflare, copy over any existing MX records so her current email keeps
working.

## Local dev

```bash
docker compose up -d        # http://localhost:8788
```

Host Node is too old for wrangler, so it runs in `node:22-slim`.
