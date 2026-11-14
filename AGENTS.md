# AGENTS.md

Portfolio site for Harris Interiors, Mel Harris's interior design studio. Static HTML, CSS
and JS in `public/`, no build step, served by Cloudflare Pages. One Pages
Function handles the contact form. The name, domain and copy are
placeholders until she picks them.

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
- `functions/api/contact.js`: emails form messages through Resend to
  `CONTACT_TO`, with Reply-To set to the visitor. Spam protection is a
  hidden honeypot field only.
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
| Account | not created yet |
| Pages project | `harris-interiors` (`harris-interiors.pages.dev`) |
| Pages secrets | `CONTACT_TO`, `RESEND_API_KEY` |
| `wrangler.toml` vars | `EMAIL_FROM` (placeholder address) |

`scripts/setup.sh` does the one-time setup and is safe to re-run: asks for
the account ID and a token (Pages Edit, Zone Read, DNS Edit), creates the
Pages project, sets the `CLOUDFLARE_API_TOKEN` secret and
`CLOUDFLARE_ACCOUNT_ID` variable on the GitHub repo, sets the contact form
secrets and points the domain and `www` at Pages. It writes `.env`
(gitignored). The CNAME step fails if the domain already has an A record at
the apex from an old host; delete that record first.

Pushes to `main` run `.github/workflows/deploy.yml`:
`scripts/stamp-assets.sh` adds `?v=<sha>` to every script and stylesheet
URL (Cloudflare's default browser cache TTL would otherwise keep old JS and
CSS for 4 hours), then `wrangler pages deploy`. The job is skipped until the
`CLOUDFLARE_ACCOUNT_ID` variable exists.

`EMAIL_FROM` must be on a domain verified in Resend. When the domain moves
to Cloudflare, copy over any existing MX records so her current email keeps
working.

## Local dev

```bash
docker compose up -d        # http://localhost:8788
```

Host Node is too old for wrangler, so it runs in `node:22-slim`. Without
`RESEND_API_KEY`, on localhost the contact form prints messages to the
logs. Keep the empty `.dev.vars` (gitignored); without it wrangler loads
`.env`, with the API token, into the Function.
