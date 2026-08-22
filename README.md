# Open in Private Window

A minimal Firefox extension (Manifest V3) that reopens the current tab's URL in a new Private Browsing window, via a right-click context menu item on the tab strip.

## Status

Phase 2 — done (options page, storage, tracking-parameter list, localization). Icons and store-listing text are drafted, ready for AMO submission.

## Current features

- Right-click a tab → "Open in Private Window" → opens that tab's URL in a new private window.
- Full options page (`about:addons` → Extensions → Open in Private Window → Preferences, or `src/options.html`):
  - **Close the original tab** — off by default.
  - **Remove tracking parameters before opening** — off by default. Strips a base list of known tracking query parameters (see `src/trackingParams.js`).
- Settings are stored with `storage.local` (device-local, not synced — see reasoning below).
- On install, a welcome page opens explaining the one-time "Run in Private Windows" permission (see below).
- Available in English and Persian (`_locales/en`, `_locales/fa`) — extension name/description, context menu item, and both extension pages (welcome, options) are fully localized, including RTL layout for Persian.

## Why storage.local instead of storage.sync

Per MDN, `storage.sync` is meant for settings that should follow the user across
devices/profiles, while `storage.local` is for settings local to the current
machine. This extension's settings are small, purely local preferences with no
reason to sync, and `storage.sync` would additionally require a
`browser_specific_settings.gecko.id` — which we already set for other reasons,
but avoiding a sync dependency keeps behavior predictable regardless of whether
the user has Firefox Sync enabled.

## Required manual step: "Run in Private Windows"

Firefox does not allow any extension to create a private window unless the user
explicitly grants it access, regardless of what's declared in `manifest.json`.
This is a per-extension, user-controlled toggle — not something we can request
as a manifest permission. Without it, clicking the context menu item fails with:

```
Error: Extension does not have permission for incognito mode
```

To fix it: go to `about:addons` → Extensions → Open in Private Window → set
**"Run in Private Windows"** to **Allow**.

The welcome page includes a "Copy" button for the `about:addons` address, since
Firefox does not allow extension pages to link to it directly — it's a
privileged page and rejects programmatic navigation the same way `tabs.create()`
does (see [Bug 1269456](https://bugzilla.mozilla.org/show_bug.cgi?id=1269456)).

The background script detects this failure via `extension.isAllowedIncognitoAccess()`
and reopens the welcome page with instructions instead of failing silently.

Reference: [MDN — incognito](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/incognito), [Bug 1618439](https://bugzilla.mozilla.org/show_bug.cgi?id=1618439)

## Localization

Locale files live in `_locales/<lang>/messages.json` (`en` is the
`default_locale`). Covered strings: `manifest.json` name/description, the
context menu item, and every string on the welcome and options pages.

The welcome and options pages are plain HTML — WebExtensions does not
auto-substitute `__MSG_x__` placeholders inside HTML files (only inside
`manifest.json` and CSS). So `welcome.js`/`options.js` fill in text via
`browser.i18n.getMessage()` on load, and set `<html lang>`/`dir` based on
`browser.i18n.getUILanguage()` — `dir="rtl"` for Persian.

To test a locale without changing your OS language, change Firefox's
language in Settings → General → Language, or set `intl.locale.requested`
in `about:config`.

## Roadmap

| Phase | Scope |
|-------|-------|
| 1 | Context menu item, open URL in private window |
| 2 | Options page, storage.local settings, base tracking-parameter list, localization (en/fa) |
| 3 | Toolbar icon, expanded tracking-parameter list, keyboard shortcut |
| 4 | Chrome compatibility (requires explicit review before starting) |

Phase 2 is complete.

## Publishing checklist (before AMO submission)

- [x] Final icons (`icons/icon-48.png`, `icons/icon-96.png`, `icons/icon-128.png`, source in `icons/icon.svg`)
- [x] Store listing draft copy (`store-listing/en.md`, `store-listing/fa.md`)
- [ ] Bump `version` in `manifest.json` if needed before submitting
- [ ] Final manual test pass (both locales, light/dark)

## Permissions

| Permission | Reason |
|------------|--------|
| `contextMenus` | To add the "Open in Private Window" item to the tab context menu |
| `tabs` | To read the URL of the clicked tab, and close it when the "close original tab" setting is on |
| `storage` | To persist the two options-page settings |

No host permissions are requested.

## Development

Load temporarily in Firefox via `about:debugging` → "This Firefox" → "Load Temporary Add-on…" → select `manifest.json`.

## License

MIT — see [LICENSE](./LICENSE).
