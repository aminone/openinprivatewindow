/**
 * OpenInPrivateWindow - Background script (Phase 1 / MVP)
 *
 * Responsibility:
 * - Register a context menu item on the tab strip.
 * - When clicked, open the current tab's URL in a new Private Browsing window.
 * - On first install, open a welcome page that explains the required
 *   one-time "Run in Private Windows" permission (this is a Firefox
 *   user-controlled setting, it cannot be requested via manifest.json).
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/create
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/extension/isAllowedIncognitoAccess
 *
 * Note: Menu items must be created inside runtime.onInstalled, otherwise
 * repeated reloads during development throw "duplicate id" errors.
 */

const MENU_ITEM_ID = "open-in-private-window";

browser.runtime.onInstalled.addListener((details) => {
  browser.contextMenus.create({
    id: MENU_ITEM_ID,
    title: browser.i18n.getMessage("contextMenuItemTitle") || "Open in Private Window",
    contexts: ["tab"]
  });

  if (details.reason === "install") {
    browser.tabs.create({
      url: browser.runtime.getURL("src/welcome.html")
    });
  }
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
    handleOpenWindowError(error);
  });
});

/**
 * Firefox blocks an extension from creating a private window until the
 * user explicitly grants "Run in Private Windows" access for it. This is
 * not something we can request via manifest.json permissions - it's a
 * per-extension toggle under about:addons. See:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1618439
 */
async function handleOpenWindowError(error) {
  const isAllowed = await browser.extension.isAllowedIncognitoAccess();

  if (!isAllowed) {
    console.warn(
      "OpenInPrivateWindow: this extension does not have private window access yet. " +
      "Enable it via about:addons -> OpenInPrivateWindow -> Run in Private Windows."
    );
    browser.tabs.create({
      url: browser.runtime.getURL("src/welcome.html")
    });
    return;
  }

  console.error("OpenInPrivateWindow: failed to open private window", error);
}
