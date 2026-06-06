/* ============================================================
   Concept Medical — Production Dashboard · charts + data
   Requires Chart.js v4 (UMD) loaded before this file.
   ============================================================ */
(function () {
  "use strict";

  // ---- Brand palette ----
  const C = {
    navy900: "#122248", navy800: "#182B53", navy700: "#213E7B",
    blue600: "#1B499F", blue500: "#1D4E9F", blue400: "#3260AD",
    blue300: "#4D7BBE", blue200: "#00B7F1", blue100: "#97DAF8", blue50: "#E8EFF9",
    success: "#1E9F6E", warning: "#C77700", danger: "#B11F29",
    ink: "#1B202B", muted: "#6B7589", grid: "#EEF1F6", border: "#E1E6EE",
  };
  window.CM_COLORS = C;

  // ---- Theme-aware helpers ----
  function isNavy() { return document.body.getAttribute("data-theme") === "navy"; }
  function tick() { return isNavy() ? "rgba(255,255,255,0.66)" : C.muted; }
  function gridc() { return isNavy() ? "rgba(255,255,255,0.08)" : C.grid; }

  // ---- Global Chart.js defaults ----
  function applyDefaults() {
    if (!window.Chart) return;
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.font.size = 11.5;
    Chart.defaults.font.weight = 500;
    Chart.defaults.color = tick();
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.tooltip.backgroundColor = C.navy900;
    Chart.defaults.plugins.tooltip.titleColor = "#fff";
    Chart.defaults.plugins.tooltip.bodyColor = "rgba(255,255,255,0.86)";
    Chart.defaults.plugins.tooltip.padding = 11;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleFont = { family: "'Poppins', sans-serif", weight: "600", size: 12 };
    Chart.defaults.plugins.tooltip.bodyFont = { family: "'Poppins', sans-serif", size: 12 };
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.plugins.tooltip.usePointStyle = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.animation.duration = 800;
    Chart.defaults.animation.easing = "easeOutQuart";
  }

  const fmtK = (v) => (v >= 1000 ? (v / 1000).toFixed(0) + "K" : v);
  const axisX = () => ({ grid: { display: false }, border: { display: false }, ticks: { color: tick(), font: { weight: 600 } } });
  const axisY = (opts = {}) => ({
    grid: { color: gridc(), drawBorder: false }, border: { display: false },
    ticks: { color: tick(), padding: 6, ...(opts.ticks || {}) }, ...opts,
  });

  const charts = {};
  function make(id, cfg) {
    const el = document.getElementById(id);
    if (!el) return;
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(el.getContext("2d"), cfg);
  }

  // ============================================================
  // DATA (read from the production dashboard, cleaned)
  // ============================================================
  const DATA = {
    capacityDemand: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      capacity: [110, 92, 116, 108, 98, 122],
      demand:   [96, 128, 122, 118, 126, 142],
      confirmed:[58, 84, 100, 105, 112, 130],
    },
    planActual: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      planned: [75, 74, 80, 100, 78, 88, 100],
      actual:  [83, 85, 100, 85, 61, 118, 123],
    },
    rejection: {
      labels: ["Material\nDefect", "Surface\nFlaw", "Machine\nError", "Operator\nError", "Operator\nMistake", "Other"],
      counts: [500, 360, 280, 210, 120, 90],
    },
    productionByFG: {
      labels: ["Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25"],
      values: [14.43, 9.02, 7.62, 16.39, 15.75, 13.38, 11.27, 18.99, 20.66],
    },
    productionByItem: {
      labels: ["Magic Touch SCBC", "Magic Touch PTA", "Semi Finish Balloon", "Abluminus SECSS", "Mitigator SECSS", "Magic Touch AVF", "Magic Touch ED"],
      values: [8.48, 4.99, 4.09, 1.63, 0.42, 0.05, 0.01],
    },
  };
  window.CM_DATA = DATA;

  // ============================================================
  // CHART BUILDERS
  // ============================================================
  function buildAll() {
    applyDefaults();

    // 1) Capacity vs Demand vs Confirmed Orders -------------------
    const cd = DATA.capacityDemand;
    make("chartCapacityDemand", {
      type: "bar",
      data: {
        labels: cd.labels,
        datasets: [
          { label: "Capacity", data: cd.capacity, backgroundColor: C.blue500, borderRadius: 4, barPercentage: 0.72, categoryPercentage: 0.66, order: 3 },
          { label: "Demand", data: cd.demand, backgroundColor: C.blue200, borderRadius: 4, barPercentage: 0.72, categoryPercentage: 0.66, order: 2 },
          { label: "Confirmed Orders", data: cd.confirmed, type: "line", borderColor: C.navy700, backgroundColor: "rgba(33,62,123,0.08)",
            borderWidth: 2.5, tension: 0.38, fill: true, pointBackgroundColor: "#fff", pointBorderColor: C.navy700, pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6, order: 1 },
        ],
      },
      options: {
        layout: { padding: { top: 6 } },
        scales: { x: axisX(), y: axisY({ ticks: { callback: (v) => v + "K", color: tick(), padding: 6 }, suggestedMax: 160 }) },
        plugins: { tooltip: { callbacks: { label: (c) => "  " + c.dataset.label + ": " + c.parsed.y + "K units" } } },
      },
    });

    // 2) Production Plan vs Actual --------------------------------
    const pa = DATA.planActual;
    make("chartPlanActual", {
      type: "bar",
      data: {
        labels: pa.labels,
        datasets: [
          { label: "Planned", data: pa.planned, backgroundColor: C.navy700, borderRadius: 4, barPercentage: 0.84, categoryPercentage: 0.6 },
          { label: "Actual", data: pa.actual, backgroundColor: C.blue200, borderRadius: 4, barPercentage: 0.84, categoryPercentage: 0.6 },
        ],
      },
      options: {
        scales: { x: axisX(), y: axisY({ ticks: { callback: (v) => v + "K", color: tick(), padding: 6 }, suggestedMax: 140 }) },
        plugins: { tooltip: { callbacks: { label: (c) => "  " + c.dataset.label + ": " + c.parsed.y + "K units" } } },
      },
    });

    // 3) Rejection Pareto -----------------------------------------
    const rj = DATA.rejection;
    const total = rj.counts.reduce((a, b) => a + b, 0);
    let run = 0;
    const cum = rj.counts.map((v) => { run += v; return +((run / total) * 100).toFixed(1); });
    make("chartPareto", {
      type: "bar",
      data: {
        labels: rj.labels,
        datasets: [
          { label: "Rejections", data: rj.counts, backgroundColor: rj.counts.map((_, i) => (i === 0 ? C.danger : C.blue500)), borderRadius: 4, barPercentage: 0.7, order: 2, yAxisID: "y" },
          { label: "Cumulative %", data: cum, type: "line", borderColor: C.warning, backgroundColor: C.warning, borderWidth: 2.5, tension: 0.3,
            pointBackgroundColor: "#fff", pointBorderColor: C.warning, pointBorderWidth: 2, pointRadius: 3.5, pointHoverRadius: 5.5, order: 1, yAxisID: "y1" },
        ],
      },
      options: {
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: tick(), font: { weight: 600, size: 10 }, maxRotation: 0, autoSkip: false } },
          y: axisY({ ticks: { color: tick(), padding: 6 }, position: "left" }),
          y1: { position: "right", grid: { display: false }, border: { display: false }, min: 0, max: 100, ticks: { color: tick(), callback: (v) => v + "%", padding: 4 } },
        },
        plugins: { tooltip: { callbacks: { label: (c) => (c.dataset.yAxisID === "y1" ? "  Cumulative: " + c.parsed.y + "%" : "  " + c.parsed.y + " units") } } },
      },
    });

    // 4) Production by FG (monthly) -------------------------------
    const fg = DATA.productionByFG;
    make("chartProductionFG", {
      type: "bar",
      data: { labels: fg.labels, datasets: [{ label: "Output", data: fg.values, backgroundColor: C.blue400, hoverBackgroundColor: C.blue500, borderRadius: 4, barPercentage: 0.66 }] },
      options: {
        scales: { x: axisX(), y: axisY({ ticks: { callback: (v) => v + "K", color: tick(), padding: 6 } }) },
        plugins: { tooltip: { callbacks: { label: (c) => "  " + c.parsed.y + "K units produced" } } },
      },
    });

    // 5) Production FG by Item (horizontal) -----------------------
    const it = DATA.productionByItem;
    make("chartProductionItem", {
      type: "bar",
      data: { labels: it.labels, datasets: [{ label: "Output", data: it.values, backgroundColor: C.blue500, hoverBackgroundColor: C.navy700, borderRadius: 4, barPercentage: 0.7 }] },
      options: {
        indexAxis: "y",
        scales: {
          x: axisY({ ticks: { callback: (v) => v + "K", color: tick(), padding: 6 } }),
          y: { grid: { display: false }, border: { display: false }, ticks: { color: tick(), font: { weight: 600, size: 11 } } },
        },
        plugins: { tooltip: { callbacks: { label: (c) => "  " + c.parsed.x + "K units" } } },
      },
    });

    // 6) Yield doughnut -------------------------------------------
    make("chartYield", {
      type: "doughnut",
      data: { labels: ["Yield", "Loss"], datasets: [{ data: [92, 8], backgroundColor: [C.success, isNavy() ? "rgba(255,255,255,0.12)" : C.neutral200 || "#E1E6EE"], borderWidth: 0, hoverOffset: 0 }] },
      options: { cutout: "76%", rotation: -90, circumference: 360, plugins: { tooltip: { callbacks: { label: (c) => "  " + c.label + ": " + c.parsed + "%" } } } },
    });

    // 7) First-pass quality doughnut ------------------------------
    make("chartFPY", {
      type: "doughnut",
      data: { labels: ["First Pass", "Rework"], datasets: [{ data: [91.5, 8.5], backgroundColor: [C.blue500, isNavy() ? "rgba(255,255,255,0.12)" : "#E1E6EE"], borderWidth: 0 }] },
      options: { cutout: "76%", rotation: -90, plugins: { tooltip: { callbacks: { label: (c) => "  " + c.label + ": " + c.parsed + "%" } } } },
    });
  }

  window.CM_buildCharts = buildAll;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildAll);
  } else {
    buildAll();
  }
})();
