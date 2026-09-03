/*!
 * Lebenszeit-Kosten-Rechner — Embeddable Widget
 * von welches-hundefutter.today
 *
 * Einbindung auf jeder Website:
 *   <div id="whf-lebenszeit-rechner"></div>
 *   <script src="https://welches-hundefutter.today/embed/lebenszeit-rechner.js" async></script>
 *
 * Komplett eigenständig: keine Abhängigkeiten, kein iframe, keine externen Requests.
 * Rechnet lokal (RER-Formel) und setzt einen Marken-Link zurück (das ist der Sinn).
 */
(function () {
  "use strict";

  // --- Konstanten (gleiche Mathematik wie auf der Hauptseite) ---
  var ACTIVITY = 1.6; // normalaktiver erwachsener Hund
  var KCAL_PER_G_DRY = 3.65; // ~3650 kcal/kg Trockenfutter
  var DAYS_PER_MONTH = 30.4;
  var PRICE_PER_KG = 6.0; // realistischer Schnitt für solides Trockenfutter (€/kg)

  // Rasse-Presets: [Gewicht kg, Lebenserwartung Jahre]
  var BREEDS = [
    ["Chihuahua", 2.5, 15],
    ["Yorkshire Terrier", 3, 14],
    ["Französische Bulldogge", 11, 11],
    ["Beagle", 12, 13],
    ["Border Collie", 18, 13],
    ["Labrador", 30, 12],
    ["Golden Retriever", 31, 12],
    ["Schäferhund", 33, 11],
    ["Rottweiler", 45, 9],
    ["Deutsche Dogge", 60, 8]
  ];

  var state = { kg: 30, years: 12, breed: "Labrador" };

  // --- Mathematik ---
  function monthlyCost(kg) {
    var rer = 70 * Math.pow(kg, 0.75);
    var mer = rer * ACTIVITY;
    var gramsDay = mer / KCAL_PER_G_DRY;
    var kgMonth = (gramsDay * DAYS_PER_MONTH) / 1000;
    return kgMonth * PRICE_PER_KG;
  }
  function eur(n) {
    return n.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
  }

  // --- Mount-Punkt finden ---
  var mount = document.getElementById("whf-lebenszeit-rechner");
  if (!mount) {
    var sc = document.currentScript;
    if (sc && sc.parentNode) {
      mount = document.createElement("div");
      sc.parentNode.insertBefore(mount, sc);
    } else {
      return; // kein Platz zum Rendern
    }
  }

  // --- Styles (einmalig, gescoped) ---
  if (!document.getElementById("whf-rechner-styles")) {
    var css =
      ".whf-root{all:initial;display:block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:440px;margin:18px auto;background:#ffffff;color:#1a1726;border:1px solid #ececf0;border-radius:18px;box-shadow:0 6px 24px rgba(20,16,40,.08);overflow:hidden;line-height:1.45;box-sizing:border-box}" +
      ".whf-root *{box-sizing:border-box;font-family:inherit}" +
      ".whf-head{padding:18px 20px 12px}" +
      ".whf-title{font-size:18px;font-weight:800;margin:0 0 2px}" +
      ".whf-sub{font-size:13px;color:#7c7689;margin:0}" +
      ".whf-body{padding:4px 20px 16px}" +
      ".whf-chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 14px}" +
      ".whf-chip{font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px;border:1px solid #e4e2ea;background:#faf9fc;color:#403a4f;cursor:pointer;transition:all .12s}" +
      ".whf-chip:hover{border-color:#f0a73c}" +
      ".whf-chip[aria-pressed='true']{background:#f0a73c;border-color:#f0a73c;color:#fff}" +
      ".whf-row{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:#7c7689;margin:2px 0 6px}" +
      ".whf-row b{color:#1a1726;font-size:15px;font-weight:700}" +
      ".whf-slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:99px;background:#ececf0;outline:none;margin:2px 0 4px}" +
      ".whf-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:#f0a73c;cursor:pointer;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2)}" +
      ".whf-slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#f0a73c;cursor:pointer;border:3px solid #fff}" +
      ".whf-result{margin:16px 0 6px;padding:16px;border-radius:14px;background:linear-gradient(135deg,#fff6e9,#fdeecf);text-align:center}" +
      ".whf-month{font-size:14px;color:#7a5a1e;margin:0 0 2px}" +
      ".whf-month b{font-size:20px;color:#9a6b16}" +
      ".whf-life{font-size:13px;color:#7a5a1e;margin:6px 0 0}" +
      ".whf-life b{font-size:30px;font-weight:900;color:#1a1726;display:block;line-height:1.1;margin-top:2px}" +
      ".whf-note{font-size:11px;color:#9a93a6;margin:10px 0 0;text-align:center}" +
      ".whf-foot{display:block;padding:11px 20px;background:#faf9fc;border-top:1px solid #f0eef4;text-align:center}" +
      ".whf-foot a{font-size:12px;font-weight:700;color:#c07d1a;text-decoration:none}" +
      ".whf-foot a:hover{text-decoration:underline}";
    var st = document.createElement("style");
    st.id = "whf-rechner-styles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  // --- Markup ---
  mount.className = "whf-root";
  mount.innerHTML =
    '<div class="whf-head">' +
    '<p class="whf-title">Was kostet dein Hund ein Leben lang?</p>' +
    '<p class="whf-sub">Rasse wählen oder Gewicht schieben \u2013 Futterkosten fürs ganze Hundeleben.</p>' +
    "</div>" +
    '<div class="whf-body">' +
    '<div class="whf-chips" id="whf-chips"></div>' +
    '<div class="whf-row"><span>Gewicht</span><b><span id="whf-kg">30</span> kg</b></div>' +
    '<input class="whf-slider" id="whf-kg-slider" type="range" min="1" max="80" step="1" value="30">' +
    '<div class="whf-row"><span>Lebenserwartung</span><b><span id="whf-yr">12</span> Jahre</b></div>' +
    '<input class="whf-slider" id="whf-yr-slider" type="range" min="6" max="18" step="1" value="12">' +
    '<div class="whf-result">' +
    '<p class="whf-month">ca. <b id="whf-month">0 €</b> pro Monat</p>' +
    '<p class="whf-life">fürs ganze Hundeleben:<b id="whf-life">0 €</b></p>' +
    "</div>" +
    '<p class="whf-note">Schätzung nur für Futter (Trockenfutter, normalaktiver Hund). Tierarzt, Steuer, Zubehör kommen obendrauf.</p>' +
    "</div>" +
    '<div class="whf-foot"><a href="https://welches-hundefutter.today/tools/lebenszeit-kosten?utm_source=widget&utm_medium=embed" target="_blank" rel="noopener">\uD83D\uDC3E Lebenszeit-Rechner von welches-hundefutter.today</a></div>';

  // --- Elemente ---
  var chipsEl = mount.querySelector("#whf-chips");
  var kgSlider = mount.querySelector("#whf-kg-slider");
  var yrSlider = mount.querySelector("#whf-yr-slider");
  var kgLabel = mount.querySelector("#whf-kg");
  var yrLabel = mount.querySelector("#whf-yr");
  var monthEl = mount.querySelector("#whf-month");
  var lifeEl = mount.querySelector("#whf-life");

  // Rasse-Chips
  BREEDS.forEach(function (b) {
    var chip = document.createElement("button");
    chip.className = "whf-chip";
    chip.type = "button";
    chip.textContent = b[0];
    chip.setAttribute("aria-pressed", b[0] === state.breed ? "true" : "false");
    chip.addEventListener("click", function () {
      state.kg = b[1];
      state.years = b[2];
      state.breed = b[0];
      kgSlider.value = b[1];
      yrSlider.value = b[2];
      render();
    });
    chipsEl.appendChild(chip);
  });

  kgSlider.addEventListener("input", function () {
    state.kg = parseInt(kgSlider.value, 10);
    state.breed = null; // freie Eingabe -> Chip-Auswahl lösen
    render();
  });
  yrSlider.addEventListener("input", function () {
    state.years = parseInt(yrSlider.value, 10);
    render();
  });

  function render() {
    kgLabel.textContent = state.kg;
    yrLabel.textContent = state.years;
    var m = monthlyCost(state.kg);
    monthEl.textContent = eur(m);
    lifeEl.textContent = eur(m * 12 * state.years);
    var chips = chipsEl.querySelectorAll(".whf-chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].setAttribute("aria-pressed", chips[i].textContent === state.breed ? "true" : "false");
    }
  }

  render();
})();
