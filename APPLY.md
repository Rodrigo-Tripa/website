# Applying the SEO / AI discoverability pack

Repository target: `Rodrigo-Tripa/website`

This package contains complete replacement files for discovery, indexing and machine-readable publication, plus an idempotent patch script for existing HTML pages.

## 1. Copy the package into the repository root

Copy the directory contents so these paths replace/create the corresponding repository files.

## 2. Run the patcher

From the repository root:

```bash
python3 seo-pack/patch_existing_html.py
```

The patcher:

- adds `rel="describedby"` pointing to `/llms.txt` on existing HTML pages;
- removes the duplicate `assets/js/main.js` include from `index.html`;
- marks the legacy `report.html` query endpoint `noindex, follow`;
- redirects `/report.html?edition=YYYY/week-NN` to `/security/YYYY/week-NN/` when possible;
- adds a canonical link to the destination on the legacy report page.

## 3. Remove public backup files

These currently exist in the repository and should be deleted from Git:

```text
report.html.bak
research.html.bak
```

The new `.gitignore` also prevents future `*.bak`, `*.backup` and `*.old` files from being tracked.

## 4. Rebuild the Security Weekly archive

```bash
chmod +x scripts/build-archive.sh
./scripts/build-archive.sh
```

## 5. Validate before pushing

```bash
python3 -m http.server 8000
```

Then check:

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/.well-known/security.txt`
- `/security/2026/week-31/` through `/security/2026/week-35/`
- `/security/feed.xml`

Also run a link checker and inspect the rendered pages in a browser.

## 6. Submit the sitemap

After deployment, submit:

`https://rodrigotripa.dev/sitemap.xml`

to Google Search Console and Bing Webmaster Tools. Request indexing for the homepage and the five report URLs after the deployment has propagated.
