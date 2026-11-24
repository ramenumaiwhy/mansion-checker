"use strict";
(() => {
  // src/app.ts
  var PREFECTURE_CODES = {
    "01": "\u5317\u6D77\u9053",
    "02": "\u9752\u68EE\u770C",
    "03": "\u5CA9\u624B\u770C",
    "04": "\u5BAE\u57CE\u770C",
    "05": "\u79CB\u7530\u770C",
    "06": "\u5C71\u5F62\u770C",
    "07": "\u798F\u5CF6\u770C",
    "08": "\u8328\u57CE\u770C",
    "09": "\u6803\u6728\u770C",
    "10": "\u7FA4\u99AC\u770C",
    "11": "\u57FC\u7389\u770C",
    "12": "\u5343\u8449\u770C",
    "13": "\u6771\u4EAC\u90FD",
    "14": "\u795E\u5948\u5DDD\u770C",
    "15": "\u65B0\u6F5F\u770C",
    "16": "\u5BCC\u5C71\u770C",
    "17": "\u77F3\u5DDD\u770C",
    "18": "\u798F\u4E95\u770C",
    "19": "\u5C71\u68A8\u770C",
    "20": "\u9577\u91CE\u770C",
    "21": "\u5C90\u961C\u770C",
    "22": "\u9759\u5CA1\u770C",
    "23": "\u611B\u77E5\u770C",
    "24": "\u4E09\u91CD\u770C",
    "25": "\u6ECB\u8CC0\u770C",
    "26": "\u4EAC\u90FD\u5E9C",
    "27": "\u5927\u962A\u5E9C",
    "28": "\u5175\u5EAB\u770C",
    "29": "\u5948\u826F\u770C",
    "30": "\u548C\u6B4C\u5C71\u770C",
    "31": "\u9CE5\u53D6\u770C",
    "32": "\u5CF6\u6839\u770C",
    "33": "\u5CA1\u5C71\u770C",
    "34": "\u5E83\u5CF6\u770C",
    "35": "\u5C71\u53E3\u770C",
    "36": "\u5FB3\u5CF6\u770C",
    "37": "\u9999\u5DDD\u770C",
    "38": "\u611B\u5A9B\u770C",
    "39": "\u9AD8\u77E5\u770C",
    "40": "\u798F\u5CA1\u770C",
    "41": "\u4F50\u8CC0\u770C",
    "42": "\u9577\u5D0E\u770C",
    "43": "\u718A\u672C\u770C",
    "44": "\u5927\u5206\u770C",
    "45": "\u5BAE\u5D0E\u770C",
    "46": "\u9E7F\u5150\u5CF6\u770C",
    "47": "\u6C96\u7E04\u770C"
  };
  var ZONING_CATEGORIES = {
    "\u4F4F\u5C45\u7CFB": [
      "\u7B2C\uFF11\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF11\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528",
      "\u7B2C\u4E00\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528",
      "\u7B2C\u4E8C\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF11\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF11\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528",
      "\u7B2C\u4E00\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528",
      "\u7B2C\u4E8C\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF11\u7A2E\u4F4F\u5C45\u5730\u57DF",
      "\u7B2C\uFF11\u7A2E\u4F4F\u5C45",
      "\u7B2C\u4E00\u7A2E\u4F4F\u5C45\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4F4F\u5C45\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4F4F\u5C45",
      "\u7B2C\u4E8C\u7A2E\u4F4F\u5C45\u5730\u57DF",
      "\u6E96\u4F4F\u5C45\u5730\u57DF",
      "\u6E96\u4F4F\u5C45",
      "\u7530\u5712\u4F4F\u5C45\u5730\u57DF",
      "\u7530\u5712\u4F4F\u5C45"
    ],
    "\u5546\u696D\u7CFB": [
      "\u8FD1\u96A3\u5546\u696D\u5730\u57DF",
      "\u8FD1\u96A3\u5546\u696D",
      "\u5546\u696D\u5730\u57DF",
      "\u5546\u696D"
    ],
    "\u5DE5\u696D\u7CFB": [
      "\u6E96\u5DE5\u696D\u5730\u57DF",
      "\u6E96\u5DE5\u696D",
      "\u5DE5\u696D\u5730\u57DF",
      "\u5DE5\u696D",
      "\u5DE5\u696D\u5C02\u7528\u5730\u57DF",
      "\u5DE5\u696D\u5C02\u7528"
    ]
  };
  function getPrefName(muniCd) {
    return PREFECTURE_CODES[muniCd.substring(0, 2)] || "";
  }
  function getDistrictName(lv01Nm) {
    return lv01Nm.replace(/([一二三四五六七八九十百千万]+|[0-9]+)丁目$/, "");
  }
  function getUseDistrict(item) {
    return item.UseDistrict || item.CityPlanning || "";
  }
  function getZoningCategory(useDistrict) {
    if (!useDistrict) return "";
    for (const cat of Object.keys(ZONING_CATEGORIES)) {
      const types = ZONING_CATEGORIES[cat];
      for (const t of types) {
        if (useDistrict.includes(t)) return cat;
      }
    }
    return "";
  }
  function filterByDistrict(data, prefecture, municipality, districtName) {
    const filtered = [];
    for (const item of data) {
      if (item.Prefecture !== prefecture) continue;
      const itemMuni = item.Municipality || "";
      if (municipality) {
        const muniMatch = itemMuni === municipality || municipality.endsWith("\u533A") && itemMuni.endsWith(municipality);
        if (!muniMatch) continue;
      }
      if (item.DistrictName !== districtName) continue;
      filtered.push(item);
    }
    return filtered;
  }
  function convertJapaneseYear(yearStr) {
    if (!yearStr) return null;
    const normalized = yearStr.replace("\u5143\u5E74", "1\u5E74");
    let m;
    m = normalized.match(/令和(\d+)年/);
    if (m) return 2018 + parseInt(m[1]);
    m = normalized.match(/平成(\d+)年/);
    if (m) return 1988 + parseInt(m[1]);
    m = normalized.match(/昭和(\d+)年/);
    if (m) return 1925 + parseInt(m[1]);
    m = normalized.match(/(\d{4})年/);
    if (m) return parseInt(m[1]);
    return null;
  }
  function median(arr) {
    if (arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
  function formatManYen(value) {
    if (value == null) return "-";
    return (value / 1e4).toFixed(1);
  }
  function formatPrice(value) {
    if (!value) return "-";
    const num = typeof value === "string" ? parseInt(value) : value;
    if (isNaN(num) || num <= 0) return "-";
    if (num >= 1e8) return (num / 1e8).toFixed(1) + "\u5104";
    return Math.round(num / 1e4).toLocaleString() + "\u4E07";
  }
  function removeSqmOutliers(results) {
    const prices = results.map((r) => r.sqm_price);
    if (prices.length < 3) return results;
    const mid = median(prices);
    return results.filter((r) => r.sqm_price >= mid / 5);
  }
  function calcMansionStats(items) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const results = [];
    for (const item of items) {
      if (item.Type !== "\u4E2D\u53E4\u30DE\u30F3\u30B7\u30E7\u30F3\u7B49") continue;
      const tradePrice = parseInt(item.TradePrice || "0") || 0;
      if (tradePrice <= 0) continue;
      const areaM2 = parseFloat(item.Area || "0") || 0;
      if (areaM2 <= 0) continue;
      const sqmPrice = tradePrice / areaM2;
      const buildYear = convertJapaneseYear(item.BuildingYear || "");
      const age = buildYear != null ? currentYear - buildYear : null;
      results.push({
        sqm_price: sqmPrice,
        trade_price: tradePrice,
        area_m2: areaM2,
        floor_plan: item.FloorPlan || "",
        build_year: buildYear,
        age,
        use_district: getUseDistrict(item),
        period: item.Period || "",
        structure: item.Structure || "",
        raw: item
      });
    }
    return results;
  }
  function summarizeMansionStats(results) {
    const prices = results.map((r) => r.sqm_price);
    return {
      count: prices.length,
      sqm_min: prices.length ? Math.min(...prices) : null,
      sqm_max: prices.length ? Math.max(...prices) : null,
      sqm_median: median(prices)
    };
  }
  var AGE_BUCKETS = [
    { label: "\u301C5\u5E74", min: 0, max: 5 },
    { label: "6\u301C10\u5E74", min: 6, max: 10 },
    { label: "11\u301C15\u5E74", min: 11, max: 15 },
    { label: "16\u301C20\u5E74", min: 16, max: 20 },
    { label: "21\u301C25\u5E74", min: 21, max: 25 },
    { label: "26\u301C30\u5E74", min: 26, max: 30 },
    { label: "31\u5E74\u4EE5\u4E0A", min: 31, max: 999 }
  ];
  function groupByAge(results) {
    return AGE_BUCKETS.map((bucket) => {
      const group = results.filter((r) => r.age != null && r.age >= bucket.min && r.age <= bucket.max);
      const prices = group.map((r) => r.sqm_price);
      return {
        label: bucket.label,
        min_age: bucket.min,
        max_age: bucket.max,
        count: group.length,
        sqm_min: prices.length ? Math.min(...prices) : null,
        sqm_max: prices.length ? Math.max(...prices) : null,
        sqm_median: median(prices)
      };
    });
  }
  function summarizeByFloorPlan(results) {
    const groups = {};
    for (const r of results) {
      const key = r.floor_plan || "\u4E0D\u660E";
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }
    const summaries = {};
    for (const plan of Object.keys(groups)) {
      summaries[plan] = summarizeMansionStats(groups[plan]);
    }
    return summaries;
  }
  function compareMansionPrice(userInput, overallStats, ageGroups) {
    var _a, _b;
    const userSqmPrice = userInput.asking_price * 1e4 / userInput.area_m2;
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const userAge = currentYear - userInput.build_year;
    const ageGroup = ageGroups.find((g) => userAge >= g.min_age && userAge <= g.max_age);
    const ageGroupMedian = (_a = ageGroup == null ? void 0 : ageGroup.sqm_median) != null ? _a : null;
    const ageGroupLabel = (_b = ageGroup == null ? void 0 : ageGroup.label) != null ? _b : "\u4E0D\u660E";
    const compareMedian = ageGroupMedian != null ? ageGroupMedian : overallStats.sqm_median;
    const sampleCount = ageGroup && ageGroupMedian != null ? ageGroup.count : overallStats.count;
    if (compareMedian == null || compareMedian <= 0) {
      return {
        user_sqm_price: userSqmPrice,
        market_median: null,
        diff_ratio: null,
        verdict: "unknown",
        age_group_median: ageGroupMedian,
        age_group_label: ageGroupLabel,
        sample_count: sampleCount
      };
    }
    const diffRatio = (userSqmPrice - compareMedian) / compareMedian;
    let verdict;
    if (diffRatio > 0.2) verdict = "high";
    else if (diffRatio > 0.1) verdict = "slightly_high";
    else if (diffRatio >= -0.1) verdict = "fair";
    else if (diffRatio >= -0.2) verdict = "slightly_low";
    else verdict = "low";
    return {
      user_sqm_price: userSqmPrice,
      market_median: compareMedian,
      diff_ratio: diffRatio,
      verdict,
      age_group_median: ageGroupMedian,
      age_group_label: ageGroupLabel,
      sample_count: sampleCount
    };
  }
  var GSI_GEOCODER_URL = "https://msearch.gsi.go.jp/address-search/AddressSearch";
  var GSI_REVERSE_GEOCODER_URL = "https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress";
  var ZONING_DISPLAY_NAMES = {
    "\u4F4F\u5C45\u7CFB": [
      "\u7B2C\uFF11\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4F4E\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF11\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4E2D\u9AD8\u5C64\u4F4F\u5C45\u5C02\u7528\u5730\u57DF",
      "\u7B2C\uFF11\u7A2E\u4F4F\u5C45\u5730\u57DF",
      "\u7B2C\uFF12\u7A2E\u4F4F\u5C45\u5730\u57DF",
      "\u6E96\u4F4F\u5C45\u5730\u57DF",
      "\u7530\u5712\u4F4F\u5C45\u5730\u57DF"
    ],
    "\u5546\u696D\u7CFB": ["\u8FD1\u96A3\u5546\u696D\u5730\u57DF", "\u5546\u696D\u5730\u57DF"],
    "\u5DE5\u696D\u7CFB": ["\u6E96\u5DE5\u696D\u5730\u57DF", "\u5DE5\u696D\u5730\u57DF", "\u5DE5\u696D\u5C02\u7528\u5730\u57DF"]
  };
  function init() {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const saveKeyBtn = document.getElementById("saveKeyBtn");
    const deleteKeyBtn = document.getElementById("deleteKeyBtn");
    const apiKeyStatus = document.getElementById("apiKeyStatus");
    const apiKeyForm = document.getElementById("apiKeyForm");
    const apiKeyDone = document.getElementById("apiKeyDone");
    const addressInput = document.getElementById("addressInput");
    const stationInput = document.getElementById("stationInput");
    const stationCandidatesDiv = document.getElementById("stationCandidates");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const loading = document.getElementById("loading");
    const loadingText = document.getElementById("loadingText");
    const resultsEl = document.getElementById("results");
    const resultSummary = document.getElementById("resultSummary");
    const marketDashboardContent = document.getElementById("marketDashboardContent");
    const ageCurveContent = document.getElementById("ageCurveContent");
    const compareHint = document.getElementById("compareHint");
    const compareForm = document.getElementById("compareForm");
    const compareAreaInput = document.getElementById("compareAreaInput");
    const compareBuildYearInput = document.getElementById("compareBuildYearInput");
    const comparePriceInput = document.getElementById("comparePriceInput");
    const compareBtn = document.getElementById("compareBtn");
    const compareResult = document.getElementById("compareResult");
    const zoningCategorySelect = document.getElementById("zoningCategorySelect");
    const zoningDetailDiv = document.getElementById("zoningDetail");
    const searchModeTabs = document.querySelectorAll(".search-mode-tab");
    const addressSearchArea = document.getElementById("addressSearchArea");
    const stationSearchArea = document.getElementById("stationSearchArea");
    let searchMode = "address";
    let selectedStation = null;
    let stationsData = null;
    let stationsLoading = false;
    let highlightedIndex = -1;
    let isComposing = false;
    let selectedZoningTypes = [];
    let lastOverallStats = null;
    let lastAgeGroups = [];
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function createSafeElement(tag, text, attrs) {
      const el = document.createElement(tag);
      if (text != null) el.textContent = text;
      if (attrs) {
        for (const key of Object.keys(attrs)) {
          el.setAttribute(key, attrs[key]);
        }
      }
      return el;
    }
    function setLoadingText(text) {
      loadingText.textContent = text;
    }
    function showStatus(el, type, msg) {
      el.className = "status " + type;
      el.textContent = msg;
    }
    for (let ti = 0; ti < searchModeTabs.length; ti++) {
      (function(tab) {
        tab.addEventListener("click", function() {
          for (let j = 0; j < searchModeTabs.length; j++) {
            searchModeTabs[j].className = "search-mode-tab";
          }
          tab.className = "search-mode-tab active";
          searchMode = tab.dataset.mode || "address";
          if (searchMode === "address") {
            addressSearchArea.style.display = "";
            stationSearchArea.style.display = "none";
          } else {
            addressSearchArea.style.display = "none";
            stationSearchArea.style.display = "";
          }
        });
      })(searchModeTabs[ti]);
    }
    async function loadStations() {
      if (stationsData) return stationsData;
      if (stationsLoading) {
        let waited = 0;
        while (stationsLoading && waited < 1e4) {
          await sleep(100);
          waited += 100;
        }
        return stationsData;
      }
      stationsLoading = true;
      const resp = await fetch("stations.json");
      stationsData = await resp.json();
      stationsLoading = false;
      return stationsData;
    }
    function buildCandidateLabel(station) {
      const prefName = getPrefName(station.pref + "000");
      const lines = station.lines ? station.lines.split(",") : [];
      let lineText = "";
      if (lines.length === 1) {
        lineText = lines[0];
      } else if (lines.length === 2) {
        lineText = lines[0] + " \u4ED61\u8DEF\u7DDA";
      } else if (lines.length > 2) {
        lineText = lines[0] + " \u4ED6" + (lines.length - 1) + "\u8DEF\u7DDA";
      }
      let label = station.name + "\uFF08" + prefName;
      if (lineText) label += "\u30FB" + lineText;
      label += "\uFF09";
      return label;
    }
    function renderCandidates(stations) {
      stationCandidatesDiv.textContent = "";
      highlightedIndex = -1;
      if (!stations || stations.length === 0) {
        stationCandidatesDiv.className = "station-candidates";
        return;
      }
      for (const station of stations) {
        const item = createSafeElement("div", buildCandidateLabel(station));
        item.className = "station-candidate";
        item.addEventListener("mousedown", function(e) {
          e.preventDefault();
          selectStation(station);
        });
        stationCandidatesDiv.appendChild(item);
      }
      stationCandidatesDiv.className = "station-candidates open";
    }
    function selectStation(station) {
      selectedStation = station;
      stationInput.value = buildCandidateLabel(station);
      stationCandidatesDiv.className = "station-candidates";
      stationCandidatesDiv.textContent = "";
      highlightedIndex = -1;
    }
    function highlightCandidate(index) {
      const items = stationCandidatesDiv.querySelectorAll(".station-candidate");
      for (let i = 0; i < items.length; i++) {
        items[i].className = "station-candidate";
      }
      if (index >= 0 && index < items.length) {
        items[index].className = "station-candidate highlighted";
        highlightedIndex = index;
      } else {
        highlightedIndex = -1;
      }
    }
    stationInput.addEventListener("compositionstart", function() {
      isComposing = true;
    });
    stationInput.addEventListener("compositionend", function() {
      isComposing = false;
      stationInput.dispatchEvent(new Event("input"));
    });
    stationInput.addEventListener("input", async function() {
      if (isComposing) return;
      const q = stationInput.value.trim();
      selectedStation = null;
      if (q.length < 2) {
        stationCandidatesDiv.className = "station-candidates";
        stationCandidatesDiv.textContent = "";
        return;
      }
      const all = await loadStations();
      const prefix = [];
      const middle = [];
      for (const s of all) {
        if (s.name.indexOf(q) === 0) {
          prefix.push(s);
        } else if (s.name.indexOf(q) > 0) {
          middle.push(s);
        }
      }
      renderCandidates(prefix.concat(middle).slice(0, 15));
    });
    stationInput.addEventListener("keydown", function(e) {
      const items = stationCandidatesDiv.querySelectorAll(".station-candidate");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let next = highlightedIndex + 1;
        if (next >= items.length) next = 0;
        highlightCandidate(next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        let prev = highlightedIndex - 1;
        if (prev < 0) prev = items.length - 1;
        highlightCandidate(prev);
      } else if (e.key === "Enter") {
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          e.preventDefault();
          const all = stationsData;
          if (all) {
            const q = stationInput.value.trim();
            const prefix2 = [];
            const middle2 = [];
            for (const s of all) {
              if (s.name.indexOf(q) === 0) prefix2.push(s);
              else if (s.name.indexOf(q) > 0) middle2.push(s);
            }
            const combined = prefix2.concat(middle2).slice(0, 15);
            if (combined[highlightedIndex]) {
              selectStation(combined[highlightedIndex]);
            }
          }
        }
      } else if (e.key === "Escape") {
        stationCandidatesDiv.className = "station-candidates";
        stationCandidatesDiv.textContent = "";
        highlightedIndex = -1;
      }
    });
    stationInput.addEventListener("blur", function() {
      setTimeout(function() {
        stationCandidatesDiv.className = "station-candidates";
        stationCandidatesDiv.textContent = "";
        highlightedIndex = -1;
      }, 150);
    });
    function renderZoningChips(category) {
      zoningDetailDiv.textContent = "";
      selectedZoningTypes = [];
      if (!category) {
        zoningDetailDiv.className = "zoning-detail";
        return;
      }
      const names = ZONING_DISPLAY_NAMES[category] || [];
      const chipsDiv = createSafeElement("div");
      chipsDiv.className = "zoning-chips";
      const hint = createSafeElement("div");
      hint.className = "filter-hint";
      hint.textContent = "\u9078\u629E\u3057\u306A\u3051\u308C\u3070\u300C" + category + "\u300D\u5168\u4F53\u3067\u5206\u6790\u3057\u307E\u3059";
      zoningDetailDiv.appendChild(hint);
      for (const name of names) {
        const chip = createSafeElement("label");
        chip.className = "zoning-chip";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = name;
        chip.appendChild(cb);
        chip.appendChild(createSafeElement("span", name));
        cb.addEventListener("change", function() {
          if (cb.checked) {
            chip.className = "zoning-chip selected";
            selectedZoningTypes.push(name);
          } else {
            chip.className = "zoning-chip";
            selectedZoningTypes = selectedZoningTypes.filter((t) => t !== name);
          }
        });
        chipsDiv.appendChild(chip);
      }
      zoningDetailDiv.appendChild(chipsDiv);
      zoningDetailDiv.className = "zoning-detail visible";
    }
    zoningCategorySelect.addEventListener("change", function() {
      renderZoningChips(zoningCategorySelect.value);
    });
    function filterByZoning(dataArray) {
      const category = zoningCategorySelect.value;
      if (!category) return dataArray;
      const filtered = [];
      for (const item of dataArray) {
        const ud = item.use_district;
        const itemCategory = getZoningCategory(ud);
        if (itemCategory !== category) continue;
        if (selectedZoningTypes.length > 0) {
          let matched = false;
          for (const st of selectedZoningTypes) {
            if (ud.includes(st)) {
              matched = true;
              break;
            }
          }
          if (!matched) continue;
        }
        filtered.push(item);
      }
      return filtered;
    }
    function getApiKey() {
      return localStorage.getItem("reinfolib_api_key") || "";
    }
    function setApiKey(key) {
      localStorage.setItem("reinfolib_api_key", key);
    }
    function removeApiKey() {
      localStorage.removeItem("reinfolib_api_key");
    }
    function updateKeyUI() {
      if (getApiKey()) {
        apiKeyForm.style.display = "none";
        apiKeyDone.style.display = "block";
        analyzeBtn.disabled = false;
      } else {
        apiKeyForm.style.display = "block";
        apiKeyDone.style.display = "none";
        analyzeBtn.disabled = true;
      }
    }
    saveKeyBtn.addEventListener("click", async function() {
      const key = apiKeyInput.value.trim();
      if (!key) {
        showStatus(apiKeyStatus, "error", "API\u30AD\u30FC\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
        return;
      }
      saveKeyBtn.disabled = true;
      showStatus(apiKeyStatus, "info", "API\u30AD\u30FC\u3092\u691C\u8A3C\u4E2D...");
      try {
        const resp = await fetch("/api/XIT002?area=13", {
          redirect: "error",
          headers: { "Ocp-Apim-Subscription-Key": key }
        });
        if (resp.ok) {
          const cities = await resp.json();
          if (!Array.isArray(cities == null ? void 0 : cities.data) || !cities.data.some((city) => {
            var _a;
            return /^13\d{3}$/.test((_a = city == null ? void 0 : city.id) != null ? _a : "");
          })) {
            showStatus(apiKeyStatus, "error", "\u30D7\u30ED\u30AD\u30B7\u304B\u3089\u5E02\u533A\u753A\u6751\u4E00\u89A7\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3002");
          } else {
            setApiKey(key);
            apiKeyInput.value = "";
            apiKeyStatus.className = "status";
            apiKeyStatus.textContent = "";
            updateKeyUI();
          }
        } else if (resp.status === 401 || resp.status === 403) {
          showStatus(apiKeyStatus, "error", "API\u30AD\u30FC\u304C\u7121\u52B9\u3067\u3059\u3002\u6B63\u3057\u3044\u30AD\u30FC\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
        } else {
          showStatus(apiKeyStatus, "error", "API\u63A5\u7D9A\u30A8\u30E9\u30FC\uFF08\u30B9\u30C6\u30FC\u30BF\u30B9: " + resp.status + "\uFF09");
        }
      } catch (e) {
        showStatus(apiKeyStatus, "error", "\u30B5\u30FC\u30D0\u30FC\u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3002\u3057\u3070\u3089\u304F\u7D4C\u3063\u3066\u304B\u3089\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002");
      }
      saveKeyBtn.disabled = false;
    });
    deleteKeyBtn.addEventListener("click", function() {
      removeApiKey();
      updateKeyUI();
    });
    updateKeyUI();
    async function geocode(address) {
      const resp = await fetch(GSI_GEOCODER_URL + "?q=" + encodeURIComponent(address));
      if (!resp.ok) throw new Error("\u30B8\u30AA\u30B3\u30FC\u30C0\u30FC\u30A8\u30E9\u30FC");
      const data = await resp.json();
      if (!data || data.length === 0) throw new Error("\u4F4F\u6240\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093: " + address);
      const coords = data[0].geometry.coordinates;
      return { lat: coords[1], lon: coords[0] };
    }
    async function reverseGeocode(lat, lon) {
      const resp = await fetch(GSI_REVERSE_GEOCODER_URL + "?lat=" + lat + "&lon=" + lon);
      if (!resp.ok) throw new Error("\u9006\u30B8\u30AA\u30B3\u30FC\u30C0\u30FC\u30A8\u30E9\u30FC");
      const data = await resp.json();
      return {
        muniCd: data.results.muniCd,
        lv01Nm: data.results.lv01Nm
      };
    }
    async function getCityName(apiKey, muniCd) {
      const prefCd = muniCd.substring(0, 2);
      const resp = await fetch("/api/XIT002?area=" + prefCd, {
        redirect: "error",
        headers: { "Ocp-Apim-Subscription-Key": apiKey }
      });
      if (!resp.ok) throw new Error("\u5E02\u533A\u753A\u6751\u540D\u306E\u53D6\u5F97\u306B\u5931\u6557");
      const data = await resp.json();
      const items = data.data || [];
      for (const item of items) {
        if (item.id === muniCd) return item.name;
      }
      return null;
    }
    async function fetchTransactions(apiKey, muniCd, years) {
      const batches = [];
      for (let i = 0; i < years.length; i++) {
        if (i > 0) await sleep(1e3);
        const resp = await fetch(
          "/api/XIT001?year=" + years[i] + "&city=" + muniCd,
          { redirect: "error", headers: { "Ocp-Apim-Subscription-Key": apiKey } }
        );
        if (resp.status === 404) {
          batches.push({ year: years[i], rows: null });
          continue;
        }
        if (!resp.ok) throw new Error("\u53D6\u5F15\u30C7\u30FC\u30BF\u53D6\u5F97\u30A8\u30E9\u30FC (year=" + years[i] + ")");
        const result = await resp.json();
        if (!Array.isArray(result == null ? void 0 : result.data) || result.status && result.status !== "OK") {
          throw new Error(years[i] + "\u5E74\u306E\u53D6\u5F15\u30C7\u30FC\u30BF\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093");
        }
        batches.push({ year: years[i], rows: result.data });
      }
      return batches;
    }
    function getConfidence(count) {
      if (count >= 30) return { label: "\u4FE1\u983C\u5EA6: \u9AD8", cls: "confidence-high", note: "" };
      if (count >= 20) return { label: "\u4FE1\u983C\u5EA6: \u4E2D", cls: "confidence-mid", note: "\u4E2D\u592E\u5024\u306F\u6982\u306D\u5B89\u5B9A\u3002\xB115%\u7A0B\u5EA6\u306E\u30D6\u30EC\u5E45\u3092\u898B\u3066\u304F\u3060\u3055\u3044\u3002" };
      if (count >= 5) return { label: "\u4FE1\u983C\u5EA6: \u4F4E", cls: "confidence-low", note: "\u4EF6\u6570\u304C\u5C11\u306A\u304F\u53C2\u8003\u5024\u3067\u3059\u3002\u4E0B\u306E\u5E02\u533A\u753A\u6751\u5168\u4F53\u306E\u30C7\u30FC\u30BF\u3082\u3054\u53C2\u7167\u304F\u3060\u3055\u3044\u3002" };
      return { label: "\u4FE1\u983C\u5EA6: \u4E0D\u8DB3", cls: "confidence-poor", note: "\u4EF6\u6570\u304C\u6975\u3081\u3066\u5C11\u306A\u304F\u7D71\u8A08\u7684\u306B\u4FE1\u983C\u3067\u304D\u307E\u305B\u3093\u3002\u5E02\u533A\u753A\u6751\u5168\u4F53\u306E\u30C7\u30FC\u30BF\u3092\u3054\u53C2\u7167\u304F\u3060\u3055\u3044\u3002" };
    }
    function renderMansionSummary(result) {
      resultSummary.textContent = "";
      const scopeLabel = result.scopeLabel;
      const years = result.years;
      const totalRecords = result.total_records;
      const mansionCount = result.mansion_count;
      const overall = result.overall;
      const h3 = createSafeElement("h3", scopeLabel || "\u4E2D\u53E4\u30DE\u30F3\u30B7\u30E7\u30F3\u76F8\u5834");
      resultSummary.appendChild(h3);
      const grid = createSafeElement("div");
      grid.className = "summary-grid";
      const conf = getConfidence(mansionCount);
      const badge = createSafeElement("span", conf.label);
      badge.className = "confidence-badge " + conf.cls;
      badge.style.marginLeft = "0";
      badge.style.marginBottom = "8px";
      badge.style.display = "inline-flex";
      resultSummary.insertBefore(badge, h3.nextSibling);
      const items = [
        { label: "\u691C\u7D22\u3057\u305F\u5E74", value: years.join(", "), unit: "" },
        { label: "\u5BFE\u8C61\u30A8\u30EA\u30A2\u306E\u96C6\u8A08\u5185\u8A33", value: String(result.coverage), unit: "" },
        { label: "\u53D6\u5F15\u4EF6\u6570\uFF08\u5168\u4F53\uFF09", value: String(totalRecords), unit: "\u4EF6" },
        { label: "\u30DE\u30F3\u30B7\u30E7\u30F3\u53D6\u5F15\u4EF6\u6570", value: String(mansionCount), unit: "\u4EF6" }
      ];
      if (overall.sqm_median != null) {
        items.push({ label: "\u33A1\u5358\u4FA1 \u4E2D\u592E\u5024", value: formatManYen(overall.sqm_median), unit: "\u4E07\u5186/\u33A1" });
      }
      if (overall.sqm_min != null && overall.sqm_max != null) {
        items.push({
          label: "\u33A1\u5358\u4FA1 \u30EC\u30F3\u30B8",
          value: formatManYen(overall.sqm_min) + "\u301C" + formatManYen(overall.sqm_max),
          unit: "\u4E07\u5186/\u33A1"
        });
      }
      for (const it of items) {
        const item = createSafeElement("div");
        item.className = "summary-item";
        const lbl = createSafeElement("div", it.label);
        lbl.className = "summary-label";
        const val = createSafeElement("div");
        val.className = "summary-value";
        val.textContent = it.value;
        if (it.unit) {
          const unitSpan = createSafeElement("span", " " + it.unit);
          unitSpan.className = "summary-unit";
          val.appendChild(unitSpan);
        }
        item.appendChild(lbl);
        item.appendChild(val);
        grid.appendChild(item);
      }
      resultSummary.appendChild(grid);
    }
    function renderMarketDashboard(stats, byFloorPlan, mansionResults, citywideStats, municipalityName) {
      marketDashboardContent.textContent = "";
      const count = stats.count;
      const conf = getConfidence(count);
      if (count === 0) {
        const noData = createSafeElement("p", "\u5BFE\u8C61\u30A8\u30EA\u30A2\u306E\u30DE\u30F3\u30B7\u30E7\u30F3\u53D6\u5F15\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093");
        noData.className = "data-note";
        marketDashboardContent.appendChild(noData);
      } else {
        const overallWrap = createSafeElement("div");
        overallWrap.className = "table-wrap";
        const overallTable = createSafeElement("table");
        const overallThead = createSafeElement("thead");
        const overallHeaderRow = createSafeElement("tr");
        for (const h of ["\u4EF6\u6570", "\u33A1\u5358\u4FA1 \u6700\u5C0F", "\u33A1\u5358\u4FA1 \u6700\u5927", "\u33A1\u5358\u4FA1 \u4E2D\u592E\u5024"]) {
          overallHeaderRow.appendChild(createSafeElement("th", h));
        }
        overallThead.appendChild(overallHeaderRow);
        overallTable.appendChild(overallThead);
        const overallTbody = createSafeElement("tbody");
        const overallRow = createSafeElement("tr");
        overallRow.appendChild(createSafeElement("td", count + "\u4EF6"));
        overallRow.appendChild(createSafeElement("td", formatManYen(stats.sqm_min) + "\u4E07\u5186/\u33A1"));
        overallRow.appendChild(createSafeElement("td", formatManYen(stats.sqm_max) + "\u4E07\u5186/\u33A1"));
        overallRow.appendChild(createSafeElement("td", formatManYen(stats.sqm_median) + "\u4E07\u5186/\u33A1"));
        overallTbody.appendChild(overallRow);
        overallTable.appendChild(overallTbody);
        overallWrap.appendChild(overallTable);
        marketDashboardContent.appendChild(overallWrap);
        const fpKeys = Object.keys(byFloorPlan);
        if (fpKeys.length > 0) {
          const fpTitle = createSafeElement("p", "\u9593\u53D6\u308A\u5225\u33A1\u5358\u4FA1");
          fpTitle.className = "data-note";
          fpTitle.style.marginTop = "16px";
          fpTitle.style.marginBottom = "8px";
          fpTitle.style.fontWeight = "700";
          fpTitle.style.color = "var(--brown-warm)";
          marketDashboardContent.appendChild(fpTitle);
          const fpWrap = createSafeElement("div");
          fpWrap.className = "table-wrap";
          const fpTable = createSafeElement("table");
          const fpThead = createSafeElement("thead");
          const fpHeaderRow = createSafeElement("tr");
          for (const h of ["\u9593\u53D6\u308A", "\u4EF6\u6570", "\u33A1\u5358\u4FA1 \u6700\u5C0F", "\u33A1\u5358\u4FA1 \u6700\u5927", "\u33A1\u5358\u4FA1 \u4E2D\u592E\u5024"]) {
            fpHeaderRow.appendChild(createSafeElement("th", h));
          }
          fpThead.appendChild(fpHeaderRow);
          fpTable.appendChild(fpThead);
          const fpTbody = createSafeElement("tbody");
          for (const fp of fpKeys) {
            const s = byFloorPlan[fp];
            const row = createSafeElement("tr");
            row.appendChild(createSafeElement("td", fp || "\u4E0D\u660E"));
            row.appendChild(createSafeElement("td", s.count + "\u4EF6"));
            row.appendChild(createSafeElement("td", formatManYen(s.sqm_min) + "\u4E07\u5186/\u33A1"));
            row.appendChild(createSafeElement("td", formatManYen(s.sqm_max) + "\u4E07\u5186/\u33A1"));
            row.appendChild(createSafeElement("td", formatManYen(s.sqm_median) + "\u4E07\u5186/\u33A1"));
            fpTbody.appendChild(row);
          }
          fpTable.appendChild(fpTbody);
          fpWrap.appendChild(fpTable);
          marketDashboardContent.appendChild(fpWrap);
        }
        if (mansionResults.length > 0) {
          const section = createSafeElement("div");
          section.className = "detail-section";
          const toggleBtn = createSafeElement("button", "");
          toggleBtn.className = "detail-toggle";
          const arrow = createSafeElement("span", "\u25B6");
          arrow.className = "arrow";
          toggleBtn.appendChild(arrow);
          toggleBtn.appendChild(document.createTextNode(" \u500B\u5225\u53D6\u5F15\u30C7\u30FC\u30BF\uFF08" + mansionResults.length + "\u4EF6\uFF09"));
          toggleBtn.addEventListener("click", function() {
            const isOpen = section.classList.toggle("open");
            toggleBtn.classList.toggle("open", isOpen);
          });
          const detailWrap = createSafeElement("div");
          detailWrap.className = "table-wrap";
          detailWrap.style.marginTop = "12px";
          const detailTable = createSafeElement("table");
          const detailThead = createSafeElement("thead");
          const detailHeaderRow = createSafeElement("tr");
          for (const h of ["\u33A1\u5358\u4FA1", "\u53D6\u5F15\u4FA1\u683C", "\u9762\u7A4D", "\u9593\u53D6\u308A", "\u7BC9\u5E74\u6570", "\u7528\u9014\u5730\u57DF", "\u69CB\u9020", "\u53D6\u5F15\u6642\u70B9"]) {
            detailHeaderRow.appendChild(createSafeElement("th", h));
          }
          detailThead.appendChild(detailHeaderRow);
          detailTable.appendChild(detailThead);
          const detailTbody = createSafeElement("tbody");
          const sorted = [...mansionResults].sort((a, b) => b.sqm_price - a.sqm_price);
          for (const d of sorted) {
            const row = createSafeElement("tr");
            row.appendChild(createSafeElement("td", formatManYen(d.sqm_price) + "\u4E07\u5186/\u33A1"));
            row.appendChild(createSafeElement("td", formatPrice(d.trade_price)));
            row.appendChild(createSafeElement("td", d.area_m2 + "\u33A1"));
            row.appendChild(createSafeElement("td", d.floor_plan || "-"));
            row.appendChild(createSafeElement("td", d.age != null ? d.age + "\u5E74" : "-"));
            row.appendChild(createSafeElement("td", d.use_district || "-"));
            row.appendChild(createSafeElement("td", d.structure || "-"));
            row.appendChild(createSafeElement("td", d.period || "-"));
            detailTbody.appendChild(row);
          }
          detailTable.appendChild(detailTbody);
          detailWrap.appendChild(detailTable);
          section.appendChild(detailWrap);
          marketDashboardContent.appendChild(toggleBtn);
          marketDashboardContent.appendChild(section);
        }
      }
      if (count < 20 && citywideStats.count > 0) {
        const ref = createSafeElement("div");
        ref.className = "citywide-ref";
        const refTitle = createSafeElement("div", municipalityName + "\u5168\u4F53\u306E\u53C2\u8003\u30C7\u30FC\u30BF\uFF08\u30DE\u30F3\u30B7\u30E7\u30F3\u53D6\u5F15\uFF09");
        refTitle.className = "ref-title";
        ref.appendChild(refTitle);
        const refWrap = createSafeElement("div");
        refWrap.className = "table-wrap";
        const refTable = createSafeElement("table");
        const refThead = createSafeElement("thead");
        const refHeaderRow = createSafeElement("tr");
        for (const h of ["\u4EF6\u6570", "\u33A1\u5358\u4FA1 \u6700\u5C0F", "\u33A1\u5358\u4FA1 \u6700\u5927", "\u33A1\u5358\u4FA1 \u4E2D\u592E\u5024"]) {
          refHeaderRow.appendChild(createSafeElement("th", h));
        }
        refThead.appendChild(refHeaderRow);
        refTable.appendChild(refThead);
        const refTbody = createSafeElement("tbody");
        const refRow = createSafeElement("tr");
        refRow.appendChild(createSafeElement("td", citywideStats.count + "\u4EF6"));
        refRow.appendChild(createSafeElement("td", formatManYen(citywideStats.sqm_min) + "\u4E07\u5186/\u33A1"));
        refRow.appendChild(createSafeElement("td", formatManYen(citywideStats.sqm_max) + "\u4E07\u5186/\u33A1"));
        refRow.appendChild(createSafeElement("td", formatManYen(citywideStats.sqm_median) + "\u4E07\u5186/\u33A1"));
        refTbody.appendChild(refRow);
        refTable.appendChild(refTbody);
        refWrap.appendChild(refTable);
        ref.appendChild(refWrap);
        const refNote = createSafeElement("div", "\u5730\u533A\u306E\u4EF6\u6570\u304C\u5C11\u306A\u3044\u305F\u3081\u3001\u5E02\u533A\u753A\u6751\u5168\u4F53\u306E\u7D71\u8A08\u3092\u53C2\u8003\u3068\u3057\u3066\u8868\u793A\u3057\u3066\u3044\u307E\u3059\u3002");
        refNote.className = "ref-note";
        ref.appendChild(refNote);
        marketDashboardContent.appendChild(ref);
      }
      if (conf.note) {
        const confNote = createSafeElement("div", conf.note);
        confNote.className = "data-warning";
        confNote.style.marginTop = "12px";
        marketDashboardContent.appendChild(confNote);
      }
    }
    function renderAgeCurve(ageGroups) {
      ageCurveContent.textContent = "";
      if (ageGroups.length === 0) {
        ageCurveContent.appendChild(createSafeElement("p", "\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093"));
        return;
      }
      const wrap = createSafeElement("div");
      wrap.className = "table-wrap";
      const table = createSafeElement("table");
      const thead = createSafeElement("thead");
      const headerRow = createSafeElement("tr");
      for (const h of ["\u7BC9\u5E74\u6570", "\u4EF6\u6570", "\u33A1\u5358\u4FA1 \u6700\u5C0F", "\u33A1\u5358\u4FA1 \u6700\u5927", "\u33A1\u5358\u4FA1 \u4E2D\u592E\u5024"]) {
        headerRow.appendChild(createSafeElement("th", h));
      }
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = createSafeElement("tbody");
      for (const g of ageGroups) {
        const row = createSafeElement("tr");
        row.appendChild(createSafeElement("td", g.label));
        if (g.count === 0) {
          row.appendChild(createSafeElement("td", "0\u4EF6"));
          row.appendChild(createSafeElement("td", "-"));
          row.appendChild(createSafeElement("td", "-"));
          row.appendChild(createSafeElement("td", "-"));
        } else {
          row.appendChild(createSafeElement("td", g.count + "\u4EF6"));
          row.appendChild(createSafeElement("td", formatManYen(g.sqm_min) + "\u4E07\u5186/\u33A1"));
          row.appendChild(createSafeElement("td", formatManYen(g.sqm_max) + "\u4E07\u5186/\u33A1"));
          row.appendChild(createSafeElement("td", formatManYen(g.sqm_median) + "\u4E07\u5186/\u33A1"));
        }
        tbody.appendChild(row);
      }
      table.appendChild(tbody);
      wrap.appendChild(table);
      ageCurveContent.appendChild(wrap);
    }
    function renderCompareResult(cr) {
      compareResult.textContent = "";
      const box = createSafeElement("div");
      box.className = "compare-result-box verdict-" + cr.verdict;
      const verdictMessages = {
        high: { text: "\u76F8\u5834\u3088\u308A\u9AD8\u3081\uFF08+20%\u8D85\uFF09", color: "var(--red)" },
        slightly_high: { text: "\u3084\u3084\u9AD8\u3081\uFF08+10\u301C20%\uFF09", color: "#E65100" },
        fair: { text: "\u76F8\u5834\u4E26\u307F\uFF08\xB110%\u4EE5\u5185\uFF09", color: "var(--green-deep)" },
        slightly_low: { text: "\u3084\u3084\u5B89\u3081\uFF08-10\u301C20%\uFF09", color: "#1565C0" },
        low: { text: "\u76F8\u5834\u3088\u308A\u5B89\u3081\uFF08-20%\u8D85\uFF09", color: "#1565C0" },
        unknown: { text: "\u6BD4\u8F03\u30C7\u30FC\u30BF\u4E0D\u8DB3", color: "var(--brown-light)" }
      };
      const vm = verdictMessages[cr.verdict] || verdictMessages.unknown;
      const verdictEl = createSafeElement("div", vm.text);
      verdictEl.style.fontSize = "18px";
      verdictEl.style.fontWeight = "700";
      verdictEl.style.color = vm.color;
      verdictEl.style.marginBottom = "12px";
      box.appendChild(verdictEl);
      const userSqmEl = createSafeElement("div", "\u5165\u529B\u7269\u4EF6\u306E\u33A1\u5358\u4FA1: " + formatManYen(cr.user_sqm_price) + "\u4E07\u5186/\u33A1");
      userSqmEl.style.fontSize = "14px";
      userSqmEl.style.marginBottom = "4px";
      box.appendChild(userSqmEl);
      if (cr.market_median != null) {
        const label = cr.age_group_median == null ? "\u5BFE\u8C61\u30A8\u30EA\u30A2\u5168\u4F53" : cr.age_group_label;
        const marketEl = createSafeElement("div", "\u5E02\u5834\u4E2D\u592E\u5024\uFF08" + label + "\uFF09: " + formatManYen(cr.market_median) + "\u4E07\u5186/\u33A1");
        marketEl.style.fontSize = "14px";
        marketEl.style.marginBottom = "4px";
        box.appendChild(marketEl);
      }
      if (cr.diff_ratio != null) {
        const sign = cr.diff_ratio >= 0 ? "+" : "";
        const diffEl = createSafeElement("div", "\u4E56\u96E2\u7387: " + sign + (cr.diff_ratio * 100).toFixed(1) + "%");
        diffEl.style.fontSize = "14px";
        diffEl.style.marginBottom = "4px";
        box.appendChild(diffEl);
      }
      const sampleEl = createSafeElement("div", "\u6BD4\u8F03\u30B5\u30F3\u30D7\u30EB\u6570: " + cr.sample_count + "\u4EF6");
      sampleEl.style.fontSize = "12px";
      sampleEl.style.color = "var(--brown-light)";
      sampleEl.style.marginTop = "8px";
      box.appendChild(sampleEl);
      compareResult.appendChild(box);
    }
    async function analyzeCore(apiKey, muniCd, municipality, scopeLabel, districtName) {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const years = [currentYear, currentYear - 1, currentYear - 2];
      const prefecture = getPrefName(muniCd);
      setLoadingText("\u53D6\u5F15\u30C7\u30FC\u30BF\u3092\u53D6\u5F97\u4E2D\uFF083\u5E74\u5206\uFF09...");
      const batches = await fetchTransactions(apiKey, muniCd, years);
      const rawData = batches.flatMap((batch) => {
        var _a;
        return (_a = batch.rows) != null ? _a : [];
      });
      setLoadingText("\u30C7\u30FC\u30BF\u3092\u5206\u6790\u4E2D...");
      let filtered;
      if (districtName) {
        filtered = filterByDistrict(rawData, prefecture, municipality, districtName);
      } else {
        filtered = rawData;
      }
      let mansionResults = calcMansionStats(filtered);
      mansionResults = removeSqmOutliers(mansionResults);
      mansionResults = filterByZoning(mansionResults);
      const overallStats = summarizeMansionStats(mansionResults);
      const ageGroups = groupByAge(mansionResults);
      const byFloorPlan = summarizeByFloorPlan(mansionResults);
      let citywideResults = calcMansionStats(rawData);
      citywideResults = removeSqmOutliers(citywideResults);
      citywideResults = filterByZoning(citywideResults);
      const citywideStats = summarizeMansionStats(citywideResults);
      const usedRows = new Set(mansionResults.map((row) => row.raw));
      const coverage = batches.map(({ year, rows }) => {
        if (rows === null) return year + "\u5E74 \u672A\u53D6\u5F97\uFF08404\uFF09";
        if (!rows.length) return year + "\u5E74 \u5E02\u533A\u753A\u6751\u306E\u53D6\u5F150\u4EF6";
        return year + "\u5E74 \u4E2D\u53E4\u30DE\u30F3\u30B7\u30E7\u30F3" + rows.filter((row) => usedRows.has(row)).length + "\u4EF6";
      }).join(" \uFF0F ");
      return {
        scopeLabel,
        prefecture,
        municipality,
        district_name: districtName || "",
        muni_cd: muniCd,
        years,
        coverage,
        total_records: rawData.length,
        mansion_count: mansionResults.length,
        overall: overallStats,
        age_groups: ageGroups,
        by_floor_plan: byFloorPlan,
        mansion_results: mansionResults,
        citywide: { overall: citywideStats }
      };
    }
    async function analyzeByAddress(apiKey, address) {
      setLoadingText("\u4F4F\u6240\u3092\u89E3\u6790\u4E2D...");
      const coords = await geocode(address);
      setLoadingText("\u5E02\u533A\u753A\u6751\u30B3\u30FC\u30C9\u3092\u53D6\u5F97\u4E2D...");
      const geo = await reverseGeocode(coords.lat, coords.lon);
      const prefecture = getPrefName(geo.muniCd);
      const districtName = getDistrictName(geo.lv01Nm);
      setLoadingText("\u5E02\u533A\u753A\u6751\u540D\u3092\u53D6\u5F97\u4E2D...");
      const municipality = await getCityName(apiKey, geo.muniCd);
      if (!municipality) throw new Error("\u5E02\u533A\u753A\u6751\u540D\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
      const scopeLabel = prefecture + municipality + districtName + " \u306E\u4E2D\u53E4\u30DE\u30F3\u30B7\u30E7\u30F3\u76F8\u5834";
      return analyzeCore(apiKey, geo.muniCd, municipality, scopeLabel, districtName);
    }
    async function analyzeByStation(apiKey, station) {
      setLoadingText("\u5E02\u533A\u753A\u6751\u540D\u3092\u53D6\u5F97\u4E2D...");
      const municipality = await getCityName(apiKey, station.muni);
      if (!municipality) throw new Error("\u5E02\u533A\u753A\u6751\u540D\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
      const prefName = getPrefName(station.muni);
      const scopeLabel = station.name + "\u99C5\u5468\u8FBA\uFF08" + prefName + municipality + "\u5168\u4F53\uFF09\u306E\u4E2D\u53E4\u30DE\u30F3\u30B7\u30E7\u30F3\u76F8\u5834";
      return analyzeCore(apiKey, station.muni, municipality, scopeLabel, null);
    }
    analyzeBtn.addEventListener("click", async function() {
      const apiKey = getApiKey();
      if (!apiKey) return;
      if (searchMode === "address") {
        const address = addressInput.value.trim();
        if (!address) return;
      } else {
        if (!selectedStation) {
          const errCard = document.getElementById("searchCard");
          if (errCard) {
            const existing = errCard.querySelector(".status");
            if (existing) existing.remove();
            const errEl = createSafeElement("div", "\u99C5\u3092\u5019\u88DC\u304B\u3089\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
            errEl.className = "status error";
            errCard.appendChild(errEl);
            setTimeout(function() {
              errEl.remove();
            }, 5e3);
          }
          return;
        }
      }
      analyzeBtn.disabled = true;
      compareBtn.disabled = true;
      compareResult.replaceChildren();
      loading.className = "loading active";
      resultsEl.className = "results";
      try {
        let result;
        if (searchMode === "address") {
          result = await analyzeByAddress(apiKey, addressInput.value.trim());
        } else {
          result = await analyzeByStation(apiKey, selectedStation);
        }
        const overall = result.overall;
        const ageGroups = result.age_groups;
        const byFloorPlan = result.by_floor_plan;
        const mansionResults = result.mansion_results;
        const citywide = result.citywide;
        const municipalityName = result.municipality;
        lastOverallStats = overall;
        lastAgeGroups = ageGroups;
        renderMansionSummary(result);
        renderMarketDashboard(overall, byFloorPlan, mansionResults, citywide.overall, municipalityName);
        renderAgeCurve(ageGroups);
        compareHint.style.display = "none";
        compareForm.style.display = "block";
        compareBtn.disabled = false;
        loading.className = "loading";
        resultsEl.className = "results active";
        resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        loading.className = "loading";
        const errCard = document.getElementById("searchCard");
        if (errCard) {
          const existing = errCard.querySelector(".status");
          if (existing) existing.remove();
          const errEl = createSafeElement("div", e.message || "\u5206\u6790\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F");
          errEl.className = "status error";
          errCard.appendChild(errEl);
          setTimeout(function() {
            errEl.remove();
          }, 8e3);
        }
      }
      analyzeBtn.disabled = false;
    });
    compareBtn.addEventListener("click", function() {
      if (!lastOverallStats) return;
      const areaVal = parseFloat(compareAreaInput.value.trim());
      const buildYearVal = parseInt(compareBuildYearInput.value.trim(), 10);
      const priceVal = parseFloat(comparePriceInput.value.trim());
      if (isNaN(areaVal) || areaVal <= 0) {
        compareResult.textContent = "";
        const errEl = createSafeElement("div", "\u9762\u7A4D\u3092\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
        errEl.className = "status error";
        errEl.style.display = "block";
        compareResult.appendChild(errEl);
        return;
      }
      if (isNaN(buildYearVal) || buildYearVal < 1900 || buildYearVal > (/* @__PURE__ */ new Date()).getFullYear()) {
        compareResult.textContent = "";
        const errEl = createSafeElement("div", "\u5EFA\u7BC9\u5E74\uFF08\u897F\u66A6\uFF09\u3092\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
        errEl.className = "status error";
        errEl.style.display = "block";
        compareResult.appendChild(errEl);
        return;
      }
      if (isNaN(priceVal) || priceVal <= 0) {
        compareResult.textContent = "";
        const errEl = createSafeElement("div", "\u58F2\u51FA\u4FA1\u683C\u3092\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
        errEl.className = "status error";
        errEl.style.display = "block";
        compareResult.appendChild(errEl);
        return;
      }
      const userInput = {
        area_m2: areaVal,
        build_year: buildYearVal,
        asking_price: priceVal
      };
      const cr = compareMansionPrice(userInput, lastOverallStats, lastAgeGroups);
      renderCompareResult(cr);
    });
    addressInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !analyzeBtn.disabled) {
        analyzeBtn.click();
      }
    });
  }
  (function autoInit() {
    if (typeof document === "undefined") return;
    if (!document.getElementById("analyzeBtn")) return;
    init();
  })();
})();
