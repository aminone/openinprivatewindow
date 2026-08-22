/**
 * OpenInPrivateWindow - base tracking parameter list (Phase 2)
 *
 * Loaded as a classic script before background.js (see manifest.json
 * background.scripts order), so TRACKING_PARAMS is available as a
 * plain global in the background script's scope.
 *
 * This is a starting list of widely-known tracking query parameters.
 * Expanding it is planned for Phase 3.
 */

const TRACKING_PARAMS = [
  // Google / Google Ads
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gclsrc",
  "dclid",

  // Facebook / Meta
  "fbclid",

  // Microsoft / Bing
  "msclkid",

  // TikTok
  "ttclid",

  // Mailchimp
  "mc_eid",
  "mc_cid",

  // Twitter / X
  "twclid",

  // Yandex
  "yclid"
];
