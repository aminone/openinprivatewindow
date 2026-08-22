/**
 * OpenInPrivateWindow - tracking parameter list (Phase 3)
 *
 * Loaded as a classic script before background.js (see manifest.json
 * background.scripts order), so TRACKING_PARAMS is available as a
 * plain global in the background script's scope.
 *
 * Curated from the mpchadwick/tracking-query-params-registry project
 * (https://github.com/mpchadwick/tracking-query-params-registry,
 * accessed 2026-08, _data/params.csv), a community-maintained list of
 * query params used by marketing/analytics tools. Not every entry from
 * that list is included here - short, generic names (e.g. "cid", "sid",
 * "si", "pp", "kb") were deliberately left out, since sites can reuse
 * those same names for unrelated, non-tracking purposes, and removing
 * them could break a page's normal functionality.
 */

const TRACKING_PARAMS = [
  // Google (Ads, Analytics, Merchant Center, DoubleClick)
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
  "utm_klaviyo_id",
  "gclid",
  "gclsrc",
  "dclid",
  "gbraid",
  "wbraid",
  "gad_source",
  "gad_campaignid",
  "gPromoCode",
  "gQT",
  "srsltid",
  "_ga",
  "_gl",

  // Facebook / Meta
  "fbclid",
  "meta_placement",
  "meta_site_source",
  "fbc_id",
  "fbadid",

  // Microsoft / Bing
  "msclkid",

  // TikTok
  "ttclid",
  "ttadid",

  // Twitter / X
  "twclid",

  // Yandex / Yahoo
  "yclid",
  "vmcid",

  // Pinterest
  "epik",

  // Snapchat
  "ScCid",
  "scadid",

  // Instagram
  "igshid",

  // eBay Partner Network
  "mkevt",
  "mkcid",
  "mkrid",
  "campid",
  "toolid",
  "customid",

  // Mailchimp
  "mc_cid",
  "mc_eid",

  // Klaviyo
  "_ke",
  "_kx",

  // Matomo / Piwik
  "pk_campaign",
  "pk_kwd",
  "pk_keyword",
  "pk_source",
  "pk_medium",
  "pk_cid",
  "pk_content",
  "piwik_campaign",
  "piwik_kwd",
  "piwik_keyword",
  "mtm_campaign",
  "mtm_keyword",
  "mtm_source",
  "mtm_medium",
  "mtm_content",
  "mtm_cid",
  "mtm_group",
  "mtm_placement",
  "matomo_campaign",
  "matomo_keyword",
  "matomo_source",
  "matomo_medium",
  "matomo_content",
  "matomo_cid",
  "matomo_group",
  "matomo_placement",

  // HubSpot
  "hsa_cam",
  "hsa_grp",
  "hsa_mt",
  "hsa_src",
  "hsa_ad",
  "hsa_acc",
  "hsa_net",
  "hsa_kw",
  "hsa_tgt",
  "hsa_ver",
  "_hsenc",
  "_hsmi",
  "__hssc",
  "__hstc",
  "__hsfp",
  "hsCtaTracking",

  // Adobe
  "ef_id",
  "s_kwcid",

  // Branch, Impact, Rokt
  "_branch_match_id",
  "irclickid",
  "rtid",

  // dotdigital, Wunderkind
  "dm_i",
  "sms_source",
  "sms_click",
  "sms_uph",

  // Triple Whale
  "tw_source",
  "tw_campaign",
  "tw_term",
  "tw_content",
  "tw_adid",
  "tw_kwdid",

  // Klar Insights
  "klar_source",
  "klar_cpid",
  "klar_adid",

  // Northbeam
  "nbt",
  "nb_placement",
  "nb_klid"
];

