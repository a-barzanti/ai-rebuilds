// Google Analytics, loaded only after the visitor agrees. Until TAG_ID is set, this does nothing.
// TAG_ID is either a Google Tag Manager container (GTM-XXXXXXX), whose GA4 tag is set up in Tag Manager,
// or a GA4 Measurement ID (G-XXXXXXXXXX) to load Google Analytics directly.
(function () {
  "use strict";

  var TAG_ID = "GTM-MSJT73V2";
  var KEY = "analytics-consent"; // "granted" | "denied"

  if (!TAG_ID) return;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    var s = document.createElement("script");
    s.async = true;
    if (TAG_ID.indexOf("GTM-") === 0) {
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      s.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(TAG_ID);
    } else {
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", TAG_ID);
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(TAG_ID);
    }
    document.head.appendChild(s);
  }

  function ask() {
    var bar = document.createElement("div");
    bar.className = "consent";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Analytics consent");
    bar.innerHTML =
      '<p>Can we count your visit with Google Analytics? It helps us see which projects people look for. <a href="/privacy/">Details</a></p>' +
      '<button type="button" class="btn btn-primary" data-v="granted">Allow</button>' +
      '<button type="button" class="btn" data-v="denied">No thanks</button>';
    bar.addEventListener("click", function (e) {
      var v = e.target.getAttribute && e.target.getAttribute("data-v");
      if (!v) return;
      save(v);
      bar.remove();
      if (v === "granted") load();
    });
    document.body.appendChild(bar);
  }

  // The privacy page can reopen the question.
  window.aiRebuildsConsent = function () {
    save("");
    var old = document.querySelector(".consent");
    if (!old) ask();
  };

  var choice = read();
  if (choice === "granted") load();
  else if (choice !== "denied") ask();
})();
