# Open in Private Tab

A minimal Firefox extension (Manifest V3) that reopens the current tab's URL in a new Private Browsing **window**, via a right-click context menu item on the tab strip.

> **Note on naming:** Private Browsing in Firefox is a *window*-level concept, not a tab-level one. This extension opens a new Private Browsing window with the same URL — it does not, and cannot, convert a single tab into a "private tab" inside the current window. This is stated explicitly here (and will be stated on the AMO listing) to avoid any misleading impression of the extension's behavior.

## Status

Phase 1 (MVP) — in development.

## Current features (Phase 1)

- Right-click a tab → "Open in Private Window" → opens that tab's URL in a new private window.
- No settings yet. Original tab is never closed. URL is opened exactly as-is (no cleaning).
- On install, a welcome page opens explaining the one-time "Run in Private Windows" permission (see below).

## Required manual step: "Run in Private Windows"

Firefox does not allow any extension to create a private window unless the user
explicitly grants it access, regardless of what's declared in `manifest.json`.
This is a per-extension, user-controlled toggle — not something we can request
as a manifest permission. Without it, clicking the context menu item fails with:

```
Error: Extension does not have permission for incognito mode
```

To fix it: go to `about:addons` → Extensions → Open in Private Tab → set
**"Run in Private Windows"** to **Allow**.

The welcome page includes a "Copy" button for the `about:addons` address, since
Firefox does not allow extension pages to link to it directly — it's a
privileged page and rejects programmatic navigation the same way `tabs.create()`
does (see [Bug 1269456](https://bugzilla.mozilla.org/show_bug.cgi?id=1269456)).

The background script detects this failure via `extension.isAllowedIncognitoAccess()`
and reopens the welcome page with instructions instead of failing silently.

Reference: [MDN — incognito](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/incognito), [Bug 1618439](https://bugzilla.mozilla.org/show_bug.cgi?id=1618439)

## Roadmap

| Phase | Scope |
|-------|-------|
| 1 (current) | Context menu item, open URL in private window |
| 2 | Options page (close original tab toggle, URL cleaning toggle), storage.local settings, base tracking-parameter list, localization (en/fa) |
| 3 | Toolbar icon, expanded tracking-parameter list, keyboard shortcut |
| 4 | Chrome compatibility (requires explicit review before starting) |

## Permissions (Phase 1)

| Permission | Reason |
|------------|--------|
| `contextMenus` | To add the "Open in Private Window" item to the tab context menu |
| `tabs` | To read the URL of the clicked tab |

No host permissions and no `storage` permission are requested in Phase 1.

## Development

Load temporarily in Firefox via `about:debugging` → "This Firefox" → "Load Temporary Add-on…" → select `manifest.json`.

## License

MIT — see [LICENSE](./LICENSE).
