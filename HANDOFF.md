# Handoff — deploy Red Bank Outfitters to GitHub Pages (new repo)

You are deploying a **preview** of the Red Bank Outfitters website to GitHub Pages. Derik asked for this. Do it. Do not wait for more permission.

This is **not** the live site. The live site stays at https://redbankhunting.com until the client says go.

---

## What this is

A 25-page static luxury hunting-ranch site.

| | |
|---|---|
| Local path | `/Users/derikbannister9/red-bank-outfitters/` |
| Generator | `build.py` writes every `.html` plus `robots.txt`, `sitemap.xml`, `llms.txt` |
| Stack | Flat HTML + `styles.css` + `script.js` + `img/`. No Jekyll, no npm, no framework |
| GitHub org | `bannisterderik-tech` (already authenticated via `gh`) |
| Git identity | Derik Bannister |

Existing Red Bank repos you must **not** use or push to:

- `bannisterderik-tech/red-bank-lodge` — rendering set, private
- `bannisterderik-tech/red-bank-lodge-preview` — lodge walkthrough preview

**New repo name:** `red-bank-outfitters`

**Preview URL:** `https://bannisterderik-tech.github.io/red-bank-outfitters/`

---

## Hard rules

1. **Keep it a preview.** Every HTML file has `<meta name="robots" content="noindex,nofollow">`. `robots.txt` is `User-agent: *` / `Disallow: /`. Leave both. This site must not compete with `redbankhunting.com`.
2. **Do not touch the live WordPress site.** No DNS, no CNAME, no custom domain, no Search Console, no replacing `redbankhunting.com`.
3. **Do not convert links to root-absolute paths** (`href="/lodge.html"`). All in-page links are relative (`lodge.html`, `../img/mark.svg`). That is why project Pages works without a `BASE` prefix. If you add a leading slash, the GitHub Pages project URL will 404.
4. **Do not run `python3 build.py` unless you are changing copy.** It overwrites every HTML file. The current generated HTML is the source of truth to ship.
5. **Do not commit `img/src/`.** Those are raw WordPress downloads. The web-sized files live in `img/*.jpg` and `img/mark.svg`.
6. **Do not put this in `db-demos/`.** Own repo.

---

## Step 1 — gitignore, then init

```bash
cd /Users/derikbannister9/red-bank-outfitters

cat > .gitignore <<'EOF'
.DS_Store
img/src/
*.pyc
__pycache__/
EOF

# GitHub Pages serves this as static HTML. Stop Jekyll from touching it.
touch .nojekyll

git init -b main
git add .
git status   # confirm img/src is NOT staged; HTML/CSS/JS/img/*.jpg/img/mark.svg ARE
```

Expected staged: `index.html`, the other 24 HTML files, `styles.css`, `script.js`, `build.py`, `README.md`, `HANDOFF.md`, `robots.txt`, `sitemap.xml`, `llms.txt`, `.nojekyll`, `.gitignore`, `img/*.jpg`, `img/mark.svg`, `upland/`, `hunts/`.

---

## Step 2 — create the repo and push

```bash
git commit -m "Preview: Red Bank Outfitters luxury rebuild (noindex)"

gh repo create bannisterderik-tech/red-bank-outfitters \
  --public \
  --source=. \
  --remote=origin \
  --description "Red Bank Outfitters — Red Bluff, CA. Luxury preview rebuild of redbankhunting.com (noindex, not the live site)." \
  --push
```

If `gh repo create --push` complains because origin already exists, set origin and push:

```bash
git remote add origin git@github.com:bannisterderik-tech/red-bank-outfitters.git
git push -u origin main
```

---

## Step 3 — enable GitHub Pages from `main` / root

Project Pages, not user Pages. Source = `main` branch, folder = `/` (root). Workflow build type.

```bash
gh api -X POST repos/bannisterderik-tech/red-bank-outfitters/pages \
  -f build_type=workflow \
  -F 'source[branch]=main' \
  -F 'source[path]=/'
```

If that 422s because Pages isn't fully provisioned yet, use the GitHub UI equivalent: **Settings → Pages → Build and deployment → Source: GitHub Actions** — or **Deploy from a branch: `main` / `/` (root)**.

Then add a Pages workflow so it actually publishes. Create `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

The artifact uploader will skip `.git`. That is fine. If it fails because the artifact is too broad, exclude nothing else — the whole repo **is** the site.

Commit and push the workflow:

```bash
git add .github/workflows/pages.yml
git commit -m "Enable GitHub Pages from main"
git push
```

Wait for the Actions run to go green:

```bash
gh run watch
```

---

## Step 4 — verify (do not skip)

Open:

https://bannisterderik-tech.github.io/red-bank-outfitters/

Then actually click:

- [ ] Homepage loads, hero reads **The private *quail* ranch. Since 1965.**
- [ ] Quail mark shows in the nav
- [ ] **Inquire** goes to `contact.html` (not a 404, not `redbankhunting.com`)
- [ ] **The Lodge** dropdown: Lodge, Bunkhouse, Dining, Weddings — all 200
- [ ] Nested hunt page: `/upland/bobwhite.html` — CSS, mark, and photos load (relative `../` paths)
- [ ] Nested big-game page: `/hunts/blacktail.html` — same
- [ ] View source: `noindex,nofollow` is still present
- [ ] https://bannisterderik-tech.github.io/red-bank-outfitters/robots.txt still says `Disallow: /`
- [ ] Zero links to `redbankhunting.com` in the nav (Academy → `redbankoutdooracademy.com` is allowed)
- [ ] Images load: `img/hero-oak.jpg`, `img/pointer.jpg`, `img/lodge.jpg`, `img/mark.svg`

If CSS is missing on nested pages, you used absolute `/styles.css`. Revert. Relative paths were correct.

If the homepage is a directory listing or a 404, Pages source is not `main` `/`. Fix Settings → Pages.

---

## After it is live

Reply to Derik with:

1. Repo: `https://github.com/bannisterderik-tech/red-bank-outfitters`
2. Preview: `https://bannisterderik-tech.github.io/red-bank-outfitters/`
3. Confirmation it is **noindex**, not competing with `redbankhunting.com`
4. Reminder: custom domain / index / DNS only when the client says go

Do **not** add a custom domain. Do **not** remove `noindex`. Do **not** submit a sitemap.

---

## Site map (what you are shipping)

```
index.html          Home
the-ranch.html
hunts.html          The Hunt
upland.html
upland/*.html       bobwhite, valley-quail, mountain-quail, chukar, pheasant, european-drive, turkey
big-game.html
hunts/blacktail.html
hunts/wild-hog.html
bass.html
clays.html
kennels.html
lodge.html
bunkhouse.html
dining.html
weddings.html
rates.html          "Call for pricing" — no invented rates
contact.html
gallery.html
news.html
styles.css
script.js
img/                web JPEGs + mark.svg
build.py            generator — source of HTML; don't run unless editing copy
```

Local preview (already running is fine): `python3 -m http.server 8765` from the repo root.

---

## If something is already wrong

| Symptom | Cause | Fix |
|---|---|---|
| `404` on `/red-bank-outfitters/` | Pages not enabled or wrong branch | Step 3 |
| CSS missing on `/upland/bobwhite.html` | Absolute `/styles.css` | Keep relative `../styles.css` |
| Blank GitHub 404 repo page | Pushed to `red-bank-lodge` by mistake | Stop. New repo only |
| Site showing in Google later | `noindex` or robots stripped | Put them back, rebuild, push |
| Jekyll error / missing files | No `.nojekyll` | Add it, push |
