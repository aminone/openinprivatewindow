/**
 * OpenInPrivateWindow - options.html script (Phase 2)
 *
 * Loads current settings from storage.local (falling back to defaults),
 * reflects them in the two checkboxes, and saves immediately on change -
 * no separate "Save" button, consistent with most WebExtension options pages.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
 */

const DEFAULT_SETTINGS = {
  closeOriginalTab: false,
  cleanTrackingParams: false
};

const closeOriginalTabInput = document.getElementById("close-original-tab");
const cleanTrackingParamsInput = document.getElementById("clean-tracking-params");
const savedIndicator = document.getElementById("saved-indicator");

async function loadSettings() {
  const settings = await browser.storage.local.get(DEFAULT_SETTINGS);
  closeOriginalTabInput.checked = settings.closeOriginalTab;
  cleanTrackingParamsInput.checked = settings.cleanTrackingParams;
}

function showSavedIndicator() {
  savedIndicator.textContent = "Saved";
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

loadSettings();
