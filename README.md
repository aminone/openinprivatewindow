# Open in Private Tab

A minimal Firefox extension (Manifest V3) that reopens the current tab's URL in a new Private Browsing **window**, via a right-click context menu item on the tab strip.

> **Note on naming:** Private Browsing in Firefox is a *window*-level concept, not a tab-level one. This extension opens a new Private Browsing window with the same URL — it does not, and cannot, convert a single tab into a "private tab" inside the current window. This is stated explicitly here (and will be stated on the AMO listing) to avoid any misleading impression of the extension's behavior.

## Status

Phase 1 (MVP) — in development.

## Current features (Phase 1)

- Right-click a tab → "Open in Private Window" → opens that tab's URL in a new private window.
- No settings yet. Original tab is never closed. URL is opened exactly as-is (no cleaning).

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
