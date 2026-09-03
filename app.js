/* =========================================================================
   Hospital Directory — India
   Vanilla JS. No build step, no dependencies, no server.
   Designed to stay responsive with tens of thousands of records.
   ========================================================================= */
(function () {
  "use strict";

  var PAGE = 30;                 // records rendered per chunk
  var STORE_KEY = "ih.prefs.v1";
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- utils */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function fold(s) {
    return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }
  function num(n) { return typeof n === "number" ? n.toLocaleString("en-IN") : null; }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function debounce(fn, ms) {
    var t; return function () {
      var a = arguments, c = this;
      clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms);
    };
  }

  var OWN_LABEL = { government: "Government", private: "Private", trust: "Trust / charitable" };

  /* ----------------------------------------------------------- preferences */

  var DEFAULT_PREFS = {
    theme: "system", accent: "clinical", scale: "m",
    density: "comfortable", view: "rows", motion: "full"
  };
  var prefs = Object.assign({}, DEFAULT_PREFS);
  var storageOK = true;

  function loadPrefs() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) prefs = Object.assign({}, DEFAULT_PREFS, JSON.parse(raw));
    } catch (e) { storageOK = false; }
  }
  function savePrefs() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(prefs)); }
    catch (e) { storageOK = false; reflectStorageNote(); }
  }
  function applyPrefs() {
    var el = document.documentElement;
    var theme = prefs.theme;
    if (theme === "system") {
      theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-accent", prefs.accent);
    el.setAttribute("data-scale", prefs.scale);
    el.setAttribute("data-density", prefs.density);
    el.setAttribute("data-view", prefs.view);
    el.setAttribute("data-motion", prefs.motion);

    $$("[data-pref]").forEach(function (group) {
      var key = group.getAttribute("data-pref");
      $$("[data-val]", group).forEach(function (b) {
        b.setAttribute("aria-checked", String(b.getAttribute("data-val") === prefs[key]));
      });
    });
  }
  function reflectStorageNote() {
    var n = $("#storeNote");
    if (!n) return;
    n.textContent = storageOK
      ? "Settings are stored in this browser only."
      : "This browser is blocking local storage, so settings reset when you close the tab.";
  }

  /* ------------------------------------------------------------ data layer */

  var DB = [];        // normalised records
  var byId = {};

  function normalise(raw, i) {
    var r = Object.assign({}, raw);
    r.id = r.id || ("h" + i);
    r.name = r.name || "Unnamed facility";
    r.ownership = r.ownership || {};
    r.location = r.location || {};
    r.contact = r.contact || {};
    r.insurance = r.insurance || {};
    r.specialties = arr(r.specialties);
    r.services = arr(r.services);
    r.accreditation = arr(r.accreditation);
    r.keyDoctors = arr(r.keyDoctors);
    r.sources = arr(r.sources);
    r.type = ["government", "private", "trust"].indexOf(r.type) >= 0 ? r.type : "private";

    r._blob = fold([
      r.name, r.aka, r.location.city, r.location.district, r.location.state,
      r.specialties.join(" "), r.ownership.owner
    ].join(" "));
    return r;
  }

  /* ----------------------------------------------------------- query state */

  var Q = {
    q: "",
    state: "",
    city: "",
    type: [],        // ownership
    spec: [],        // specialties
    accr: [],
    ins: [],
    er: false,
    sort: "name"
  };

  function readHash() {
    var h = location.hash.replace(/^#/, "");
    var p = new URLSearchParams(h);
    Q.q     = p.get("q") || "";
    Q.state = p.get("state") || "";
    Q.city  = p.get("city") || "";
    Q.type  = (p.get("type") || "").split(",").filter(Boolean);
    Q.spec  = (p.get("spec") || "").split(",").filter(Boolean);
    Q.accr  = (p.get("accr") || "").split(",").filter(Boolean);
    Q.ins   = (p.get("ins")  || "").split(",").filter(Boolean);
    Q.er    = p.get("er") === "1";
    Q.sort  = p.get("sort") || "name";
    return p.get("h") || "";
  }

  var suppressHash = false;
  function writeHash(detailId) {
    var p = new URLSearchParams();
    if (Q.q) p.set("q", Q.q);
    if (Q.state) p.set("state", Q.state);
    if (Q.city) p.set("city", Q.city);
    if (Q.type.length) p.set("type", Q.type.join(","));
    if (Q.spec.length) p.set("spec", Q.spec.join(","));
    if (Q.accr.length) p.set("accr", Q.accr.join(","));
    if (Q.ins.length)  p.set("ins", Q.ins.join(","));
    if (Q.er) p.set("er", "1");
    if (Q.sort !== "name") p.set("sort", Q.sort);
    if (detailId) p.set("h", detailId);
    suppressHash = true;
    location.hash = p.toString();
    setTimeout(function () { suppressHash = false; }, 0);
  }

  function activeFilterCount() {
    return (Q.state ? 1 : 0) + (Q.city ? 1 : 0) + Q.type.length + Q.spec.length +
           Q.accr.length + Q.ins.length + (Q.er ? 1 : 0);
  }

  /* -------------------------------------------------------------- matching */

  function matches(r, skip) {
    if (Q.q) {
      var terms = fold(Q.q).split(" ");
      for (var i = 0; i < terms.length; i++) {
        if (r._blob.indexOf(terms[i]) === -1) return false;
      }
    }
    if (skip !== "state" && Q.state && r.location.state !== Q.state) return false;
    if (skip !== "city"  && Q.city  && r.location.city  !== Q.city)  return false;
    if (skip !== "type"  && Q.type.length && Q.type.indexOf(r.type) === -1) return false;
    if (skip !== "er"    && Q.er && !r.contact.emergency) return false;

    if (skip !== "spec" && Q.spec.length) {
      for (var s = 0; s < Q.spec.length; s++) {
        if (r.specialties.indexOf(Q.spec[s]) === -1) return false;
      }
    }
    if (skip !== "accr" && Q.accr.length) {
      for (var a = 0; a < Q.accr.length; a++) {
        if (r.accreditation.indexOf(Q.accr[a]) === -1) return false;
      }
    }
    if (skip !== "ins" && Q.ins.length) {
      var pool = arr(r.insurance.schemes).concat(arr(r.insurance.cashless));
      for (var n = 0; n < Q.ins.length; n++) {
        if (pool.indexOf(Q.ins[n]) === -1) return false;
      }
    }
    return true;
  }

  var SORTERS = {
    name:  function (a, b) { return a.name.localeCompare(b.name); },
    city:  function (a, b) { return (a.location.city || "").localeCompare(b.location.city || "") || a.name.localeCompare(b.name); },
    beds:  function (a, b) { return (b.beds || -1) - (a.beds || -1) || a.name.localeCompare(b.name); },
    founded: function (a, b) { return (a.ownership.founded || 9999) - (b.ownership.founded || 9999); }
  };

  var current = [];
  var shown = 0;

  function runQuery() {
    current = DB.filter(function (r) { return matches(r); });
    current.sort(SORTERS[Q.sort] || SORTERS.name);
    shown = 0;
    $("#list").innerHTML = "";
    $("#empty").hidden = current.length > 0;
    $("#count").innerHTML = current.length
      ? "<b>" + num(current.length) + "</b> " + (current.length === 1 ? "hospital" : "hospitals")
      : "No matches";
    renderChunk();
    renderChips();
    buildFilters();
    var fc = $("#filterCount"), n = activeFilterCount();
    fc.hidden = n === 0; fc.textContent = n;
  }

  /* ------------------------------------------------------------- list view */

  function recordHTML(r) {
    var loc = [r.location.city, r.location.district, r.location.state].filter(Boolean).join(", ");
    var facts = [];
    if (r.beds) facts.push("<b>" + num(r.beds) + "</b> beds");
    if (r.ownership.founded) facts.push("Since <b>" + esc(r.ownership.founded) + "</b>");
    if (r.ownership.owner) facts.push(esc(r.ownership.owner));

    var tags = ['<span class="tag tag--own">' + esc(OWN_LABEL[r.type]) + "</span>"];
    r.accreditation.slice(0, 2).forEach(function (a) {
      tags.push('<span class="tag tag--seal">' + esc(a) + "</span>");
    });
    if (r.contact.emergency) tags.push('<span class="tag tag--er">24×7 emergency</span>');
    if (r.dataStatus && r.dataStatus !== "verified") tags.push('<span class="tag tag--warn">Unverified</span>');

    var depts = r.specialties.length
      ? r.specialties.slice(0, 4).map(esc).join(" · ") +
        (r.specialties.length > 4 ? ' <em>+' + (r.specialties.length - 4) + " more</em>" : "")
      : '<em>Departments not recorded</em>';

    return '<li><button class="rec" type="button" data-id="' + esc(r.id) + '" data-own="' + esc(r.type) + '">' +
      '<div class="rec__name">' + esc(r.name) +
        (r.aka ? '<span class="rec__aka">' + esc(r.aka) + "</span>" : "") + "</div>" +
      '<div class="rec__where">' + esc(loc || "Location not recorded") + "</div>" +
      (facts.length ? '<div class="rec__facts">' + facts.map(function (f) { return "<span>" + f + "</span>"; }).join("") + "</div>" : "") +
      '<div class="rec__depts">' + depts + "</div>" +
      '<div class="dhead__tags" style="margin-top:11px">' + tags.join("") + "</div>" +
      "</button></li>";
  }

  function renderChunk() {
    if (shown >= current.length) return;
    var slice = current.slice(shown, shown + PAGE);
    var frag = document.createElement("div");
    frag.innerHTML = slice.map(recordHTML).join("");
    var list = $("#list");
    while (frag.firstChild) list.appendChild(frag.firstChild);
    shown += slice.length;
  }

  function renderChips() {
    var host = $("#chips");
    var out = [];
    function chip(kind, val, label) {
      out.push('<button class="chip" type="button" data-kind="' + kind + '" data-val="' + esc(val) + '">' +
        "<b>" + esc(label) + "</b><span>&times;</span></button>");
    }
    if (Q.state) chip("state", Q.state, Q.state);
    if (Q.city) chip("city", Q.city, Q.city);
    Q.type.forEach(function (v) { chip("type", v, OWN_LABEL[v]); });
    Q.spec.forEach(function (v) { chip("spec", v, v); });
    Q.accr.forEach(function (v) { chip("accr", v, v); });
    Q.ins.forEach(function (v)  { chip("ins", v, v); });
    if (Q.er) chip("er", "1", "24×7 emergency");

    host.innerHTML = out.join("");
    host.hidden = out.length === 0;
  }

  /* -------------------------------------------------------------- facets */

  function facet(key, getter) {
    var pool = DB.filter(function (r) { return matches(r, key); });
    var counts = {};
    pool.forEach(function (r) {
      var vals = getter(r);
      (Array.isArray(vals) ? vals : [vals]).forEach(function (v) {
        if (v == null || v === "") return;
        counts[v] = (counts[v] || 0) + 1;
      });
    });
    return Object.keys(counts).sort().map(function (k) { return { v: k, n: counts[k] }; });
  }

  var expanded = {};

  function checkGroup(title, kind, items, selected, limit, labels) {
    if (!items.length) return "";
    var open = expanded[kind];
    var vis = open ? items : items.slice(0, limit || 6);
    var body = vis.map(function (it) {
      var on = selected.indexOf(it.v) >= 0;
      var label = (labels && labels[it.v]) || it.v;
      return '<label class="opt"><input type="checkbox" data-kind="' + kind + '" value="' + esc(it.v) + '"' +
        (on ? " checked" : "") + '><span>' + esc(label) + '</span><span class="opt__n">' + it.n + "</span></label>";
    }).join("");
    var more = items.length > vis.length || open
      ? '<button class="fmore" type="button" data-more="' + kind + '">' +
        (open ? "Show fewer" : "Show all " + items.length) + "</button>"
      : "";
    return '<div class="fgroup"><div class="fgroup__h">' + esc(title) + "</div>" + body + more + "</div>";
  }

  function filtersHTML() {
    var states = facet("state", function (r) { return r.location.state; });
    var cities = Q.state
      ? facet("city", function (r) { return r.location.state === Q.state ? r.location.city : null; })
      : [];

    var html = "";

    html += '<div class="fgroup"><div class="fgroup__h">State or union territory</div>' +
      '<select data-kind="state"><option value="">All of India</option>' +
      states.map(function (s) {
        return '<option value="' + esc(s.v) + '"' + (Q.state === s.v ? " selected" : "") + ">" +
          esc(s.v) + " (" + s.n + ")</option>";
      }).join("") + "</select></div>";

    if (cities.length) {
      html += '<div class="fgroup"><div class="fgroup__h">City</div>' +
        '<select data-kind="city"><option value="">All cities</option>' +
        cities.map(function (c) {
          return '<option value="' + esc(c.v) + '"' + (Q.city === c.v ? " selected" : "") + ">" +
            esc(c.v) + " (" + c.n + ")</option>";
        }).join("") + "</select></div>";
    }

    html += checkGroup("Ownership", "type",
      facet("type", function (r) { return r.type; }), Q.type, 6, OWN_LABEL);

    html += '<div class="fgroup"><div class="fgroup__h">Emergency</div>' +
      '<label class="opt"><input type="checkbox" data-kind="er" value="1"' + (Q.er ? " checked" : "") +
      '><span>Has 24×7 casualty</span></label></div>';

    html += checkGroup("Department", "spec", facet("spec", function (r) { return r.specialties; }), Q.spec, 8);
    html += checkGroup("Accreditation", "accr", facet("accr", function (r) { return r.accreditation; }), Q.accr, 6);
    html += checkGroup("Insurance & schemes", "ins", facet("ins", function (r) {
      return arr(r.insurance.schemes).concat(arr(r.insurance.cashless));
    }), Q.ins, 8);

    return html;
  }

  function buildFilters() {
    var html = filtersHTML();
    $("#filterHost").innerHTML = html;
    $("#filterHostMobile").innerHTML = html;
  }

  /* ------------------------------------------------------------ detail view */

  function gap(what, field) {
    return '<div class="gap"><b>' + esc(what) + " is not recorded for this hospital.</b>" +
      "This directory only shows information that has been entered and checked. Add it to " +
      "<code>" + esc(field) + "</code> in <code>data/hospitals.js</code>, with a source link, and it appears here.</div>";
  }

  function detailHTML(r) {
    var loc = [r.location.address, r.location.city, r.location.district, r.location.state, r.location.pincode]
      .filter(Boolean).join(", ");

    var tags = ['<span class="tag tag--own">' + esc(OWN_LABEL[r.type]) + "</span>"];
    r.accreditation.forEach(function (a) { tags.push('<span class="tag tag--seal">' + esc(a) + "</span>"); });
    if (r.contact.emergency) tags.push('<span class="tag tag--er">24×7 emergency</span>');
    if (r.dataStatus && r.dataStatus !== "verified") tags.push('<span class="tag tag--warn">Unverified record</span>');

    var stats = [];
    if (r.beds) stats.push({ k: "Bed strength", v: num(r.beds) });
    if (r.ownership.founded) stats.push({ k: "Established", v: r.ownership.founded });
    if (r.specialties.length) stats.push({ k: "Departments", v: r.specialties.length });
    if (r.location.city) stats.push({ k: "City", v: r.location.city });
    if (r.ownership.owner) stats.push({ k: "Owner", v: '<small>' + esc(r.ownership.owner) + "</small>" });

    var out = "";
    out += '<button class="back" type="button" id="backBtn">&larr; All hospitals</button>';

    out += '<div class="dhead" style="--rail:var(--own-' +
      (r.type === "trust" ? "trust" : r.type === "government" ? "gov" : "private") + ')">' +
      '<div class="dhead__own">' + esc(OWN_LABEL[r.type]) + " hospital</div>" +
      "<h1>" + esc(r.name) + "</h1>" +
      (r.aka ? '<p class="dhead__aka">Also known as ' + esc(r.aka) + "</p>" : "") +
      '<div class="dhead__tags">' + tags.join("") + "</div></div>";

    if (stats.length) {
      out += '<div class="stats">' + stats.map(function (s) {
        return '<div class="stat"><div class="stat__k">' + esc(s.k) + '</div><div class="stat__v">' + s.v + "</div></div>";
      }).join("") + "</div>";
    }

    out += '<div class="dbody"><div>';

    /* history & ownership */
    out += '<section class="sec" id="s-history"><h2 class="sec__h">History and ownership</h2>';
    if (r.ownership.history || r.ownership.foundedBy || r.ownership.owner) {
      out += '<div class="prose">';
      if (r.ownership.history) out += "<p>" + esc(r.ownership.history) + "</p>";
      var line = [];
      if (r.ownership.foundedBy) line.push("Founded by " + esc(r.ownership.foundedBy));
      if (r.ownership.founded) line.push("in " + esc(r.ownership.founded));
      if (r.ownership.owner) line.push("· Currently operated by " + esc(r.ownership.owner));
      if (line.length) out += "<p>" + line.join(" ") + ".</p>";
      out += "</div>";
    } else {
      out += gap("Founding history and ownership", "ownership.history");
    }
    out += "</section>";

    /* departments — the enamel board */
    out += '<section class="sec" id="s-depts"><h2 class="sec__h">Departments and specialities</h2>';
    out += r.specialties.length
      ? '<div class="board">' + r.specialties.map(function (s) {
          return '<div class="board__i">' + esc(s) + "</div>";
        }).join("") + "</div>"
      : gap("The department list", "specialties");
    out += "</section>";

    /* services */
    if (r.services.length) {
      out += '<section class="sec" id="s-services"><h2 class="sec__h">Facilities and services</h2>' +
        '<div class="board">' + r.services.map(function (s) {
          return '<div class="board__i">' + esc(s) + "</div>";
        }).join("") + "</div></section>";
    }

    /* doctors */
    out += '<section class="sec" id="s-doctors"><h2 class="sec__h">Senior clinicians and leadership</h2>';
    out += r.keyDoctors.length
      ? '<div class="people">' + r.keyDoctors.map(function (d) {
          return '<div class="person"><div class="person__n">' + esc(d.name) + "</div>" +
            (d.role ? '<div class="person__r">' + esc(d.role) + (d.department ? " · " + esc(d.department) : "") + "</div>" : "") +
            (d.qualification ? '<div class="person__q">' + esc(d.qualification) + "</div>" : "") + "</div>";
        }).join("") + "</div>" +
        '<p class="pref__note" style="margin-top:10px">Names of practising doctors change often. Confirm on the hospital\u2019s own site before relying on this.</p>'
      : gap("Doctor and leadership information", "keyDoctors[]");
    out += "</section>";

    /* insurance */
    out += '<section class="sec" id="s-insurance"><h2 class="sec__h">Insurance and government schemes</h2>';
    var schemes = arr(r.insurance.schemes), cashless = arr(r.insurance.cashless), tpa = arr(r.insurance.tpa);
    if (schemes.length || cashless.length || tpa.length) {
      out += '<div class="panel">';
      if (schemes.length)  out += '<div class="panel__r"><div>Government schemes</div><span>' + schemes.map(esc).join(", ") + "</span></div>";
      if (cashless.length) out += '<div class="panel__r"><div>Cashless insurers</div><span>' + cashless.map(esc).join(", ") + "</span></div>";
      if (tpa.length)      out += '<div class="panel__r"><div>Third-party administrators</div><span>' + tpa.map(esc).join(", ") + "</span></div>";
      out += "</div>";
      out += '<p class="pref__note" style="margin-top:10px">Empanelment changes without notice. Call the hospital\u2019s insurance desk before admission.</p>';
    } else {
      out += gap("Insurance empanelment", "insurance.schemes / insurance.cashless");
    }
    out += "</section>";

    /* reviews */
    out += '<section class="sec" id="s-reviews"><h2 class="sec__h">Patient feedback</h2>';
    if (r.ratings && r.ratings.score) {
      out += '<div class="panel"><div class="panel__r"><div>' + esc(r.ratings.source || "Rating") +
        "</div><span>" + esc(r.ratings.score) + " / 5" +
        (r.ratings.count ? " · " + num(r.ratings.count) + " ratings" : "") + "</span></div></div>";
    } else {
      out += '<div class="gap"><b>No patient feedback is published here.</b>' +
        "Reviews on Google, Practo and similar platforms are licensed content and cannot be copied into a static site. " +
        "To show live ratings, link out to the source, or call a ratings API from your own backend and store the aggregate score in " +
        "<code>ratings</code>.</div>";
    }
    out += "</section>";

    out += "</div>"; /* /main column */

    /* aside */
    out += '<aside class="aside">';
    out += '<div class="acard"><h3>Visit</h3><dl class="kv">';
    if (loc) out += "<dt>Address</dt><dd>" + esc(loc) + "</dd>";
    if (r.contact.phone) out += "<dt>Reception</dt><dd><a href=\"tel:" + esc(r.contact.phone.replace(/\s/g, "")) + "\">" + esc(r.contact.phone) + "</a></dd>";
    if (r.contact.emergency) out += '<dt>Casualty</dt><dd class="er"><a href="tel:' + esc(r.contact.emergency.replace(/\s/g, "")) + '">' + esc(r.contact.emergency) + "</a></dd>";
    if (r.contact.email) out += "<dt>Email</dt><dd><a href=\"mailto:" + esc(r.contact.email) + "\">" + esc(r.contact.email) + "</a></dd>";
    if (r.contact.website) out += '<dt>Website</dt><dd><a href="' + esc(r.contact.website) + '" target="_blank" rel="noopener noreferrer">Official site</a></dd>';
    out += "</dl>";
    if (r.location.lat && r.location.lng) {
      out += '<a class="btn" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(r.location.lat + "," + r.location.lng) + '">Open in Maps</a>';
    } else if (loc) {
      out += '<a class="btn" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(r.name + " " + loc) + '">Open in Maps</a>';
    }
    out += "</div>";

    out += '<div class="acard"><h3>Record status</h3><dl class="kv">' +
      "<dt>Status</dt><dd>" + esc(r.dataStatus === "verified" ? "Checked against a source" : "Seed data, unverified") + "</dd>" +
      (r.lastUpdated ? "<dt>Updated</dt><dd>" + esc(r.lastUpdated) + "</dd>" : "") +
      "<dt>Sources</dt><dd>" + (r.sources.length
        ? r.sources.map(function (s) {
            return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label || s.url) + "</a>";
          }).join("<br>")
        : "None recorded") + "</dd></dl></div>";
    out += "</aside></div>";

    return out;
  }

  function openDetail(id) {
    var r = byId[id];
    if (!r) { closeDetail(); return; }
    $("#detailView").innerHTML = detailHTML(r);
    $("#detailView").hidden = false;
    $("#listView").style.display = "none";
    document.title = r.name + " — Hospital Directory India";
    window.scrollTo(0, 0);
    writeHash(id);
  }

  function closeDetail() {
    $("#detailView").hidden = true;
    $("#detailView").innerHTML = "";
    $("#listView").style.display = "";
    document.title = "Hospital Directory — India";
    writeHash("");
  }

  /* ----------------------------------------------------------------- events */

  function onFilterChange(e) {
    var el = e.target;
    var kind = el.getAttribute("data-kind");
    if (!kind) return;

    if (kind === "state") { Q.state = el.value; Q.city = ""; }
    else if (kind === "city") { Q.city = el.value; }
    else if (kind === "er") { Q.er = el.checked; }
    else {
      var listRef = Q[kind];
      if (!Array.isArray(listRef)) return;
      var i = listRef.indexOf(el.value);
      if (el.checked && i < 0) listRef.push(el.value);
      if (!el.checked && i >= 0) listRef.splice(i, 1);
    }
    writeHash("");
    runQuery();
  }

  function onFilterClick(e) {
    var more = e.target.closest ? e.target.closest("[data-more]") : null;
    if (more) {
      var k = more.getAttribute("data-more");
      expanded[k] = !expanded[k];
      buildFilters();
    }
  }

  function resetAll() {
    Q.q = ""; Q.state = ""; Q.city = "";
    Q.type = []; Q.spec = []; Q.accr = []; Q.ins = []; Q.er = false;
    $("#q").value = "";
    $("#qClear").hidden = true;
    writeHash("");
    runQuery();
  }

  function wire() {
    /* search */
    var qEl = $("#q");
    qEl.addEventListener("input", debounce(function () {
      Q.q = qEl.value.trim();
      $("#qClear").hidden = !Q.q;
      writeHash("");
      runQuery();
    }, 160));
    $("#qClear").addEventListener("click", function () {
      qEl.value = ""; Q.q = ""; this.hidden = true; writeHash(""); runQuery(); qEl.focus();
    });

    /* sort */
    $("#sort").addEventListener("change", function () {
      Q.sort = this.value; writeHash(""); runQuery();
    });

    /* filters, both hosts */
    ["#filterHost", "#filterHostMobile"].forEach(function (sel) {
      $(sel).addEventListener("change", onFilterChange);
      $(sel).addEventListener("click", onFilterClick);
    });

    /* chips */
    $("#chips").addEventListener("click", function (e) {
      var c = e.target.closest("[data-kind]");
      if (!c) return;
      var kind = c.getAttribute("data-kind"), val = c.getAttribute("data-val");
      if (kind === "state") { Q.state = ""; Q.city = ""; }
      else if (kind === "city") Q.city = "";
      else if (kind === "er") Q.er = false;
      else if (Array.isArray(Q[kind])) Q[kind] = Q[kind].filter(function (v) { return v !== val; });
      writeHash(""); runQuery();
    });

    /* open a record */
    $("#list").addEventListener("click", function (e) {
      var b = e.target.closest(".rec");
      if (b) openDetail(b.getAttribute("data-id"));
    });

    /* back */
    $("#detailView").addEventListener("click", function (e) {
      if (e.target.id === "backBtn") { closeDetail(); }
    });

    $("#resetAll").addEventListener("click", resetAll);
    $("#sheetReset").addEventListener("click", resetAll);
    $("#sheetApply").addEventListener("click", function () { $("#filterSheet").close(); });
    $("#openFilters").addEventListener("click", function () { $("#filterSheet").showModal(); });
    $("#openPrefs").addEventListener("click", function () { $("#prefsSheet").showModal(); });

    /* notice */
    $("#dataNotice").querySelector(".notice__x").addEventListener("click", function () {
      $("#dataNotice").hidden = true;
    });

    /* preferences */
    $$("[data-pref]").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var b = e.target.closest("[data-val]");
        if (!b) return;
        prefs[group.getAttribute("data-pref")] = b.getAttribute("data-val");
        savePrefs(); applyPrefs();
      });
    });
    $("#prefsReset").addEventListener("click", function () {
      prefs = Object.assign({}, DEFAULT_PREFS);
      savePrefs(); applyPrefs();
    });

    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onScheme = function () { if (prefs.theme === "system") applyPrefs(); };
      if (mq.addEventListener) mq.addEventListener("change", onScheme);
      else if (mq.addListener) mq.addListener(onScheme);
    }

    /* infinite scroll */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) renderChunk();
      }, { rootMargin: "600px" }).observe($("#sentinel"));
    } else {
      window.addEventListener("scroll", debounce(function () {
        if (window.innerHeight + window.scrollY > document.body.offsetHeight - 700) renderChunk();
      }, 120));
    }

    /* hash routing (back button) */
    window.addEventListener("hashchange", function () {
      if (suppressHash) return;
      var id = readHash();
      syncControls();
      if (id) openDetail(id);
      else { $("#detailView").hidden = true; $("#listView").style.display = ""; runQuery(); }
    });

    /* keyboard: / focuses search */
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== qEl && !/input|select|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); qEl.focus();
      }
    });
  }

  function syncControls() {
    $("#q").value = Q.q;
    $("#qClear").hidden = !Q.q;
    $("#sort").value = Q.sort;
  }

  /* -------------------------------------------------------------------- init */

  function init() {
    loadPrefs(); applyPrefs(); reflectStorageNote();

    var raw = window.HOSPITALS;
    if (!Array.isArray(raw)) {
      $("#count").textContent = "Directory failed to load.";
      $("#list").innerHTML = '<li><div class="gap"><b>data/hospitals.js did not load.</b>' +
        "Check that the file exists and defines <code>window.HOSPITALS</code> as an array.</div></li>";
      return;
    }
    DB = raw.map(normalise);
    DB.forEach(function (r) { byId[r.id] = r; });

    var detailId = readHash();
    syncControls();
    wire();
    runQuery();
    if (detailId) openDetail(detailId);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
