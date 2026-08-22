/**
 * OpenInPrivateWindow - Background script (Phase 3)
 *
 * Responsibility:
 * - Register a context menu item on the tab strip, a toolbar icon
 *   (action), and a keyboard shortcut (commands) - all three trigger
 *   the exact same openInPrivateWindow() flow for the active tab.
 * - That flow reads user settings from storage.local, optionally cleans
 *   known tracking query parameters from the URL, opens it in a new
 *   Private Browsing window, and optionally closes the original tab.
 * - On first install, opens a welcome page that explains the required
 *   one-time "Run in Private Windows" permission (this is a Firefox
 *   user-controlled setting, it cannot be requested via manifest.json).
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/create
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/action
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/commands
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/extension/isAllowedIncognitoAccess
 *
 * Note: Menu items must be created inside runtime.onInstalled, otherwise
 * repeated reloads during development throw "duplicate id" errors.
 *
 * Note: TRACKING_PARAMS comes from trackingParams.js, loaded before this
 * file in manifest.json's background.scripts array (classic script
 * concatenation, shared global scope - no import/export needed).
 */

const MENU_ITEM_ID = "open-in-private-window";
const COMMAND_ID = "open-in-private-window";

// Defaults must match the ones read on options.html, and the decisions
// made in phase 1/2 planning: original tab stays open, URL is untouched.
const DEFAULT_SETTINGS = {
  closeOriginalTab: false,
  cleanTrackingParams: false
};

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
  openInPrivateWindow(tab);
});

// Toolbar icon has no default_popup set, so clicking it fires this event
// directly with the active tab - same shape as the context menu handler.
browser.action.onClicked.addListener((tab) => {
  openInPrivateWindow(tab);
});

// commands.onCommand only gives the command name, not a tab, so the
// active tab in the current window is looked up first.
browser.commands.onCommand.addListener(async (command) => {
  if (command !== COMMAND_ID) {
    return;
  }

  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  openInPrivateWindow(activeTab);
});

/**
 * Shared entry point for all three triggers (context menu, toolbar icon,
 * keyboard shortcut): reads settings, optionally cleans the URL, opens
 * the private window, and optionally closes the original tab.
 */
async function openInPrivateWindow(tab) {
  if (!tab || !tab.url) {
    return;
  }

  const settings = await browser.storage.local.get(DEFAULT_SETTINGS);
  const targetUrl = settings.cleanTrackingParams
    ? removeTrackingParams(tab.url)
    : tab.url;

  try {
    await browser.windows.create({
      url: targetUrl,
      incognito: true
    });

    // Only close the original tab after the private window was created
    // successfully - never close it on a failed attempt (e.g. missing
    // "Run in Private Windows" permission, handled below).
    if (settings.closeOriginalTab) {
      await browser.tabs.remove(tab.id);
    }
  } catch (error) {
    handleOpenWindowError(error);
  }
}

/**
 * Removes known tracking query parameters (see trackingParams.js) from a
 * URL. Falls back to the original URL untouched if it can't be parsed.
 */
function removeTrackingParams(rawUrl) {
  let url;

  try {
    url = new URL(rawUrl);
  } catch (error) {
    console.warn("OpenInPrivateWindow: could not parse URL, skipping cleanup", error);
    return rawUrl;
  }

  for (const param of TRACKING_PARAMS) {
    url.searchParams.delete(param);
  }

  return url.toString();
}

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

/**
 * Removes known tracking query parameters (see trackingParams.js) from a
 * URL. Falls back to the original URL untouched if it can't be parsed.
 */
function removeTrackingParams(rawUrl) {
  let url;

  try {
    url = new URL(rawUrl);
  } catch (error) {
    console.warn("OpenInPrivateWindow: could not parse URL, skipping cleanup", error);
    return rawUrl;
  }

  for (const param of TRACKING_PARAMS) {
    url.searchParams.delete(param);
  }

  return url.toString();
}

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
