// AI Rebuilds: theme toggle, GitHub star count, and search/filter/sort for the pre-rendered list.
// The list itself is static HTML generated from data/projects.json by `bun run sync`.
(function () {
  "use strict";

  var REPO = "a-barzanti/ai-rebuilds";

  // ---------- Theme toggle ----------
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try {
        localStorage.setItem("theme", root.dataset.theme);
      } catch (e) {}
    });
  }

  // ---------- Star count on the GitHub link ----------
  var starLink = document.querySelector("[data-star-count]");
  if (starLink && window.fetch) {
    fetch("https://api.github.com/repos/" + REPO)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (r) {
        if (r && typeof r.stargazers_count === "number") {
          var n = document.createElement("span");
          n.className = "star-n";
          n.textContent = r.stargazers_count.toLocaleString("en-US");
          n.setAttribute("aria-label", r.stargazers_count + " stars");
          starLink.appendChild(n);
        }
      })
      .catch(function () {});
  }

  // ---------- Relative dates ("3 days ago") ----------
  var DAY = 86400000;
  function ago(iso) {
    var days = Math.round((Date.now() - Date.parse(iso + "T00:00:00Z")) / DAY);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + " days ago";
    var months = Math.round(days / 30.4);
    if (months < 12) return months + (months === 1 ? " month ago" : " months ago");
    var years = Math.round(days / 365);
    return years + (years === 1 ? " year ago" : " years ago");
  }
  Array.prototype.forEach.call(document.querySelectorAll("time.ago"), function (t) {
    t.title = t.textContent;
    t.textContent = ago(t.getAttribute("datetime"));
  });

  // ---------- Directory ----------
  var search = document.getElementById("search");
  if (!search) return;
  var aiFilter = document.getElementById("ai-filter");
  var sortSel = document.getElementById("sort");
  var empty = document.getElementById("empty");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-category]"));
  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-group]"));
  var category = "all";

  // Restore state from the URL so filtered views can be shared, e.g. /?ai=built&q=photoshop
  var params = new URLSearchParams(location.search);
  if (params.get("q")) search.value = params.get("q");
  if (params.get("ai")) aiFilter.value = params.get("ai");
  if (params.get("sort")) sortSel.value = params.get("sort");
  if (params.get("category")) category = params.get("category");

  var SORTS = {
    stars: function (a, b) { return b.dataset.stars - a.dataset.stars; },
    pushed: function (a, b) { return (b.dataset.pushed || "").localeCompare(a.dataset.pushed || ""); },
    added: function (a, b) { return b.dataset.added.localeCompare(a.dataset.added); },
    name: function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); },
  };

  function apply() {
    var q = search.value.trim().toLowerCase();
    var ai = aiFilter.value;
    var sortFn = SORTS[sortSel.value] || SORTS.stars;
    var total = 0;
    groups.forEach(function (g) {
      var list = g.querySelector(".entries");
      var items = Array.prototype.slice.call(list.children);
      items.sort(function (a, b) {
        // Keep featured entries (REA) on top when sorting by stars, as in the static page.
        if (sortSel.value === "stars") {
          var f = Number(b.classList.contains("entry-featured")) - Number(a.classList.contains("entry-featured"));
          if (f) return f;
        }
        return sortFn(a, b) || a.dataset.name.localeCompare(b.dataset.name);
      });
      items.forEach(function (el) { list.appendChild(el); });
      var shown = 0;
      items.forEach(function (el) {
        var ok =
          (!q || el.dataset.search.indexOf(q) !== -1) &&
          (ai === "all" || (ai === "any-ai" ? (el.dataset.ai === "built" || el.dataset.ai === "assisted") : el.dataset.ai === ai));
        el.hidden = !ok;
        if (ok) shown++;
      });
      g.hidden = shown === 0 || (category !== "all" && g.id !== category);
      if (!g.hidden) total += shown;
    });
    empty.hidden = total !== 0;
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.category === category)); });

    var next = new URLSearchParams();
    if (q) next.set("q", q);
    if (ai !== "all") next.set("ai", ai);
    if (sortSel.value !== "stars") next.set("sort", sortSel.value);
    if (category !== "all") next.set("category", category);
    var qs = next.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }

  // After the list changes under the reader, jump back to its start (just below the sticky
  // header) so they don't land in the middle of a different set of entries.
  var listSection = document.getElementById("list");
  var header = document.querySelector(".site-header");
  function toListStart() {
    var top = listSection.getBoundingClientRect().top + window.scrollY +
      parseFloat(getComputedStyle(listSection).paddingTop) - (header ? header.offsetHeight : 0);
    if (window.scrollY > top + 1) window.scrollTo({ top: top });
  }
  function applyAndRewind() {
    apply();
    toListStart();
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      category = chip.dataset.category;
      applyAndRewind();
    });
  });
  search.addEventListener("input", apply);
  aiFilter.addEventListener("change", applyAndRewind);
  sortSel.addEventListener("change", applyAndRewind);
  if (params.toString()) apply();
})();
