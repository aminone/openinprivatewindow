/**
 * OpenInPrivateWindow - welcome.html script
 *
 * Fills in all localized text via browser.i18n.getMessage() and sets
 * <html lang>/dir based on the active locale (needed for Persian, which
 * is right-to-left).
 *
 * "about:addons" is a privileged page and cannot be opened programmatically
 * from an extension (tabs.create/tabs.update reject it, and a plain <a href>
 * does not navigate either - see https://bugzilla.mozilla.org/show_bug.cgi?id=1269456).
 * The only reliable option is to let the user copy the address and paste it
 * into the address bar themselves.
 */

const RTL_LOCALES = ["fa", "ar", "he"];

function applyLocale() {
  const uiLocale = browser.i18n.getUILanguage().split("-")[0];
  document.documentElement.lang = uiLocale;
  document.documentElement.dir = RTL_LOCALES.includes(uiLocale) ? "rtl" : "ltr";

  document.title = browser.i18n.getMessage("welcomePageTitle");
  document.getElementById("welcome-heading").textContent = browser.i18n.getMessage("welcomeHeading");
  document.getElementById("welcome-intro").textContent = browser.i18n.getMessage("welcomeIntro");

  document.getElementById("step1-title").textContent = browser.i18n.getMessage("welcomeStep1Title");
  document.getElementById("step1-goto").textContent = browser.i18n.getMessage("welcomeStep1GoTo");
  document.getElementById("copy-btn").textContent = browser.i18n.getMessage("welcomeCopyButton");
  document.getElementById("step1-instructions").textContent = browser.i18n.getMessage("welcomeStep1Instructions");

  document.getElementById("step2-title").textContent = browser.i18n.getMessage("welcomeStep2Title");
  document.getElementById("step2-body").textContent = browser.i18n.getMessage("welcomeStep2Body");

  document.getElementById("step3-title").textContent = browser.i18n.getMessage("welcomeStep3Title");
  document.getElementById("step3-body").textContent = browser.i18n.getMessage("welcomeStep3Body");

  document.getElementById("welcome-note").textContent = browser.i18n.getMessage("welcomeNote");
}

applyLocale();

const copyButton = document.getElementById("copy-btn");
const feedback = document.getElementById("copy-feedback");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("about:addons");
    feedback.textContent = browser.i18n.getMessage("welcomeCopyFeedbackSuccess");
  } catch (error) {
    feedback.textContent = browser.i18n.getMessage("welcomeCopyFeedbackError");
    console.error("OpenInPrivateWindow: clipboard write failed", error);
  }

  setTimeout(() => {
    feedback.textContent = "";
  }, 2000);
});
