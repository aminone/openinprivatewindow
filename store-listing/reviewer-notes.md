This submission contains plain, unminified source (HTML/CSS/JS) with no
build step, bundler, or transpilation - the uploaded package is the exact
source code. No separate source submission is required.

To test the core feature: right-click any tab and choose "Open in Private
Window." Firefox requires every extension to be manually granted access to
private windows (about:addons → this extension → "Run in Private Windows" →
Allow) before this will work - without it, the click fails with "Extension
does not have permission for incognito mode." On first install, the
extension opens a page (src/welcome.html) that walks the user through this
same step.

The extension makes no network requests and collects no data - all two
settings (close original tab, strip tracking parameters) are stored locally
via storage.local. The tracking-parameter list is a static array in
src/trackingParams.js.
