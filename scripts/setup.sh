#!/usr/bin/env bash
# One-time setup: gets a Cloudflare account ID and token from you, then creates
# the Pages project, sets the GitHub secret and variable, sets the contact form
# secrets and connects the domain. Safe to re-run; each step skips what exists.
set -euo pipefail

PROJECT=harris-interiors
CF=https://api.cloudflare.com/client/v4
cd "$(dirname "$0")/.."
REPO=$(git remote get-url origin 2>/dev/null | sed -E 's#^(git@github.com:|https://github.com/)##; s#\.git$##')

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
die() { printf '\033[31m%s\033[0m\n' "$*" >&2; exit 1; }
cf() { curl -sS -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$@"; }
envval() { [ -f .env ] && sed -n "s/^$1=//p" .env || true; }
# Prints the given field of a Cloudflare API response, or fails with its errors.
field() {
  python3 -c '
import json, sys
d = json.load(sys.stdin)
if not d.get("success"):
    sys.exit("Cloudflare API error: " + json.dumps(d.get("errors")))
v = d["result"]
for k in sys.argv[1].split(".") if sys.argv[1] else []:
    if isinstance(v, list):
        v = v[int(k)] if int(k) < len(v) else None
    else:
        v = v.get(k) if v else None
print("" if v is None else v)
' "${1:-}"
}
gh_() { GH_TOKEN=$(gh auth token --user JontiH) gh "$@"; }

[ -n "$REPO" ] || die "No git remote 'origin'. Create the GitHub repo first."

# 1. Account and token
ACCOUNT_ID=$(envval CLOUDFLARE_ACCOUNT_ID)
TOKEN=$(envval CLOUDFLARE_API_TOKEN)
DOMAIN=$(envval DOMAIN)
if [ -z "$ACCOUNT_ID" ]; then
  say "Step 1a: Cloudflare account"
  echo "The account ID is on the dashboard home page (Account home > the ... menu > Copy account ID)."
  read -rp "Account ID: " ACCOUNT_ID
  [ -n "$ACCOUNT_ID" ] || die "No account ID entered."
fi
if [ -z "$DOMAIN" ]; then
  read -rp "Site domain (e.g. example.com), blank to skip for now: " DOMAIN
fi
if [ -z "$TOKEN" ]; then
  if [ -n "$DOMAIN" ]; then
    perms='[{"key":"page","type":"edit"},{"key":"zone","type":"read"},{"key":"dns","type":"edit"}]'
    perm_text="Pages Edit, Zone Read, DNS Edit. Under Zone Resources pick 'Specific zone' -> $DOMAIN."
  else
    perms='[{"key":"page","type":"edit"}]'
    perm_text="Pages Edit. Add Zone Read and DNS Edit for the domain later, when it's on Cloudflare."
  fi
  url="https://dash.cloudflare.com/?to=/:account/api-tokens&permissionGroupKeys=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$perms")&name=$PROJECT"
  say "Step 1b: create a Cloudflare token"
  echo "Opening the dashboard with the permissions filled in: $perm_text"
  echo "Then Continue -> Create Token."
  echo
  echo "  $url"
  xdg-open "$url" >/dev/null 2>&1 || true
  echo
  read -rsp "Paste the token here (hidden): " TOKEN; echo
  [ -n "$TOKEN" ] || die "No token entered."
fi

status=$(cf "$CF/accounts/$ACCOUNT_ID/tokens/verify" | field status 2>/dev/null || cf "$CF/user/tokens/verify" | field status)
[ "$status" = active ] || die "Token is not active (status: $status)."
umask 077
printf 'CLOUDFLARE_API_TOKEN=%s\nCLOUDFLARE_ACCOUNT_ID=%s\nDOMAIN=%s\n' "$TOKEN" "$ACCOUNT_ID" "$DOMAIN" > .env
chmod 600 .env
echo "Token works. Saved to .env (gitignored)."

# 2. Pages project
say "Step 2: Pages project"
if [ -n "$(cf "$CF/accounts/$ACCOUNT_ID/pages/projects/$PROJECT" | field name 2>/dev/null)" ]; then
  echo "Already exists ($PROJECT.pages.dev)."
else
  cf -X POST "$CF/accounts/$ACCOUNT_ID/pages/projects" \
    -d "{\"name\":\"$PROJECT\",\"production_branch\":\"main\"}" | field name >/dev/null
  echo "Created $PROJECT."
fi

# 3. GitHub secret and variable
say "Step 3: GitHub secret and variable on $REPO"
printf '%s' "$TOKEN" | gh_ secret set CLOUDFLARE_API_TOKEN -R "$REPO"
gh_ variable set CLOUDFLARE_ACCOUNT_ID -R "$REPO" --body "$ACCOUNT_ID"
echo "Set. Pushes to main now deploy."

# 4. Contact form
say "Step 4: contact form email"
echo "Messages from the contact form are emailed through Resend (resend.com) to these addresses."
read -rp "Send messages to (commas for several), blank to keep the current one: " TO
read -rsp "Resend API key (hidden), blank to keep the current one: " RESEND; echo
vars=$(TO="$TO" RESEND="$RESEND" python3 -c '
import json, os
v = {}
if os.environ["TO"]: v["CONTACT_TO"] = {"type": "secret_text", "value": os.environ["TO"]}
if os.environ["RESEND"]: v["RESEND_API_KEY"] = {"type": "secret_text", "value": os.environ["RESEND"]}
print(json.dumps({"deployment_configs": {"production": {"env_vars": v}}}))
')
cf -X PATCH "$CF/accounts/$ACCOUNT_ID/pages/projects/$PROJECT" -d "$vars" | field name >/dev/null
echo "Saved. They take effect on the next deploy."

# 5. Custom domain
say "Step 5: custom domain"
if [ -z "$DOMAIN" ]; then
  echo "No domain set. Add DOMAIN= to .env and re-run once the domain is on Cloudflare."
else
  ZONE_ID=$(cf "$CF/zones?name=$DOMAIN" | field 0.id)
  if [ -z "$ZONE_ID" ]; then
    echo "No $DOMAIN zone visible to this token yet. Re-run once the domain shows up in Cloudflare."
  else
    for host in "$DOMAIN" "www.$DOMAIN"; do
      if [ -z "$(cf "$CF/zones/$ZONE_ID/dns_records?type=CNAME&name=$host" | field 0.id)" ]; then
        cf -X POST "$CF/zones/$ZONE_ID/dns_records" \
          -d "{\"type\":\"CNAME\",\"name\":\"$host\",\"content\":\"$PROJECT.pages.dev\",\"proxied\":true}" | field id >/dev/null
        echo "Added CNAME $host -> $PROJECT.pages.dev."
      fi
      if [ -z "$(cf "$CF/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains/$host" 2>/dev/null | field name 2>/dev/null)" ]; then
        cf -X POST "$CF/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains" -d "{\"name\":\"$host\"}" | field name >/dev/null
      fi
      echo "$host attached to the Pages project."
    done
  fi
fi

say "Done."
