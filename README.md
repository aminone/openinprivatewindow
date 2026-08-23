# Open in Private Window

A small Firefox extension that reopens your current tab in a new Private
Browsing window — right-click a tab, click the toolbar icon, or press
**Alt+Shift+P**.

## Install

<!-- TODO: replace with the live AMO listing URL once the review is approved -->
Coming soon on [addons.mozilla.org](https://addons.mozilla.org) — the first
version is currently pending Mozilla's review.

## Features

- **Three ways to trigger it:** right-click a tab, click the toolbar icon, or use the **Alt+Shift+P** shortcut.
- **Optionally close the original tab** once the private window opens.
- **Optionally strip tracking parameters** (utm_source, fbclid, gclid, and ~100 others) from the URL before it opens.
- Runs entirely on your device — no network requests, no data collection.
- Available in **English** and **Persian** (فارسی), including right-to-left layout.

Settings live in `about:addons` → Extensions → Open in Private Window → Preferences.

## One-time setup: "Run in Private Windows"

Firefox blocks every extension from opening private windows until you
explicitly allow it — this can't be requested automatically. The extension
walks you through it on first install (a 10-second toggle in
`about:addons`), and shows the same instructions again if you try to use it
before granting access.

## Permissions

| Permission | Why it's needed |
|------------|------------------|
| `contextMenus` | Adds the "Open in Private Window" item to the tab context menu |
| `tabs` | Reads the clicked tab's URL, and closes it if that setting is on |
| `storage` | Saves your two settings locally |

No host permissions, no network access.

## License

MIT — see [LICENSE](./LICENSE).

---

Building or contributing? See [DEVELOPMENT.md](./DEVELOPMENT.md) for the
roadmap, CI/CD setup, and design decisions.
