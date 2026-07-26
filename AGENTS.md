# AGENTS.md - Parrocchettami site

## Download link policy

All website download buttons and `SoftwareApplication.downloadUrl` metadata must use the stable GitHub asset URL:

```text
https://github.com/martinowong/parrocchettami/releases/latest/download/Parrocchettami-latest-Apple-Silicon.dmg
```

Do not hardcode a versioned DMG URL in the website. The app release process generates `Parrocchettami-latest-Apple-Silicon.dmg` as an additional asset for every full, published GitHub release. The versioned DMG remains the asset referenced by Sparkle's appcast.

When publishing a release, upload both the versioned DMG and stable alias, plus their matching `.sha256` files. GitHub's `latest` endpoint ignores drafts and prereleases, so the newest production release must be published and marked Latest.

## Repository hygiene

Keep the production site files and assets tracked. Do not stage local concept files or `.DS_Store` files unless explicitly requested.

## Languages and deployment

The Italian site remains at the repository root and is the default GitHub Pages homepage. The English mirror lives in `/en/` and reuses the root CSS, JavaScript, and assets through relative paths.

When adding or changing a page, update both language versions when the content is user-facing. Keep the reciprocal `hreflang` tags and the visible `IT` / `EN` switch in sync. Add both versions to `sitemap.xml`; keep `llms.txt` aware of the English URLs.

Use an isolated branch for substantial website changes, preview locally, and only merge to `main` after checking that the root Italian pages are unchanged apart from intentional language links or SEO metadata.
