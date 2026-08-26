# Development

Technical notes, roadmap, and design decisions for contributors. End users
looking for install/usage info should see [README.md](./README.md) instead.

## Roadmap

| Phase | Scope |
|-------|-------|
| 1 | Context menu item, open URL in private window |
| 2 | Options page, storage.local settings, base tracking-parameter list, localization (en/fa) |
| 3 | Toolbar icon, expanded tracking-parameter list, keyboard shortcut |
| 4 | Chrome compatibility (requires explicit review before starting) |

Phases 1-3 are complete. Version 1.0.0 is pending AMO review.

## Local development

Load temporarily in Firefox via `about:debugging` → "This Firefox" →
"Load Temporary Add-on…" → select `manifest.json`.

## Design decisions

### storage.local instead of storage.sync

Per MDN, `storage.sync` is meant for settings that should follow the user
across devices/profiles, while `storage.local` is for settings local to the
current machine. This extension's settings are small, purely local
preferences with no reason to sync, and `storage.sync` would additionally
require a `browser_specific_settings.gecko.id` — which we already set for
other reasons, but avoiding a sync dependency keeps behavior predictable
regardless of whether the user has Firefox Sync enabled.

### Keyboard shortcut: Alt+Shift+P, not Ctrl+Shift+P

Ctrl+Shift+P was the obvious first choice given the "P" requirement, but
Firefox reserves it for its own "Open a New Private Window" command —
ironic collision, but it means extensions can't register it at all (the
browser silently won't call the handler). Alt+Shift+P isn't reserved by
Firefox and follows the modifier+Shift+letter pattern Mozilla recommends
for extension shortcuts. Users can remap it via `about:addons` → gear icon
→ Manage Extension Shortcuts.

### "Run in Private Windows" can't be requested or linked to directly

Firefox does not allow any extension to create a private window unless the
user explicitly grants it access, regardless of what's declared in
`manifest.json`. This is a per-extension, user-controlled toggle — not
something requestable as a manifest permission. Without it, clicking any
trigger fails with:

```
Error: Extension does not have permission for incognito mode
```

The welcome page includes a "Copy" button for the `about:addons` address,
since Firefox does not allow extension pages to link to it directly — it's
a privileged page and rejects programmatic navigation the same way
`tabs.create()` does (see
[Bug 1269456](https://bugzilla.mozilla.org/show_bug.cgi?id=1269456)).

`background.js` detects this failure via
`extension.isAllowedIncognitoAccess()` and reopens the welcome page with
instructions instead of failing silently.

Reference: [MDN — incognito](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/incognito), [Bug 1618439](https://bugzilla.mozilla.org/show_bug.cgi?id=1618439)

### Tracking-parameter list

Curated from [mpchadwick/tracking-query-params-registry](https://github.com/mpchadwick/tracking-query-params-registry)
(`src/trackingParams.js`). Deliberately excludes short, generic names from
that source (`cid`, `sid`, `si`, `pp`, `kb`, etc.) since sites can reuse
those exact names for unrelated, non-tracking purposes — stripping them
globally risks breaking normal page functionality.

### Localization

Locale files live in `_locales/<lang>/messages.json` (`en` is the
`default_locale`). Covered strings: `manifest.json` name/description, the
context menu item, the keyboard shortcut description, and every string on
the welcome and options pages.

The welcome and options pages are plain HTML — WebExtensions does not
auto-substitute `__MSG_x__` placeholders inside HTML files (only inside
`manifest.json` and CSS). So `welcome.js`/`options.js` fill in text via
`browser.i18n.getMessage()` on load, and set `<html lang>`/`dir` based on
`browser.i18n.getUILanguage()` — `dir="rtl"` for Persian.

To test a locale without changing your OS language, change Firefox's
language in Settings → General → Language, or set `intl.locale.requested`
in `about:config`.

## CI/CD

Two GitHub Actions workflows live in `.github/workflows/`:

- **`build.yml`** — runs on every push to `main`. Lints the extension
  (`web-ext lint`), builds a clean `.zip` with `web-ext build` (excluding
  README, LICENSE, `store-listing/`, `icons/icon.svg`, and `.github/`), and
  uploads it as a downloadable build artifact. Never touches AMO.
- **`release.yml`** — runs only when a version tag matching `v*.*.*` is
  pushed. Builds the same clean zip, submits it to AMO via `web-ext sign
  --channel=listed`, and attaches the zip to a GitHub Release.

Submission only happens on an explicit tag push, not on every merge to
`main` — a routine README fix shouldn't queue a new version for Mozilla's
review. To ship a new version: bump `version` in `manifest.json`, merge to
`main`, then `git tag vX.Y.Z && git push origin vX.Y.Z`.

`release.yml` needs two repository secrets from your
[AMO API Credentials page](https://addons.mozilla.org/developers/addon/api/key/):
`AMO_API_KEY` and `AMO_API_SECRET`. It assumes the extension is already
listed on AMO (the 1.0.0 submission was done manually through the web UI) —
it submits version updates, not the initial listing.

## Publishing checklist

- [x] Final icons (`icons/icon-48.png`, `icons/icon-96.png`, `icons/icon-128.png`, source in `icons/icon.svg`)
- [x] Store listing draft copy (`store-listing/en.md`, `store-listing/fa.md`)
- [x] `store-listing/reviewer-notes.md` for AMO's "Notes to Reviewer" field
- [ ] Bump `version` in `manifest.json` before submitting
- [ ] Final manual test pass (both locales, light/dark)
- [ ] Update the AMO link in README.md once the listing is live
