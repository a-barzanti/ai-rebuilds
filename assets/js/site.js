// AI Rebuilds: theme toggle, project grid and project-page header. No dependencies, no build.
// All project metadata comes from /projects/projects.json.
(function () {
  "use strict";

  var REPO = "a-barzanti/ai-rebuilds";
  var BRANCH = "main";
  var STATUSES = [
    { key: "proposed", label: "Proposed", hint: "Someone wants to rebuild it. Nobody has started yet." },
    { key: "analysis", label: "Analysis", hint: "The original is being studied with REA." },
    { key: "rebuilding", label: "Rebuilding", hint: "A web version is being written from the analysis notes." },
    { key: "playable", label: "Playable", hint: "You can play it in the browser, though some parts may be missing." },
    { key: "complete", label: "Complete", hint: "Matches the original's behavior." },
  ];

  // ---------- Helpers ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Escape, then allow `inline code` only.
  function inline(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function statusOf(key) {
    return STATUSES.filter(function (s) { return s.key === key; })[0] || { key: key, label: key, hint: "" };
  }
  function badge(key) {
    var s = statusOf(key);
    return '<span class="badge badge-' + esc(s.key) + '" title="' + esc(s.hint) + '">' + esc(s.label) + "</span>";
  }
  function loadProjects() {
    return fetch("/projects/projects.json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  // ---------- Theme toggle ----------
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // ---------- Home: project grid ----------
  var grid = document.getElementById("project-grid");
  if (grid) initGrid(grid);

  function card(p) {
    var o = p.original || {};
    var platforms = (o.platforms || []).join(", ");
    var search = [p.title, p.summary, o.developer, o.publisher, platforms, (p.tags || []).join(" ")]
      .join(" ")
      .toLowerCase();
    var tasks = (p.help_wanted || []).length;
    return (
      '<article class="card" data-status="' + esc(p.status) + '" data-search="' + esc(search) + '">' +
      '<div class="card-top">' + badge(p.status) +
      (o.year ? '<span class="card-year">' + esc(o.year) + "</span>" : "") + "</div>" +
      '<h3 class="card-title"><a href="/projects/' + esc(p.slug) + '/">' + esc(p.title) + "</a></h3>" +
      '<p class="card-meta">' + esc(o.developer || "Unknown developer") + (platforms ? " · " + esc(platforms) : "") + "</p>" +
      '<p class="card-summary">' + esc(p.summary) + "</p>" +
      (tasks ? '<p class="card-help">' + tasks + " open task" + (tasks === 1 ? "" : "s") + "</p>" : "") +
      "</article>"
    );
  }

  function initGrid(grid) {
    var search = document.getElementById("project-search");
    var chipsBox = document.getElementById("status-chips");
    var empty = document.getElementById("project-empty");
    var count = document.getElementById("project-count");
    var newCard = grid.querySelector(".card-new");
    var status = "all";

    chipsBox.innerHTML =
      '<button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>' +
      STATUSES.map(function (s) {
        return '<button type="button" class="chip" data-filter="' + s.key + '" aria-pressed="false" title="' + esc(s.hint) + '">' + s.label + "</button>";
      }).join("");
    var chips = Array.prototype.slice.call(chipsBox.querySelectorAll(".chip"));

    loadProjects()
      .then(function (projects) {
        projects.sort(function (a, b) { return a.title.localeCompare(b.title); });
        newCard.insertAdjacentHTML("beforebegin", projects.map(card).join(""));
        count.textContent = projects.length;
        apply();
      })
      .catch(function () {
        empty.hidden = false;
        empty.innerHTML = 'Could not load projects. Browse them on <a href="https://github.com/' + REPO + '/tree/' + BRANCH + '/projects">GitHub</a>.';
      });

    function apply() {
      var q = (search.value || "").trim().toLowerCase();
      var cards = grid.querySelectorAll(".card[data-status]");
      var shown = 0;
      Array.prototype.forEach.call(cards, function (c) {
        var ok = (status === "all" || c.dataset.status === status) && (!q || c.dataset.search.indexOf(q) !== -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown !== 0 || cards.length === 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        status = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        apply();
      });
    });
    search.addEventListener("input", apply);
  }

  // ---------- Project page: facts, pipeline, help wanted ----------
  var projectEl = document.querySelector("[data-project]");
  if (projectEl) initProject(projectEl);

  function initProject(el) {
    var slug = el.dataset.project;
    var dir = "projects/" + slug;
    var gh = "https://github.com/" + REPO;

    loadProjects().then(function (projects) {
      var p = projects.filter(function (x) { return x.slug === slug; })[0];
      if (!p) return;
      var o = p.original || {};

      // Actions
      var actions = [];
      if (p.play) {
        var href = /:\/\//.test(p.play) ? p.play : "/" + dir + "/" + p.play.replace(/^\.?\//, "");
        actions.push('<a class="btn btn-primary" href="' + esc(href) + '">Play in browser</a>');
      }
      (p.tools || []).forEach(function (tool) {
        var link = /:\/\//.test(tool.href) ? tool.href : "/" + dir + "/" + tool.href.replace(/^\.?\//, "");
        actions.push('<a class="btn' + (p.play ? "" : " btn-primary") + '" href="' + esc(link) + '">' + esc(tool.label) + "</a>");
      });
      if (p.repo) actions.push('<a class="btn" href="' + esc(p.repo) + '">Project repository</a>');
      actions.push('<a class="btn" href="' + gh + "/tree/" + BRANCH + "/" + dir + '">Project files</a>');
      actions.push('<a class="btn" href="' + gh + "/edit/" + BRANCH + "/" + dir + '/index.html">Edit this page</a>');
      el.querySelector('[data-slot="actions"]').innerHTML = actions.join("");

      // Facts
      var rows = [["Status", badge(p.status)]];
      if (o.developer) rows.push(["Developer", esc(o.developer)]);
      if (o.publisher) rows.push(["Publisher", esc(o.publisher)]);
      if (o.year) rows.push(["Released", esc(o.year)]);
      if (o.platforms && o.platforms.length) rows.push(["Original platform", esc(o.platforms.join(", "))]);
      if (p.target) rows.push(["Rebuild stack", esc(p.target)]);
      rows.push([
        "Maintainers",
        p.maintainers && p.maintainers.length
          ? p.maintainers.map(function (m) { return '<a href="https://github.com/' + esc(m) + '">@' + esc(m) + "</a>"; }).join(", ")
          : 'None yet. <a href="/contribute/">Become one</a>',
      ]);
      el.querySelector('[data-slot="facts"]').innerHTML = rows
        .map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; })
        .join("");

      // Pipeline
      var reached = true;
      el.querySelector('[data-slot="pipeline"]').innerHTML = STATUSES.map(function (s) {
        var current = s.key === p.status;
        var html = '<li class="' + (reached ? "done" : "") + (current ? " current" : "") + '"' +
          (current ? ' aria-current="step"' : "") + '><span class="dot" aria-hidden="true"></span>' + s.label + "</li>";
        if (current) reached = false;
        return html;
      }).join("");

      // Help wanted
      var help = el.querySelector('[data-slot="help"]');
      if (p.help_wanted && p.help_wanted.length) {
        var label = "project:" + slug;
        help.innerHTML =
          '<h2>Help wanted</h2><ul>' +
          p.help_wanted.map(function (t) { return "<li>" + inline(t) + "</li>"; }).join("") +
          '</ul><p class="muted">Pick one, comment on (or open) an issue labeled <a href="' + gh +
          "/issues?q=is%3Aopen+label%3A%22" + encodeURIComponent(label) + '%22"><code>' + esc(label) +
          "</code></a>, and send a pull request.</p>";
        help.hidden = false;
      }
    });
  }
})();
