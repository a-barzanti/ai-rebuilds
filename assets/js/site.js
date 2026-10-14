// AI Rebuilds: theme toggle and project filtering. No dependencies.
(function () {
  "use strict";

  // ---------- Theme toggle ----------
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // ---------- Project filter ----------
  var grid = document.getElementById("project-grid");
  if (!grid) return;

  var search = document.getElementById("project-search");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".card[data-status]"));
  var empty = document.getElementById("project-empty");
  var status = "all";

  function apply() {
    var q = (search.value || "").trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var okStatus = status === "all" || card.dataset.status === status;
      var okText = !q || (card.dataset.search || "").indexOf(q) !== -1;
      card.hidden = !(okStatus && okText);
      if (!card.hidden) shown++;
    });
    empty.hidden = shown !== 0 || cards.length === 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      status = chip.dataset.filter;
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      apply();
    });
  });

  search.addEventListener("input", apply);
})();
