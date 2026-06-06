/* ============================================================
   Concept Medical — Production Dashboard · interactions
   ============================================================ */
(function () {
  "use strict";

  // ---- Theme toggle (persisted) ----
  const THEME_KEY = "cm-dash-theme";
  const body = document.body;
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "navy") body.setAttribute("data-theme", "navy");

  function setTheme(t) {
    if (t === "navy") body.setAttribute("data-theme", "navy");
    else body.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, t);
    if (window.CM_buildCharts) window.CM_buildCharts();
  }

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(body.getAttribute("data-theme") === "navy" ? "light" : "navy");
    });
  }

  // ---- Scrollspy nav ----
  const navItems = Array.from(document.querySelectorAll(".nav-item[data-target]"));
  const sections = navItems
    .map((n) => document.getElementById(n.getAttribute("data-target")))
    .filter(Boolean);

  navItems.forEach((n) => {
    n.addEventListener("click", function (e) {
      e.preventDefault();
      const t = document.getElementById(n.getAttribute("data-target"));
      if (t) window.scrollTo({ top: t.offsetTop - 76, behavior: "smooth" });
    });
  });

  function onScroll() {
    const y = window.scrollY + 120;
    let active = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= y) active = s;
    }
    navItems.forEach((n) =>
      n.classList.toggle("is-active", active && n.getAttribute("data-target") === active.id)
    );
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Filters: lightweight visual feedback ----
  const subtitleEl = document.getElementById("filterSubtitle");
  function refreshSubtitle() {
    const u = document.getElementById("fUnit");
    const m = document.getElementById("fMonth");
    const fy = document.getElementById("fFY");
    if (subtitleEl && u && m && fy) {
      subtitleEl.textContent =
        "Unit " + u.value + " · " + m.value + " · FY " + fy.value;
    }
  }
  ["fUnit", "fBatch", "fFY", "fMonth"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", function () {
      refreshSubtitle();
      // pulse the content to acknowledge the filter change
      const c = document.querySelector(".content");
      if (c) {
        c.style.transition = "opacity 120ms ease";
        c.style.opacity = "0.55";
        setTimeout(function () { c.style.opacity = "1"; }, 140);
      }
    });
  });
  refreshSubtitle();

  // ---- Animate bar widths on first view ----
  const animateBars = function () {
    document.querySelectorAll("[data-w]").forEach(function (el) {
      el.style.width = el.getAttribute("data-w");
    });
  };
  if (document.readyState === "complete") animateBars();
  else window.addEventListener("load", function () { setTimeout(animateBars, 120); });
})();
