/**
 * OpenInPrivateTab - Background script (Phase 1 / MVP)
 *
 * Responsibility:
 * - Register a context menu item on the tab strip.
 * - When clicked, open the current tab's URL in a new Private Browsing window.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/create
 *
 * Note: Menu items must be created inside runtime.onInstalled, otherwise
 * repeated reloads during development throw "duplicate id" errors.
 */

const MENU_ITEM_ID = "open-in-private-window";

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: MENU_ITEM_ID,
    title: browser.i18n.getMessage("contextMenuItemTitle") || "Open in Private Window",
    contexts: ["tab"]
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ITEM_ID) {
    return;
  }

  if (!tab || !tab.url) {
    return;
  }

  browser.windows.create({
    url: tab.url,
    incognito: true
  }).catch((error) => {
    console.error("OpenInPrivateTab: failed to open private window", error);
  });
});
