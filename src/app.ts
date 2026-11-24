import type {
  TransactionItem,
  MansionResult,
  MansionStats,
  AgeGroup,
  UserInput,
  CompareResult,
  StationData,
} from './types';

// ═══════════════════════════════════════════════════════════
// Exported Constants（テストからも参照）
// ═══════════════════════════════════════════════════════════

export const PREFECTURE_CODES: Record<string, string> = {
  '01': '北海道', '02': '青森県', '03': '岩手県', '04': '宮城県',
  '05': '秋田県', '06': '山形県', '07': '福島県', '08': '茨城県',
  '09': '栃木県', '10': '群馬県', '11': '埼玉県', '12': '千葉県',
  '13': '東京都', '14': '神奈川県', '15': '新潟県', '16': '富山県',
  '17': '石川県', '18': '福井県', '19': '山梨県', '20': '長野県',
  '21': '岐阜県', '22': '静岡県', '23': '愛知県', '24': '三重県',
  '25': '滋賀県', '26': '京都府', '27': '大阪府', '28': '兵庫県',
  '29': '奈良県', '30': '和歌山県', '31': '鳥取県', '32': '島根県',
  '33': '岡山県', '34': '広島県', '35': '山口県', '36': '徳島県',
  '37': '香川県', '38': '愛媛県', '39': '高知県', '40': '福岡県',
  '41': '佐賀県', '42': '長崎県', '43': '熊本県', '44': '大分県',
  '45': '宮崎県', '46': '鹿児島県', '47': '沖縄県',
};

export const ZONING_CATEGORIES: Record<string, string[]> = {
  '住居系': [
    '第１種低層住居専用地域', '第１種低層住居専用', '第一種低層住居専用地域',
    '第２種低層住居専用地域', '第２種低層住居専用', '第二種低層住居専用地域',
    '第１種中高層住居専用地域', '第１種中高層住居専用', '第一種中高層住居専用地域',
    '第２種中高層住居専用地域', '第２種中高層住居専用', '第二種中高層住居専用地域',
    '第１種住居地域', '第１種住居', '第一種住居地域',
    '第２種住居地域', '第２種住居', '第二種住居地域',
    '準住居地域', '準住居',
    '田園住居地域', '田園住居',
  ],
  '商業系': [
    '近隣商業地域', '近隣商業',
    '商業地域', '商業',
  ],
  '工業系': [
    '準工業地域', '準工業',
    '工業地域', '工業',
    '工業専用地域', '工業専用',
  ],
};

// ═══════════════════════════════════════════════════════════
// Exported Pure Functions（テスト対象）
// ═══════════════════════════════════════════════════════════

/** 市区町村コード → 都道府県名 */
export function getPrefName(muniCd: string): string {
  return PREFECTURE_CODES[muniCd.substring(0, 2)] || '';
}

/** 地名から丁目を除去 */
export function getDistrictName(lv01Nm: string): string {
  return lv01Nm.replace(/([一二三四五六七八九十百千万]+|[0-9]+)丁目$/, '');
}

/** UseDistrict / CityPlanning フォールバック */
export function getUseDistrict(item: TransactionItem): string {
  return item.UseDistrict || item.CityPlanning || '';
}

/** 用途地域の大分類判定（住居系/商業系/工業系） */
export function getZoningCategory(useDistrict: string): string {
  if (!useDistrict) return '';
  for (const cat of Object.keys(ZONING_CATEGORIES)) {
    const types = ZONING_CATEGORIES[cat];
    for (const t of types) {
      if (useDistrict.includes(t)) return cat;
    }
  }
  return '';
}

/** 地区名で取引データを絞り込み */
export function filterByDistrict(
  data: TransactionItem[],
  prefecture: string,
  municipality: string,
  districtName: string,
): TransactionItem[] {
  const filtered: TransactionItem[] = [];
  for (const item of data) {
    if (item.Prefecture !== prefecture) continue;
    const itemMuni = item.Municipality || '';
    if (municipality) {
      const muniMatch =
        itemMuni === municipality ||
        (municipality.endsWith('区') && itemMuni.endsWith(municipality));
      if (!muniMatch) continue;
    }
    if (item.DistrictName !== districtName) continue;
    filtered.push(item);
  }
  return filtered;
}

/** 和暦→西暦変換 */
export function convertJapaneseYear(yearStr: string): number | null {
  if (!yearStr) return null;
  const normalized = yearStr.replace('元年', '1年');
  let m: RegExpMatchArray | null;
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

/** 中央値 */
export function median(arr: number[]): number | null {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** 万円表示（小数1桁） */
export function formatManYen(value: number | null | undefined): string {
  if (value == null) return '-';
  return (value / 10000).toFixed(1);
}

/** 億/万円表示 */
export function formatPrice(value: number | string | null | undefined): string {
  if (!value) return '-';
  const num = typeof value === 'string' ? parseInt(value) : value;
  if (isNaN(num) || num <= 0) return '-';
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '億';
  return Math.round(num / 10000).toLocaleString() + '万';
}

/** 異常値除外（中央値の1/5未満を除外） */
export function removeSqmOutliers(results: MansionResult[]): MansionResult[] {
  const prices = results.map(r => r.sqm_price);
  if (prices.length < 3) return results;
  const mid = median(prices)!; // 3件以上あるため中央値は必ず存在する
  return results.filter(r => r.sqm_price >= mid / 5);
}

/** 中古マンション取引を抽出して㎡単価を算出 */
export function calcMansionStats(items: TransactionItem[]): MansionResult[] {
  const currentYear = new Date().getFullYear();
  const results: MansionResult[] = [];
  for (const item of items) {
    if (item.Type !== '中古マンション等') continue;
    const tradePrice = parseInt(item.TradePrice || '0') || 0;
    if (tradePrice <= 0) continue;
    const areaM2 = parseFloat(item.Area || '0') || 0;
    if (areaM2 <= 0) continue;

    const sqmPrice = tradePrice / areaM2;
    const buildYear = convertJapaneseYear(item.BuildingYear || '');
    const age = buildYear != null ? currentYear - buildYear : null;

    results.push({
      sqm_price: sqmPrice,
      trade_price: tradePrice,
      area_m2: areaM2,
      floor_plan: item.FloorPlan || '',
      build_year: buildYear,
      age: age,
      use_district: getUseDistrict(item),
      period: item.Period || '',
      structure: item.Structure || '',
      raw: item,
    });
  }
  return results;
}

/** マンション統計サマリー */
export function summarizeMansionStats(results: MansionResult[]): MansionStats {
  const prices = results.map(r => r.sqm_price);
  return {
    count: prices.length,
    sqm_min: prices.length ? Math.min(...prices) : null,
    sqm_max: prices.length ? Math.max(...prices) : null,
    sqm_median: median(prices),
  };
}

/** 築年数でグループ化 */
export const AGE_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: '〜5年', min: 0, max: 5 },
  { label: '6〜10年', min: 6, max: 10 },
  { label: '11〜15年', min: 11, max: 15 },
  { label: '16〜20年', min: 16, max: 20 },
  { label: '21〜25年', min: 21, max: 25 },
  { label: '26〜30年', min: 26, max: 30 },
  { label: '31年以上', min: 31, max: 999 },
];

export function groupByAge(results: MansionResult[]): AgeGroup[] {
  return AGE_BUCKETS.map(bucket => {
    const group = results.filter(r => r.age != null && r.age >= bucket.min && r.age <= bucket.max);
    const prices = group.map(r => r.sqm_price);
    return {
      label: bucket.label,
      min_age: bucket.min,
      max_age: bucket.max,
      count: group.length,
      sqm_min: prices.length ? Math.min(...prices) : null,
      sqm_max: prices.length ? Math.max(...prices) : null,
      sqm_median: median(prices),
    };
  });
}

/** 間取り別に統計 */
export function summarizeByFloorPlan(results: MansionResult[]): Record<string, MansionStats> {
  const groups: Record<string, MansionResult[]> = {};
  for (const r of results) {
    const key = r.floor_plan || '不明';
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  const summaries: Record<string, MansionStats> = {};
  for (const plan of Object.keys(groups)) {
    summaries[plan] = summarizeMansionStats(groups[plan]);
  }
  return summaries;
}

/** ユーザー入力と相場を比較 */
export function compareMansionPrice(
  userInput: UserInput,
  overallStats: MansionStats,
  ageGroups: AgeGroup[],
): CompareResult {
  const userSqmPrice = (userInput.asking_price * 10000) / userInput.area_m2;
  const currentYear = new Date().getFullYear();
  const userAge = currentYear - userInput.build_year;

  // 該当する築年数グループを探す
  const ageGroup = ageGroups.find(g => userAge >= g.min_age && userAge <= g.max_age);
  const ageGroupMedian = ageGroup?.sqm_median ?? null;
  const ageGroupLabel = ageGroup?.label ?? '不明';

  // 比較対象: 築年数グループの中央値があればそれ、なければ全体中央値
  const compareMedian = ageGroupMedian ?? overallStats.sqm_median;
  const sampleCount = ageGroup && ageGroupMedian != null ? ageGroup.count : overallStats.count;

  if (compareMedian == null || compareMedian <= 0) {
    return {
      user_sqm_price: userSqmPrice,
      market_median: null,
      diff_ratio: null,
      verdict: 'unknown',
      age_group_median: ageGroupMedian,
      age_group_label: ageGroupLabel,
      sample_count: sampleCount,
    };
  }

  const diffRatio = (userSqmPrice - compareMedian) / compareMedian;
  let verdict: CompareResult['verdict'];
  if (diffRatio > 0.2) verdict = 'high';
  else if (diffRatio > 0.1) verdict = 'slightly_high';
  else if (diffRatio >= -0.1) verdict = 'fair';
  else if (diffRatio >= -0.2) verdict = 'slightly_low';
  else verdict = 'low';

  return {
    user_sqm_price: userSqmPrice,
    market_median: compareMedian,
    diff_ratio: diffRatio,
    verdict,
    age_group_median: ageGroupMedian,
    age_group_label: ageGroupLabel,
    sample_count: sampleCount,
  };
}

// ═══════════════════════════════════════════════════════════
// Non-exported Constants（DOM コードのみで使用）
// ═══════════════════════════════════════════════════════════

const GSI_GEOCODER_URL = 'https://msearch.gsi.go.jp/address-search/AddressSearch';
const GSI_REVERSE_GEOCODER_URL = 'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress';

const ZONING_DISPLAY_NAMES: Record<string, string[]> = {
  '住居系': [
    '第１種低層住居専用地域', '第２種低層住居専用地域',
    '第１種中高層住居専用地域', '第２種中高層住居専用地域',
    '第１種住居地域', '第２種住居地域',
    '準住居地域', '田園住居地域',
  ],
  '商業系': ['近隣商業地域', '商業地域'],
  '工業系': ['準工業地域', '工業地域', '工業専用地域'],
};

const RAW_FIELD_LABELS: [string, string][] = [
  ['Type', '種類'],
  ['TradePrice', '取引価格'],
  ['Area', '面積(㎡)'],
  ['UnitPrice', '㎡単価'],
  ['FloorAreaRatio', '容積率(%)'],
  ['CoverageRatio', '建ぺい率(%)'],
  ['UseDistrict', '用途地域'],
  ['CityPlanning', '都市計画'],
  ['Period', '取引時点'],
  ['Structure', '構造'],
  ['BuildingYear', '建築年'],
  ['TotalFloorArea', '延床面積(㎡)'],
  ['FloorPlan', '間取り'],
  ['LandShape', '土地の形状'],
  ['Frontage', '間口(m)'],
  ['Direction', '前面道路の方位'],
  ['Classification', '前面道路の種類'],
  ['Breadth', '前面道路の幅員(m)'],
  ['Use', '利用現況'],
  ['Purpose', '今後の利用目的'],
  ['Renovation', '改装'],
  ['Remarks', '備考'],
];

const RAW_FIELD_SKIP = ['Prefecture', 'Municipality', 'DistrictName', 'Region', 'MunicipalityCode'];

// ═══════════════════════════════════════════════════════════
// DOM Initialization（ブラウザのみ実行）
// ═══════════════════════════════════════════════════════════

function init(): void {
  // ─── DOM 要素 ──────────────────────────────────
  const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
  const saveKeyBtn = document.getElementById('saveKeyBtn') as HTMLButtonElement;
  const deleteKeyBtn = document.getElementById('deleteKeyBtn') as HTMLButtonElement;
  const apiKeyStatus = document.getElementById('apiKeyStatus') as HTMLElement;
  const apiKeyForm = document.getElementById('apiKeyForm') as HTMLElement;
  const apiKeyDone = document.getElementById('apiKeyDone') as HTMLElement;
  const addressInput = document.getElementById('addressInput') as HTMLInputElement;
  const stationInput = document.getElementById('stationInput') as HTMLInputElement;
  const stationCandidatesDiv = document.getElementById('stationCandidates') as HTMLElement;
  const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
  const loading = document.getElementById('loading') as HTMLElement;
  const loadingText = document.getElementById('loadingText') as HTMLElement;
  const resultsEl = document.getElementById('results') as HTMLElement;
  const resultSummary = document.getElementById('resultSummary') as HTMLElement;
  const marketDashboardContent = document.getElementById('marketDashboardContent') as HTMLElement;
  const ageCurveContent = document.getElementById('ageCurveContent') as HTMLElement;
  const compareHint = document.getElementById('compareHint') as HTMLElement;
  const compareForm = document.getElementById('compareForm') as HTMLElement;
  const compareAreaInput = document.getElementById('compareAreaInput') as HTMLInputElement;
  const compareBuildYearInput = document.getElementById('compareBuildYearInput') as HTMLInputElement;
  const comparePriceInput = document.getElementById('comparePriceInput') as HTMLInputElement;
  const compareBtn = document.getElementById('compareBtn') as HTMLButtonElement;
  const compareResult = document.getElementById('compareResult') as HTMLElement;
  const zoningCategorySelect = document.getElementById('zoningCategorySelect') as HTMLSelectElement;
  const zoningDetailDiv = document.getElementById('zoningDetail') as HTMLElement;
  const searchModeTabs = document.querySelectorAll('.search-mode-tab');
  const addressSearchArea = document.getElementById('addressSearchArea') as HTMLElement;
  const stationSearchArea = document.getElementById('stationSearchArea') as HTMLElement;

  // ─── State ──────────────────────────────────────
  let searchMode = 'address';
  let selectedStation: StationData | null = null;
  let stationsData: StationData[] | null = null;
  let stationsLoading = false;
  let highlightedIndex = -1;
  let isComposing = false;
  let selectedZoningTypes: string[] = [];
  let lastOverallStats: MansionStats | null = null;
  let lastAgeGroups: AgeGroup[] = [];

  // ─── ユーティリティ ─────────────────────────────
  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function createSafeElement(tag: string, text?: string | null, attrs?: Record<string, string>): HTMLElement {
    const el = document.createElement(tag);
    if (text != null) el.textContent = text;
    if (attrs) {
      for (const key of Object.keys(attrs)) {
        el.setAttribute(key, attrs[key]);
      }
    }
    return el;
  }

  function setLoadingText(text: string): void {
    loadingText.textContent = text;
  }

  function showStatus(el: HTMLElement, type: string, msg: string): void {
    el.className = 'status ' + type;
    el.textContent = msg;
  }

  // ─── 検索モード切替 ─────────────────────────────
  for (let ti = 0; ti < searchModeTabs.length; ti++) {
    (function (tab: Element) {
      tab.addEventListener('click', function () {
        for (let j = 0; j < searchModeTabs.length; j++) {
          (searchModeTabs[j] as HTMLElement).className = 'search-mode-tab';
        }
        (tab as HTMLElement).className = 'search-mode-tab active';
        searchMode = (tab as HTMLElement).dataset.mode || 'address';
        if (searchMode === 'address') {
          addressSearchArea.style.display = '';
          stationSearchArea.style.display = 'none';
        } else {
          addressSearchArea.style.display = 'none';
          stationSearchArea.style.display = '';
        }
      });
    })(searchModeTabs[ti]);
  }

  // ─── 駅データ遅延ロード ─────────────────────────
  async function loadStations(): Promise<StationData[]> {
    if (stationsData) return stationsData;
    if (stationsLoading) {
      let waited = 0;
      while (stationsLoading && waited < 10000) {
        await sleep(100);
        waited += 100;
      }
      return stationsData!;
    }
    stationsLoading = true;
    const resp = await fetch('stations.json');
    stationsData = await resp.json();
    stationsLoading = false;
    return stationsData!;
  }

  // ─── 駅名インクリメンタルサーチ ──────────────────
  function buildCandidateLabel(station: StationData): string {
    const prefName = getPrefName(station.pref + '000');
    const lines = station.lines ? station.lines.split(',') : [];
    let lineText = '';
    if (lines.length === 1) {
      lineText = lines[0];
    } else if (lines.length === 2) {
      lineText = lines[0] + ' 他1路線';
    } else if (lines.length > 2) {
      lineText = lines[0] + ' 他' + (lines.length - 1) + '路線';
    }
    let label = station.name + '（' + prefName;
    if (lineText) label += '・' + lineText;
    label += '）';
    return label;
  }

  function renderCandidates(stations: StationData[]): void {
    stationCandidatesDiv.textContent = '';
    highlightedIndex = -1;
    if (!stations || stations.length === 0) {
      stationCandidatesDiv.className = 'station-candidates';
      return;
    }
    for (const station of stations) {
      const item = createSafeElement('div', buildCandidateLabel(station));
      item.className = 'station-candidate';
      item.addEventListener('mousedown', function (e) {
        e.preventDefault();
        selectStation(station);
      });
      stationCandidatesDiv.appendChild(item);
    }
    stationCandidatesDiv.className = 'station-candidates open';
  }

  function selectStation(station: StationData): void {
    selectedStation = station;
    stationInput.value = buildCandidateLabel(station);
    stationCandidatesDiv.className = 'station-candidates';
    stationCandidatesDiv.textContent = '';
    highlightedIndex = -1;
  }

  function highlightCandidate(index: number): void {
    const items = stationCandidatesDiv.querySelectorAll('.station-candidate');
    for (let i = 0; i < items.length; i++) {
      (items[i] as HTMLElement).className = 'station-candidate';
    }
    if (index >= 0 && index < items.length) {
      (items[index] as HTMLElement).className = 'station-candidate highlighted';
      highlightedIndex = index;
    } else {
      highlightedIndex = -1;
    }
  }

  stationInput.addEventListener('compositionstart', function () { isComposing = true; });
  stationInput.addEventListener('compositionend', function () {
    isComposing = false;
    stationInput.dispatchEvent(new Event('input'));
  });

  stationInput.addEventListener('input', async function () {
    if (isComposing) return;
    const q = stationInput.value.trim();
    selectedStation = null;
    if (q.length < 2) {
      stationCandidatesDiv.className = 'station-candidates';
      stationCandidatesDiv.textContent = '';
      return;
    }
    const all = await loadStations();
    const prefix: StationData[] = [];
    const middle: StationData[] = [];
    for (const s of all) {
      if (s.name.indexOf(q) === 0) {
        prefix.push(s);
      } else if (s.name.indexOf(q) > 0) {
        middle.push(s);
      }
    }
    renderCandidates(prefix.concat(middle).slice(0, 15));
  });

  stationInput.addEventListener('keydown', function (e) {
    const items = stationCandidatesDiv.querySelectorAll('.station-candidate');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let next = highlightedIndex + 1;
      if (next >= items.length) next = 0;
      highlightCandidate(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let prev = highlightedIndex - 1;
      if (prev < 0) prev = items.length - 1;
      highlightCandidate(prev);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < items.length) {
        e.preventDefault();
        const all = stationsData;
        if (all) {
          const q = stationInput.value.trim();
          const prefix2: StationData[] = [];
          const middle2: StationData[] = [];
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
    } else if (e.key === 'Escape') {
      stationCandidatesDiv.className = 'station-candidates';
      stationCandidatesDiv.textContent = '';
      highlightedIndex = -1;
    }
  });

  stationInput.addEventListener('blur', function () {
    setTimeout(function () {
      stationCandidatesDiv.className = 'station-candidates';
      stationCandidatesDiv.textContent = '';
      highlightedIndex = -1;
    }, 150);
  });

  // ─── 用途地域フィルタ UI ─────────────────────────
  function renderZoningChips(category: string): void {
    zoningDetailDiv.textContent = '';
    selectedZoningTypes = [];
    if (!category) {
      zoningDetailDiv.className = 'zoning-detail';
      return;
    }
    const names = ZONING_DISPLAY_NAMES[category] || [];
    const chipsDiv = createSafeElement('div');
    chipsDiv.className = 'zoning-chips';
    const hint = createSafeElement('div');
    hint.className = 'filter-hint';
    hint.textContent = '選択しなければ「' + category + '」全体で分析します';
    zoningDetailDiv.appendChild(hint);

    for (const name of names) {
      const chip = createSafeElement('label');
      chip.className = 'zoning-chip';
      const cb = document.createElement('input') as HTMLInputElement;
      cb.type = 'checkbox';
      cb.value = name;
      chip.appendChild(cb);
      chip.appendChild(createSafeElement('span', name));
      cb.addEventListener('change', function () {
        if (cb.checked) {
          chip.className = 'zoning-chip selected';
          selectedZoningTypes.push(name);
        } else {
          chip.className = 'zoning-chip';
          selectedZoningTypes = selectedZoningTypes.filter(t => t !== name);
        }
      });
      chipsDiv.appendChild(chip);
    }
    zoningDetailDiv.appendChild(chipsDiv);
    zoningDetailDiv.className = 'zoning-detail visible';
  }

  zoningCategorySelect.addEventListener('change', function () {
    renderZoningChips(zoningCategorySelect.value);
  });

  function filterByZoning<T extends { use_district: string }>(dataArray: T[]): T[] {
    const category = zoningCategorySelect.value;
    if (!category) return dataArray;
    const filtered: T[] = [];
    for (const item of dataArray) {
      const ud = item.use_district;
      const itemCategory = getZoningCategory(ud);
      if (itemCategory !== category) continue;
      if (selectedZoningTypes.length > 0) {
        let matched = false;
        for (const st of selectedZoningTypes) {
          if (ud.includes(st)) { matched = true; break; }
        }
        if (!matched) continue;
      }
      filtered.push(item);
    }
    return filtered;
  }

  // ─── APIキー管理 ─────────────────────────────────
  function getApiKey(): string {
    return localStorage.getItem('reinfolib_api_key') || '';
  }

  function setApiKey(key: string): void {
    localStorage.setItem('reinfolib_api_key', key);
  }

  function removeApiKey(): void {
    localStorage.removeItem('reinfolib_api_key');
  }

  function updateKeyUI(): void {
    if (getApiKey()) {
      apiKeyForm.style.display = 'none';
      apiKeyDone.style.display = 'block';
      analyzeBtn.disabled = false;
    } else {
      apiKeyForm.style.display = 'block';
      apiKeyDone.style.display = 'none';
      analyzeBtn.disabled = true;
    }
  }

  saveKeyBtn.addEventListener('click', async function () {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showStatus(apiKeyStatus, 'error', 'APIキーを入力してください');
      return;
    }
    saveKeyBtn.disabled = true;
    showStatus(apiKeyStatus, 'info', 'APIキーを検証中...');
    try {
      const resp = await fetch('/api/XIT002?area=13', {
        redirect: 'error', headers: { 'Ocp-Apim-Subscription-Key': key },
      });
      if (resp.ok) {
        const cities = await resp.json();
        if (!Array.isArray(cities?.data) || !cities.data.some((city: {id?: string}) => /^13\d{3}$/.test(city?.id ?? ''))) {
          showStatus(apiKeyStatus, 'error', 'プロキシから市区町村一覧を取得できません。');
        } else {
          setApiKey(key);
          apiKeyInput.value = '';
          apiKeyStatus.className = 'status';
          apiKeyStatus.textContent = '';
          updateKeyUI();
        }
      } else if (resp.status === 401 || resp.status === 403) {
        showStatus(apiKeyStatus, 'error', 'APIキーが無効です。正しいキーを入力してください。');
      } else {
        showStatus(apiKeyStatus, 'error', 'API接続エラー（ステータス: ' + resp.status + '）');
      }
    } catch {
      showStatus(apiKeyStatus, 'error', 'サーバーに接続できません。しばらく経ってからお試しください。');
    }
    saveKeyBtn.disabled = false;
  });

  deleteKeyBtn.addEventListener('click', function () {
    removeApiKey();
    updateKeyUI();
  });

  updateKeyUI();

  // ─── ジオコーディング ──────────────────────────
  async function geocode(address: string): Promise<{ lat: number; lon: number }> {
    const resp = await fetch(GSI_GEOCODER_URL + '?q=' + encodeURIComponent(address));
    if (!resp.ok) throw new Error('ジオコーダーエラー');
    const data = await resp.json();
    if (!data || data.length === 0) throw new Error('住所が見つかりません: ' + address);
    const coords = data[0].geometry.coordinates;
    return { lat: coords[1], lon: coords[0] };
  }

  async function reverseGeocode(lat: number, lon: number): Promise<{ muniCd: string; lv01Nm: string }> {
    const resp = await fetch(GSI_REVERSE_GEOCODER_URL + '?lat=' + lat + '&lon=' + lon);
    if (!resp.ok) throw new Error('逆ジオコーダーエラー');
    const data = await resp.json();
    return {
      muniCd: data.results.muniCd,
      lv01Nm: data.results.lv01Nm,
    };
  }

  // ─── 市区町村名取得 ─────────────────────────────
  async function getCityName(apiKey: string, muniCd: string): Promise<string | null> {
    const prefCd = muniCd.substring(0, 2);
    const resp = await fetch('/api/XIT002?area=' + prefCd, {
      redirect: 'error', headers: { 'Ocp-Apim-Subscription-Key': apiKey },
    });
    if (!resp.ok) throw new Error('市区町村名の取得に失敗');
    const data = await resp.json();
    const items = data.data || [];
    for (const item of items) {
      if (item.id === muniCd) return item.name;
    }
    return null;
  }

  // ─── 取引データ取得 ─────────────────────────────
  async function fetchTransactions(apiKey: string, muniCd: string, years: number[]): Promise<{year: number; rows: TransactionItem[] | null}[]> {
    const batches = [];
    for (let i = 0; i < years.length; i++) {
      if (i > 0) await sleep(1000);
      const resp = await fetch(
        '/api/XIT001?year=' + years[i] + '&city=' + muniCd,
        { redirect: 'error', headers: { 'Ocp-Apim-Subscription-Key': apiKey } },
      );
      if (resp.status === 404) {
        batches.push({year: years[i], rows: null});
        continue;
      }
      if (!resp.ok) throw new Error('取引データ取得エラー (year=' + years[i] + ')');
      const result = await resp.json();
      if (!Array.isArray(result?.data) || (result.status && result.status !== 'OK')) {
        throw new Error(years[i] + '年の取引データを確認できません');
      }
      batches.push({year: years[i], rows: result.data as TransactionItem[]});
    }
    return batches;
  }

  // ─── 信頼度判定 ──────────────────────────────────
  function getConfidence(count: number): { label: string; cls: string; note: string } {
    if (count >= 30) return { label: '信頼度: 高', cls: 'confidence-high', note: '' };
    if (count >= 20) return { label: '信頼度: 中', cls: 'confidence-mid', note: '中央値は概ね安定。±15%程度のブレ幅を見てください。' };
    if (count >= 5) return { label: '信頼度: 低', cls: 'confidence-low', note: '件数が少なく参考値です。下の市区町村全体のデータもご参照ください。' };
    return { label: '信頼度: 不足', cls: 'confidence-poor', note: '件数が極めて少なく統計的に信頼できません。市区町村全体のデータをご参照ください。' };
  }

  // ─── レンダリング: サマリー ──────────────────────
  function renderMansionSummary(result: Record<string, unknown>): void {
    resultSummary.textContent = '';

    const scopeLabel = result.scopeLabel as string;
    const years = result.years as number[];
    const totalRecords = result.total_records as number;
    const mansionCount = result.mansion_count as number;
    const overall = result.overall as MansionStats;

    const h3 = createSafeElement('h3', scopeLabel || '中古マンション相場');
    resultSummary.appendChild(h3);

    const grid = createSafeElement('div');
    grid.className = 'summary-grid';

    const conf = getConfidence(mansionCount);
    const badge = createSafeElement('span', conf.label);
    badge.className = 'confidence-badge ' + conf.cls;
    badge.style.marginLeft = '0';
    badge.style.marginBottom = '8px';
    badge.style.display = 'inline-flex';
    resultSummary.insertBefore(badge, h3.nextSibling);

    const items: { label: string; value: string; unit: string }[] = [
      { label: '検索した年', value: years.join(', '), unit: '' },
      { label: '対象エリアの集計内訳', value: String(result.coverage), unit: '' },
      { label: '取引件数（全体）', value: String(totalRecords), unit: '件' },
      { label: 'マンション取引件数', value: String(mansionCount), unit: '件' },
    ];

    if (overall.sqm_median != null) {
      items.push({ label: '㎡単価 中央値', value: formatManYen(overall.sqm_median), unit: '万円/㎡' });
    }
    if (overall.sqm_min != null && overall.sqm_max != null) {
      items.push({
        label: '㎡単価 レンジ',
        value: formatManYen(overall.sqm_min) + '〜' + formatManYen(overall.sqm_max),
        unit: '万円/㎡',
      });
    }

    for (const it of items) {
      const item = createSafeElement('div');
      item.className = 'summary-item';
      const lbl = createSafeElement('div', it.label);
      lbl.className = 'summary-label';
      const val = createSafeElement('div');
      val.className = 'summary-value';
      val.textContent = it.value;
      if (it.unit) {
        const unitSpan = createSafeElement('span', ' ' + it.unit);
        unitSpan.className = 'summary-unit';
        val.appendChild(unitSpan);
      }
      item.appendChild(lbl);
      item.appendChild(val);
      grid.appendChild(item);
    }
    resultSummary.appendChild(grid);
  }

  // ─── レンダリング: エリア相場ダッシュボード ─────
  function renderMarketDashboard(
    stats: MansionStats,
    byFloorPlan: Record<string, MansionStats>,
    mansionResults: MansionResult[],
    citywideStats: MansionStats,
    municipalityName: string,
  ): void {
    marketDashboardContent.textContent = '';

    const count = stats.count;
    const conf = getConfidence(count);

    if (count === 0) {
      const noData = createSafeElement('p', '対象エリアのマンション取引データがありません');
      noData.className = 'data-note';
      marketDashboardContent.appendChild(noData);
    } else {
      // 全体サマリーテーブル
      const overallWrap = createSafeElement('div');
      overallWrap.className = 'table-wrap';
      const overallTable = createSafeElement('table');
      const overallThead = createSafeElement('thead');
      const overallHeaderRow = createSafeElement('tr');
      for (const h of ['件数', '㎡単価 最小', '㎡単価 最大', '㎡単価 中央値']) {
        overallHeaderRow.appendChild(createSafeElement('th', h));
      }
      overallThead.appendChild(overallHeaderRow);
      overallTable.appendChild(overallThead);

      const overallTbody = createSafeElement('tbody');
      const overallRow = createSafeElement('tr');
      overallRow.appendChild(createSafeElement('td', count + '件'));
      overallRow.appendChild(createSafeElement('td', formatManYen(stats.sqm_min) + '万円/㎡'));
      overallRow.appendChild(createSafeElement('td', formatManYen(stats.sqm_max) + '万円/㎡'));
      overallRow.appendChild(createSafeElement('td', formatManYen(stats.sqm_median) + '万円/㎡'));
      overallTbody.appendChild(overallRow);
      overallTable.appendChild(overallTbody);
      overallWrap.appendChild(overallTable);
      marketDashboardContent.appendChild(overallWrap);

      // 間取り別テーブル
      const fpKeys = Object.keys(byFloorPlan);
      if (fpKeys.length > 0) {
        const fpTitle = createSafeElement('p', '間取り別㎡単価');
        fpTitle.className = 'data-note';
        fpTitle.style.marginTop = '16px';
        fpTitle.style.marginBottom = '8px';
        fpTitle.style.fontWeight = '700';
        fpTitle.style.color = 'var(--brown-warm)';
        marketDashboardContent.appendChild(fpTitle);

        const fpWrap = createSafeElement('div');
        fpWrap.className = 'table-wrap';
        const fpTable = createSafeElement('table');
        const fpThead = createSafeElement('thead');
        const fpHeaderRow = createSafeElement('tr');
        for (const h of ['間取り', '件数', '㎡単価 最小', '㎡単価 最大', '㎡単価 中央値']) {
          fpHeaderRow.appendChild(createSafeElement('th', h));
        }
        fpThead.appendChild(fpHeaderRow);
        fpTable.appendChild(fpThead);

        const fpTbody = createSafeElement('tbody');
        for (const fp of fpKeys) {
          const s = byFloorPlan[fp];
          const row = createSafeElement('tr');
          row.appendChild(createSafeElement('td', fp || '不明'));
          row.appendChild(createSafeElement('td', s.count + '件'));
          row.appendChild(createSafeElement('td', formatManYen(s.sqm_min) + '万円/㎡'));
          row.appendChild(createSafeElement('td', formatManYen(s.sqm_max) + '万円/㎡'));
          row.appendChild(createSafeElement('td', formatManYen(s.sqm_median) + '万円/㎡'));
          fpTbody.appendChild(row);
        }
        fpTable.appendChild(fpTbody);
        fpWrap.appendChild(fpTable);
        marketDashboardContent.appendChild(fpWrap);
      }

      // 個別取引データ（トグル）
      if (mansionResults.length > 0) {
        const section = createSafeElement('div');
        section.className = 'detail-section';

        const toggleBtn = createSafeElement('button', '');
        toggleBtn.className = 'detail-toggle';
        const arrow = createSafeElement('span', '\u25B6');
        arrow.className = 'arrow';
        toggleBtn.appendChild(arrow);
        toggleBtn.appendChild(document.createTextNode(' 個別取引データ（' + mansionResults.length + '件）'));

        toggleBtn.addEventListener('click', function () {
          const isOpen = section.classList.toggle('open');
          toggleBtn.classList.toggle('open', isOpen);
        });

        const detailWrap = createSafeElement('div');
        detailWrap.className = 'table-wrap';
        detailWrap.style.marginTop = '12px';
        const detailTable = createSafeElement('table');
        const detailThead = createSafeElement('thead');
        const detailHeaderRow = createSafeElement('tr');
        for (const h of ['㎡単価', '取引価格', '面積', '間取り', '築年数', '用途地域', '構造', '取引時点']) {
          detailHeaderRow.appendChild(createSafeElement('th', h));
        }
        detailThead.appendChild(detailHeaderRow);
        detailTable.appendChild(detailThead);

        const detailTbody = createSafeElement('tbody');
        const sorted = [...mansionResults].sort((a, b) => b.sqm_price - a.sqm_price);
        for (const d of sorted) {
          const row = createSafeElement('tr');
          row.appendChild(createSafeElement('td', formatManYen(d.sqm_price) + '万円/㎡'));
          row.appendChild(createSafeElement('td', formatPrice(d.trade_price)));
          row.appendChild(createSafeElement('td', d.area_m2 + '㎡'));
          row.appendChild(createSafeElement('td', d.floor_plan || '-'));
          row.appendChild(createSafeElement('td', d.age != null ? d.age + '年' : '-'));
          row.appendChild(createSafeElement('td', d.use_district || '-'));
          row.appendChild(createSafeElement('td', d.structure || '-'));
          row.appendChild(createSafeElement('td', d.period || '-'));
          detailTbody.appendChild(row);
        }
        detailTable.appendChild(detailTbody);
        detailWrap.appendChild(detailTable);
        section.appendChild(detailWrap);

        marketDashboardContent.appendChild(toggleBtn);
        marketDashboardContent.appendChild(section);
      }
    }

    // 信頼度が低い場合: 市区町村全体の参考データ
    if (count < 20 && citywideStats.count > 0) {
      const ref = createSafeElement('div');
      ref.className = 'citywide-ref';

      const refTitle = createSafeElement('div', municipalityName + '全体の参考データ（マンション取引）');
      refTitle.className = 'ref-title';
      ref.appendChild(refTitle);

      const refWrap = createSafeElement('div');
      refWrap.className = 'table-wrap';
      const refTable = createSafeElement('table');
      const refThead = createSafeElement('thead');
      const refHeaderRow = createSafeElement('tr');
      for (const h of ['件数', '㎡単価 最小', '㎡単価 最大', '㎡単価 中央値']) {
        refHeaderRow.appendChild(createSafeElement('th', h));
      }
      refThead.appendChild(refHeaderRow);
      refTable.appendChild(refThead);

      const refTbody = createSafeElement('tbody');
      const refRow = createSafeElement('tr');
      refRow.appendChild(createSafeElement('td', citywideStats.count + '件'));
      refRow.appendChild(createSafeElement('td', formatManYen(citywideStats.sqm_min) + '万円/㎡'));
      refRow.appendChild(createSafeElement('td', formatManYen(citywideStats.sqm_max) + '万円/㎡'));
      refRow.appendChild(createSafeElement('td', formatManYen(citywideStats.sqm_median) + '万円/㎡'));
      refTbody.appendChild(refRow);
      refTable.appendChild(refTbody);
      refWrap.appendChild(refTable);
      ref.appendChild(refWrap);

      const refNote = createSafeElement('div', '地区の件数が少ないため、市区町村全体の統計を参考として表示しています。');
      refNote.className = 'ref-note';
      ref.appendChild(refNote);

      marketDashboardContent.appendChild(ref);
    }

    if (conf.note) {
      const confNote = createSafeElement('div', conf.note);
      confNote.className = 'data-warning';
      confNote.style.marginTop = '12px';
      marketDashboardContent.appendChild(confNote);
    }
  }

  // ─── レンダリング: 築年数別減価カーブ ───────────
  function renderAgeCurve(ageGroups: AgeGroup[]): void {
    ageCurveContent.textContent = '';

    if (ageGroups.length === 0) {
      ageCurveContent.appendChild(createSafeElement('p', 'データがありません'));
      return;
    }

    const wrap = createSafeElement('div');
    wrap.className = 'table-wrap';
    const table = createSafeElement('table');
    const thead = createSafeElement('thead');
    const headerRow = createSafeElement('tr');
    for (const h of ['築年数', '件数', '㎡単価 最小', '㎡単価 最大', '㎡単価 中央値']) {
      headerRow.appendChild(createSafeElement('th', h));
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = createSafeElement('tbody');
    for (const g of ageGroups) {
      const row = createSafeElement('tr');
      row.appendChild(createSafeElement('td', g.label));
      if (g.count === 0) {
        row.appendChild(createSafeElement('td', '0件'));
        row.appendChild(createSafeElement('td', '-'));
        row.appendChild(createSafeElement('td', '-'));
        row.appendChild(createSafeElement('td', '-'));
      } else {
        row.appendChild(createSafeElement('td', g.count + '件'));
        row.appendChild(createSafeElement('td', formatManYen(g.sqm_min) + '万円/㎡'));
        row.appendChild(createSafeElement('td', formatManYen(g.sqm_max) + '万円/㎡'));
        row.appendChild(createSafeElement('td', formatManYen(g.sqm_median) + '万円/㎡'));
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    ageCurveContent.appendChild(wrap);
  }

  // ─── レンダリング: 相場比較結果 ─────────────────
  function renderCompareResult(cr: CompareResult): void {
    compareResult.textContent = '';

    const box = createSafeElement('div');
    box.className = 'compare-result-box verdict-' + cr.verdict;

    const verdictMessages: Record<string, { text: string; color: string }> = {
      high: { text: '相場より高め（+20%超）', color: 'var(--red)' },
      slightly_high: { text: 'やや高め（+10〜20%）', color: '#E65100' },
      fair: { text: '相場並み（±10%以内）', color: 'var(--green-deep)' },
      slightly_low: { text: 'やや安め（-10〜20%）', color: '#1565C0' },
      low: { text: '相場より安め（-20%超）', color: '#1565C0' },
      unknown: { text: '比較データ不足', color: 'var(--brown-light)' },
    };

    const vm = verdictMessages[cr.verdict] || verdictMessages.unknown;

    const verdictEl = createSafeElement('div', vm.text);
    verdictEl.style.fontSize = '18px';
    verdictEl.style.fontWeight = '700';
    verdictEl.style.color = vm.color;
    verdictEl.style.marginBottom = '12px';
    box.appendChild(verdictEl);

    const userSqmEl = createSafeElement('div', '入力物件の㎡単価: ' + formatManYen(cr.user_sqm_price) + '万円/㎡');
    userSqmEl.style.fontSize = '14px';
    userSqmEl.style.marginBottom = '4px';
    box.appendChild(userSqmEl);

    if (cr.market_median != null) {
      const label = cr.age_group_median == null ? '対象エリア全体' : cr.age_group_label;
      const marketEl = createSafeElement('div', '市場中央値（' + label + '）: ' + formatManYen(cr.market_median) + '万円/㎡');
      marketEl.style.fontSize = '14px';
      marketEl.style.marginBottom = '4px';
      box.appendChild(marketEl);
    }

    if (cr.diff_ratio != null) {
      const sign = cr.diff_ratio >= 0 ? '+' : '';
      const diffEl = createSafeElement('div', '乖離率: ' + sign + (cr.diff_ratio * 100).toFixed(1) + '%');
      diffEl.style.fontSize = '14px';
      diffEl.style.marginBottom = '4px';
      box.appendChild(diffEl);
    }

    const sampleEl = createSafeElement('div', '比較サンプル数: ' + cr.sample_count + '件');
    sampleEl.style.fontSize = '12px';
    sampleEl.style.color = 'var(--brown-light)';
    sampleEl.style.marginTop = '8px';
    box.appendChild(sampleEl);

    compareResult.appendChild(box);
  }

  // ─── メイン分析フロー ──────────────────────────
  async function analyzeCore(
    apiKey: string,
    muniCd: string,
    municipality: string,
    scopeLabel: string,
    districtName: string | null,
  ): Promise<Record<string, unknown>> {
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    const prefecture = getPrefName(muniCd);

    setLoadingText('取引データを取得中（3年分）...');
    const batches = await fetchTransactions(apiKey, muniCd, years);
    const rawData = batches.flatMap(batch => batch.rows ?? []);

    setLoadingText('データを分析中...');
    let filtered: TransactionItem[];
    if (districtName) {
      filtered = filterByDistrict(rawData, prefecture, municipality, districtName);
    } else {
      filtered = rawData;
    }

    // マンション取引を抽出
    let mansionResults = calcMansionStats(filtered);
    mansionResults = removeSqmOutliers(mansionResults);
    // 用途地域フィルタ適用
    mansionResults = filterByZoning(mansionResults);

    const overallStats = summarizeMansionStats(mansionResults);
    const ageGroups = groupByAge(mansionResults);
    const byFloorPlan = summarizeByFloorPlan(mansionResults);

    // 市区町村全体（参考データ）
    let citywideResults = calcMansionStats(rawData);
    citywideResults = removeSqmOutliers(citywideResults);
    citywideResults = filterByZoning(citywideResults);
    const citywideStats = summarizeMansionStats(citywideResults);

    const usedRows = new Set(mansionResults.map(row => row.raw));
    const coverage = batches.map(({year, rows}) => {
      if (rows === null) return year + '年 未取得（404）';
      if (!rows.length) return year + '年 市区町村の取引0件';
      return year + '年 中古マンション' + rows.filter(row => usedRows.has(row)).length + '件';
    }).join(' ／ ');

    return {
      scopeLabel, prefecture, municipality,
      district_name: districtName || '', muni_cd: muniCd,
      years, coverage, total_records: rawData.length,
      mansion_count: mansionResults.length,
      overall: overallStats,
      age_groups: ageGroups,
      by_floor_plan: byFloorPlan,
      mansion_results: mansionResults,
      citywide: { overall: citywideStats },
    };
  }

  async function analyzeByAddress(apiKey: string, address: string): Promise<Record<string, unknown>> {
    setLoadingText('住所を解析中...');
    const coords = await geocode(address);

    setLoadingText('市区町村コードを取得中...');
    const geo = await reverseGeocode(coords.lat, coords.lon);

    const prefecture = getPrefName(geo.muniCd);
    const districtName = getDistrictName(geo.lv01Nm);

    setLoadingText('市区町村名を取得中...');
    const municipality = await getCityName(apiKey, geo.muniCd);
    if (!municipality) throw new Error('市区町村名の取得に失敗しました');

    const scopeLabel = prefecture + municipality + districtName + ' の中古マンション相場';
    return analyzeCore(apiKey, geo.muniCd, municipality, scopeLabel, districtName);
  }

  async function analyzeByStation(apiKey: string, station: StationData): Promise<Record<string, unknown>> {
    setLoadingText('市区町村名を取得中...');
    const municipality = await getCityName(apiKey, station.muni);
    if (!municipality) throw new Error('市区町村名の取得に失敗しました');

    const prefName = getPrefName(station.muni);
    const scopeLabel = station.name + '駅周辺（' + prefName + municipality + '全体）の中古マンション相場';
    return analyzeCore(apiKey, station.muni, municipality, scopeLabel, null);
  }

  // ─── イベントハンドラ ──────────────────────────
  analyzeBtn.addEventListener('click', async function () {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (searchMode === 'address') {
      const address = addressInput.value.trim();
      if (!address) return;
    } else {
      if (!selectedStation) {
        const errCard = document.getElementById('searchCard');
        if (errCard) {
          const existing = errCard.querySelector('.status');
          if (existing) existing.remove();
          const errEl = createSafeElement('div', '駅を候補から選択してください');
          errEl.className = 'status error';
          errCard.appendChild(errEl);
          setTimeout(function () { errEl.remove(); }, 5000);
        }
        return;
      }
    }

    analyzeBtn.disabled = true;
    compareBtn.disabled = true;
    compareResult.replaceChildren();
    loading.className = 'loading active';
    resultsEl.className = 'results';

    try {
      let result: Record<string, unknown>;
      if (searchMode === 'address') {
        result = await analyzeByAddress(apiKey, addressInput.value.trim());
      } else {
        result = await analyzeByStation(apiKey, selectedStation!);
      }

      const overall = result.overall as MansionStats;
      const ageGroups = result.age_groups as AgeGroup[];
      const byFloorPlan = result.by_floor_plan as Record<string, MansionStats>;
      const mansionResults = result.mansion_results as MansionResult[];
      const citywide = result.citywide as { overall: MansionStats };
      const municipalityName = result.municipality as string;

      // state 保存（相場比較で使う）
      lastOverallStats = overall;
      lastAgeGroups = ageGroups;

      renderMansionSummary(result);
      renderMarketDashboard(overall, byFloorPlan, mansionResults, citywide.overall, municipalityName);
      renderAgeCurve(ageGroups);

      // 相場比較フォームを有効化
      compareHint.style.display = 'none';
      compareForm.style.display = 'block';
      compareBtn.disabled = false;

      loading.className = 'loading';
      resultsEl.className = 'results active';
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      loading.className = 'loading';
      const errCard = document.getElementById('searchCard');
      if (errCard) {
        const existing = errCard.querySelector('.status');
        if (existing) existing.remove();
        const errEl = createSafeElement('div', (e as Error).message || '分析中にエラーが発生しました');
        errEl.className = 'status error';
        errCard.appendChild(errEl);
        setTimeout(function () { errEl.remove(); }, 8000);
      }
    }

    analyzeBtn.disabled = false;
  });

  compareBtn.addEventListener('click', function () {
    if (!lastOverallStats) return;

    const areaVal = parseFloat(compareAreaInput.value.trim());
    const buildYearVal = parseInt(compareBuildYearInput.value.trim(), 10);
    const priceVal = parseFloat(comparePriceInput.value.trim());

    if (isNaN(areaVal) || areaVal <= 0) {
      compareResult.textContent = '';
      const errEl = createSafeElement('div', '面積を正しく入力してください');
      errEl.className = 'status error';
      errEl.style.display = 'block';
      compareResult.appendChild(errEl);
      return;
    }
    if (isNaN(buildYearVal) || buildYearVal < 1900 || buildYearVal > new Date().getFullYear()) {
      compareResult.textContent = '';
      const errEl = createSafeElement('div', '建築年（西暦）を正しく入力してください');
      errEl.className = 'status error';
      errEl.style.display = 'block';
      compareResult.appendChild(errEl);
      return;
    }
    if (isNaN(priceVal) || priceVal <= 0) {
      compareResult.textContent = '';
      const errEl = createSafeElement('div', '売出価格を正しく入力してください');
      errEl.className = 'status error';
      errEl.style.display = 'block';
      compareResult.appendChild(errEl);
      return;
    }

    const userInput: UserInput = {
      area_m2: areaVal,
      build_year: buildYearVal,
      asking_price: priceVal,
    };

    const cr = compareMansionPrice(userInput, lastOverallStats, lastAgeGroups);
    renderCompareResult(cr);
  });

  addressInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !analyzeBtn.disabled) {
      analyzeBtn.click();
    }
  });
}

// ─── Auto-init ──────────────────────────────────
(function autoInit() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('analyzeBtn')) return;
  init();
})();
