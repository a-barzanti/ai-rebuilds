// Google Analytics 4, loaded only after the visitor agrees. Until GA_ID is set, this does nothing.
// To turn it on: create a free GA4 property, copy its Measurement ID (G-XXXXXXXXXX) below, and push.
(function () {
  "use strict";

  var GA_ID = "";
  var KEY = "analytics-consent"; // "granted" | "denied"

  if (!GA_ID) return;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function load() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
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
