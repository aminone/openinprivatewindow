/**
 * OpenInPrivateWindow - options.html script (Phase 2)
 *
 * Fills in all localized text via browser.i18n.getMessage() and sets
 * <html lang>/dir based on the active locale (needed for Persian, which
 * is right-to-left).
 *
 * Loads current settings from storage.local (falling back to defaults),
 * reflects them in the two checkboxes, and saves immediately on change -
 * no separate "Save" button, consistent with most WebExtension options pages.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
 */

const RTL_LOCALES = ["fa", "ar", "he"];

const DEFAULT_SETTINGS = {
  closeOriginalTab: false,
  cleanTrackingParams: false
};

const closeOriginalTabInput = document.getElementById("close-original-tab");
const cleanTrackingParamsInput = document.getElementById("clean-tracking-params");
const savedIndicator = document.getElementById("saved-indicator");

function applyLocale() {
  const uiLocale = browser.i18n.getUILanguage().split("-")[0];
  document.documentElement.lang = uiLocale;
  document.documentElement.dir = RTL_LOCALES.includes(uiLocale) ? "rtl" : "ltr";

  document.title = browser.i18n.getMessage("optionsPageTitle");
  document.getElementById("options-heading").textContent = browser.i18n.getMessage("optionsPageTitle");
  document.getElementById("close-tab-title").textContent = browser.i18n.getMessage("optionsCloseTabTitle");
  document.getElementById("close-tab-body").textContent = browser.i18n.getMessage("optionsCloseTabBody");
  document.getElementById("clean-params-title").textContent = browser.i18n.getMessage("optionsCleanParamsTitle");
  document.getElementById("clean-params-body").textContent = browser.i18n.getMessage("optionsCleanParamsBody");
}

async function loadSettings() {
  const settings = await browser.storage.local.get(DEFAULT_SETTINGS);
  closeOriginalTabInput.checked = settings.closeOriginalTab;
  cleanTrackingParamsInput.checked = settings.cleanTrackingParams;
}

function showSavedIndicator() {
  savedIndicator.textContent = browser.i18n.getMessage("optionsSavedIndicator");
  setTimeout(() => {
    savedIndicator.textContent = "";
  }, 1500);
}

closeOriginalTabInput.addEventListener("change", async () => {
  await browser.storage.local.set({ closeOriginalTab: closeOriginalTabInput.checked });
  showSavedIndicator();
});

cleanTrackingParamsInput.addEventListener("change", async () => {
  await browser.storage.local.set({ cleanTrackingParams: cleanTrackingParamsInput.checked });
  showSavedIndicator();
});

applyLocale();
loadSettings();
