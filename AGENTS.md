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
