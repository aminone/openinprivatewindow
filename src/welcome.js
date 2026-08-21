/**
 * OpenInPrivateWindow - welcome.html script
 *
 * "about:addons" is a privileged page and cannot be opened programmatically
 * from an extension (tabs.create/tabs.update reject it, and a plain <a href>
 * does not navigate either - see https://bugzilla.mozilla.org/show_bug.cgi?id=1269456).
 * The only reliable option is to let the user copy the address and paste it
 * into the address bar themselves.
 */

const copyButton = document.getElementById("copy-btn");
const feedback = document.getElementById("copy-feedback");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("about:addons");
    feedback.textContent = "Copied!";
  } catch (error) {
    feedback.textContent = "Could not copy - please select and copy manually.";
    console.error("OpenInPrivateWindow: clipboard write failed", error);
  }

  setTimeout(() => {
    feedback.textContent = "";
  }, 2000);
});
