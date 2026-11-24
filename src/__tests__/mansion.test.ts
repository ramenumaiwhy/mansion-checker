import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calcMansionStats,
  removeSqmOutliers,
  summarizeMansionStats,
  groupByAge,
  summarizeByFloorPlan,
  compareMansionPrice,
} from '../app';
import type { TransactionItem, MansionResult, AgeGroup, MansionStats, UserInput } from '../types';

// ─── テスト用ヘルパー ─────────────────────────────

/** 最低限の中古マンション取引データを生成するヘルパー */
function makeMansionItem(overrides: Partial<TransactionItem> = {}): TransactionItem {
  return {
    Type: '中古マンション等',
    TradePrice: '50000000',  // 5000万円
    Area: '70',               // 70㎡
    BuildingYear: '平成20年', // 2008年
    FloorPlan: '3LDK',
    Structure: 'ＲＣ（鉄筋コンクリート造）',
    UseDistrict: '第一種住居地域',
    Period: '令和6年第1四半期',
    ...overrides,
  };
}

// ─── calcMansionStats ────────────────────────────

describe('calcMansionStats', () => {
  // テスト実行時の currentYear を固定（2026年として計算）
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('中古マンション等のみ抽出される', () => {
    const items: TransactionItem[] = [
      makeMansionItem(),
      makeMansionItem({ Type: '宅地(土地のみ)' }),
      makeMansionItem({ Type: '宅地(土地と建物)' }),
      makeMansionItem({ Type: '中古マンション等' }),
    ];
    const results = calcMansionStats(items);
    expect(results).toHaveLength(2);
    expect(results.every(r => r.raw.Type === '中古マンション等')).toBe(true);
  });

  test('㎡単価が正しく計算される', () => {
    // 5000万円 ÷ 70㎡ ≈ 714285.71
    const results = calcMansionStats([makeMansionItem()]);
    expect(results[0].sqm_price).toBeCloseTo(50000000 / 70, 0);
  });

  test('築年数が正しく計算される（令和5年=2023年、築年数=2026-2023=3）', () => {
    const results = calcMansionStats([makeMansionItem({ BuildingYear: '令和5年' })]);
    expect(results[0].build_year).toBe(2023);
    expect(results[0].age).toBe(3);
  });

  test('平成20年の築年数（2026-2008=18）', () => {
    const results = calcMansionStats([makeMansionItem({ BuildingYear: '平成20年' })]);
    expect(results[0].build_year).toBe(2008);
    expect(results[0].age).toBe(18);
  });

  test('昭和60年の築年数（2026-1985=41）', () => {
    const results = calcMansionStats([makeMansionItem({ BuildingYear: '昭和60年' })]);
    expect(results[0].build_year).toBe(1985);
    expect(results[0].age).toBe(41);
  });

  test('BuildingYearが不明・空の場合はbuild_year/ageがnull', () => {
    const results = calcMansionStats([makeMansionItem({ BuildingYear: '' })]);
    expect(results[0].build_year).toBeNull();
    expect(results[0].age).toBeNull();
  });

  test('TradePrice <= 0 はスキップ', () => {
    const items: TransactionItem[] = [
      makeMansionItem({ TradePrice: '0' }),
      makeMansionItem({ TradePrice: '-1000000' }),
    ];
    expect(calcMansionStats(items)).toHaveLength(0);
  });

  test('Area <= 0 はスキップ', () => {
    const items: TransactionItem[] = [
      makeMansionItem({ Area: '0' }),
      makeMansionItem({ Area: '-10' }),
    ];
    expect(calcMansionStats(items)).toHaveLength(0);
  });

  test('TradePrice が欠損している場合はスキップ', () => {
    const results = calcMansionStats([makeMansionItem({ TradePrice: undefined })]);
    expect(results).toHaveLength(0);
  });

  test('Area が欠損している場合はスキップ', () => {
    const results = calcMansionStats([makeMansionItem({ Area: undefined })]);
    expect(results).toHaveLength(0);
  });

  test('空配列 → 空配列', () => {
    expect(calcMansionStats([])).toHaveLength(0);
  });

  test('FloorPlanが設定されていない場合はfloor_planが空文字', () => {
    const results = calcMansionStats([makeMansionItem({ FloorPlan: undefined })]);
    expect(results[0].floor_plan).toBe('');
  });

  test('floor_plan, use_district, period, structure が正しくマッピングされる', () => {
    const results = calcMansionStats([makeMansionItem()]);
    const r = results[0];
    expect(r.floor_plan).toBe('3LDK');
    expect(r.use_district).toBe('第一種住居地域');
    expect(r.period).toBe('令和6年第1四半期');
    expect(r.structure).toBe('ＲＣ（鉄筋コンクリート造）');
  });

  test('rawに元のTransactionItemが格納される', () => {
    const item = makeMansionItem();
    const results = calcMansionStats([item]);
    expect(results[0].raw).toBe(item);
  });

  test('中古マンション以外のTypeはすべてスキップされる', () => {
    const items: TransactionItem[] = [
      makeMansionItem({ Type: '農地' }),
      makeMansionItem({ Type: '林地' }),
      makeMansionItem({ Type: '中古マンション等' }),
    ];
    const results = calcMansionStats(items);
    expect(results).toHaveLength(1);
  });
});

// ─── removeSqmOutliers ──────────────────────────

describe('removeSqmOutliers', () => {
  /** MansionResult の最小構造を作るヘルパー */
  function makeResult(sqm_price: number): MansionResult {
    return {
      sqm_price,
      trade_price: sqm_price * 70,
      area_m2: 70,
      floor_plan: '3LDK',
      build_year: 2008,
      age: 18,
      use_district: '第一種住居地域',
      period: '令和6年第1四半期',
      structure: 'ＲＣ',
      raw: makeMansionItem(),
    };
  }

  test('3件未満ならそのまま返す', () => {
    const results = [makeResult(1000000), makeResult(100)];
    expect(removeSqmOutliers(results)).toHaveLength(2);
  });

  test('1件ならそのまま返す', () => {
    expect(removeSqmOutliers([makeResult(1000000)])).toHaveLength(1);
  });

  test('空配列ならそのまま返す', () => {
    expect(removeSqmOutliers([])).toHaveLength(0);
  });

  test('中央値の1/5未満を除外する', () => {
    // 4件の中央値は (800000 + 900000) / 2 = 850000
    // 850000 / 5 = 170000 → 50000 は除外
    const results = [
      makeResult(800000),
      makeResult(900000),
      makeResult(1000000),
      makeResult(50000),   // 170000未満 → 除外
    ];
    const filtered = removeSqmOutliers(results);
    expect(filtered).toHaveLength(3);
    expect(filtered.every(r => r.sqm_price >= 170000)).toBe(true);
  });

  test('閾値ちょうどは除外されない', () => {
    // 中央値 = 850000, 閾値 = 170000
    const results = [
      makeResult(800000),
      makeResult(900000),
      makeResult(1000000),
      makeResult(170000),  // ちょうど閾値 → 除外されない
    ];
    const filtered = removeSqmOutliers(results);
    expect(filtered).toHaveLength(4);
  });

  test('全件正常値なら除外なし', () => {
    const results = [
      makeResult(800000),
      makeResult(850000),
      makeResult(900000),
      makeResult(950000),
      makeResult(1000000),
    ];
    const filtered = removeSqmOutliers(results);
    expect(filtered).toHaveLength(5);
  });

  test('元の配列を変更しない', () => {
    const results = [
      makeResult(800000),
      makeResult(900000),
      makeResult(1000000),
      makeResult(50000),
    ];
    const original = [...results];
    removeSqmOutliers(results);
    expect(results).toEqual(original);
  });
});

// ─── summarizeMansionStats ──────────────────────

describe('summarizeMansionStats', () => {
  function makeResult(sqm_price: number): MansionResult {
    return {
      sqm_price,
      trade_price: sqm_price * 70,
      area_m2: 70,
      floor_plan: '3LDK',
      build_year: 2008,
      age: 18,
      use_district: '第一種住居地域',
      period: '令和6年第1四半期',
      structure: 'ＲＣ',
      raw: makeMansionItem(),
    };
  }

  test('空配列 → count:0, 他はnull', () => {
    const stats = summarizeMansionStats([]);
    expect(stats.count).toBe(0);
    expect(stats.sqm_min).toBeNull();
    expect(stats.sqm_max).toBeNull();
    expect(stats.sqm_median).toBeNull();
  });

  test('1件のとき min/max/median は同じ値', () => {
    const stats = summarizeMansionStats([makeResult(700000)]);
    expect(stats.count).toBe(1);
    expect(stats.sqm_min).toBe(700000);
    expect(stats.sqm_max).toBe(700000);
    expect(stats.sqm_median).toBe(700000);
  });

  test('奇数件 → 中央値は中央の値', () => {
    const results = [makeResult(600000), makeResult(800000), makeResult(1000000)];
    const stats = summarizeMansionStats(results);
    expect(stats.count).toBe(3);
    expect(stats.sqm_min).toBe(600000);
    expect(stats.sqm_max).toBe(1000000);
    expect(stats.sqm_median).toBe(800000);
  });

  test('偶数件 → 中央値は中央2件の平均', () => {
    const results = [
      makeResult(600000),
      makeResult(800000),
      makeResult(1000000),
      makeResult(1200000),
    ];
    const stats = summarizeMansionStats(results);
    expect(stats.count).toBe(4);
    expect(stats.sqm_min).toBe(600000);
    expect(stats.sqm_max).toBe(1200000);
    expect(stats.sqm_median).toBe(900000);
  });

  test('ソートされていない配列でも正しく計算される', () => {
    const results = [makeResult(1000000), makeResult(600000), makeResult(800000)];
    const stats = summarizeMansionStats(results);
    expect(stats.sqm_min).toBe(600000);
    expect(stats.sqm_max).toBe(1000000);
    expect(stats.sqm_median).toBe(800000);
  });
});

// ─── groupByAge ─────────────────────────────────

describe('groupByAge', () => {
  function makeResult(age: number | null, sqm_price: number = 700000): MansionResult {
    return {
      sqm_price,
      trade_price: sqm_price * 70,
      area_m2: 70,
      floor_plan: '3LDK',
      build_year: age !== null ? 2026 - age : null,
      age,
      use_district: '第一種住居地域',
      period: '令和6年第1四半期',
      structure: 'ＲＣ',
      raw: makeMansionItem(),
    };
  }

  test('各バケットに正しく振り分けられる', () => {
    const results = [
      makeResult(3),    // 0-5
      makeResult(5),    // 0-5
      makeResult(8),    // 6-10
      makeResult(12),   // 11-15
      makeResult(17),   // 16-20
      makeResult(23),   // 21-25
      makeResult(28),   // 26-30
      makeResult(35),   // 31+
    ];
    const groups = groupByAge(results);
    // 7バケット存在する
    expect(groups).toHaveLength(7);

    const g05 = groups.find(g => g.label.includes('5'));
    expect(g05).toBeDefined();
    expect(g05!.count).toBe(2);

    const g610 = groups.find(g => g.min_age === 6);
    expect(g610).toBeDefined();
    expect(g610!.count).toBe(1);
  });

  test('age === null はどのバケットにも入らない', () => {
    const results = [
      makeResult(null),
      makeResult(10, 800000),
    ];
    const groups = groupByAge(results);
    const totalCount = groups.reduce((sum, g) => sum + g.count, 0);
    expect(totalCount).toBe(1);
  });

  test('空配列でも7バケットが返り、全countが0', () => {
    const groups = groupByAge([]);
    expect(groups).toHaveLength(7);
    expect(groups.every(g => g.count === 0)).toBe(true);
    expect(groups.every(g => g.sqm_min === null)).toBe(true);
    expect(groups.every(g => g.sqm_max === null)).toBe(true);
    expect(groups.every(g => g.sqm_median === null)).toBe(true);
  });

  test('31+バケットにはage >= 31が入る', () => {
    const results = [
      makeResult(31),
      makeResult(40),
      makeResult(50),
    ];
    const groups = groupByAge(results);
    const g31 = groups.find(g => g.min_age === 31);
    expect(g31).toBeDefined();
    expect(g31!.count).toBe(3);
  });

  test('バケット内のsqm_min/max/medianが正しい', () => {
    const results = [
      makeResult(5, 600000),
      makeResult(3, 800000),
      makeResult(1, 1000000),
    ];
    const groups = groupByAge(results);
    const g05 = groups.find(g => g.min_age === 0);
    expect(g05).toBeDefined();
    expect(g05!.count).toBe(3);
    expect(g05!.sqm_min).toBe(600000);
    expect(g05!.sqm_max).toBe(1000000);
    expect(g05!.sqm_median).toBe(800000);
  });

  test('ageがぴったりバケット境界にある場合（age=5は0-5バケット）', () => {
    const results = [makeResult(5)];
    const groups = groupByAge(results);
    const g05 = groups.find(g => g.min_age === 0);
    expect(g05!.count).toBe(1);
    const g610 = groups.find(g => g.min_age === 6);
    expect(g610!.count).toBe(0);
  });

  test('age=6は6-10バケット', () => {
    const results = [makeResult(6)];
    const groups = groupByAge(results);
    const g05 = groups.find(g => g.min_age === 0);
    expect(g05!.count).toBe(0);
    const g610 = groups.find(g => g.min_age === 6);
    expect(g610!.count).toBe(1);
  });
});

// ─── summarizeByFloorPlan ────────────────────────

describe('summarizeByFloorPlan', () => {
  function makeResult(floor_plan: string, sqm_price: number): MansionResult {
    return {
      sqm_price,
      trade_price: sqm_price * 70,
      area_m2: 70,
      floor_plan,
      build_year: 2008,
      age: 18,
      use_district: '第一種住居地域',
      period: '令和6年第1四半期',
      structure: 'ＲＣ',
      raw: makeMansionItem({ FloorPlan: floor_plan }),
    };
  }

  test('間取りでグループ化される', () => {
    const results = [
      makeResult('1K', 500000),
      makeResult('2LDK', 700000),
      makeResult('3LDK', 900000),
      makeResult('2LDK', 800000),
    ];
    const byPlan = summarizeByFloorPlan(results);
    expect(Object.keys(byPlan)).toContain('1K');
    expect(Object.keys(byPlan)).toContain('2LDK');
    expect(Object.keys(byPlan)).toContain('3LDK');
    expect(byPlan['2LDK'].count).toBe(2);
    expect(byPlan['1K'].count).toBe(1);
  });

  test('floor_plan === "" は "不明" として扱う', () => {
    const results = [
      makeResult('', 700000),
      makeResult('', 800000),
      makeResult('2LDK', 600000),
    ];
    const byPlan = summarizeByFloorPlan(results);
    expect(byPlan['不明']).toBeDefined();
    expect(byPlan['不明'].count).toBe(2);
    expect(byPlan['']).toBeUndefined();
  });

  test('各グループの統計が正しく計算される', () => {
    const results = [
      makeResult('3LDK', 600000),
      makeResult('3LDK', 800000),
      makeResult('3LDK', 1000000),
    ];
    const byPlan = summarizeByFloorPlan(results);
    const g = byPlan['3LDK'];
    expect(g.count).toBe(3);
    expect(g.sqm_min).toBe(600000);
    expect(g.sqm_max).toBe(1000000);
    expect(g.sqm_median).toBe(800000);
  });

  test('空配列 → 空オブジェクト', () => {
    const byPlan = summarizeByFloorPlan([]);
    expect(Object.keys(byPlan)).toHaveLength(0);
  });
});

// ─── compareMansionPrice ─────────────────────────

describe('compareMansionPrice', () => {
  // currentYear を 2026 に固定（build_year からの築年数計算が環境依存にならないよう）
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  function makeAgeGroup(label: string, min_age: number, max_age: number, sqm_median: number | null, count = 3): AgeGroup {
    return {
      label,
      min_age,
      max_age,
      count,
      sqm_min: sqm_median ? sqm_median * 0.8 : null,
      sqm_max: sqm_median ? sqm_median * 1.2 : null,
      sqm_median,
    };
  }

  const OVERALL_STATS: MansionStats = {
    count: 100,
    sqm_min: 400000,
    sqm_max: 1200000,
    sqm_median: 700000,
  };

  const AGE_GROUPS: AgeGroup[] = [
    makeAgeGroup('〜5年', 0, 5, 900000),
    makeAgeGroup('6〜10年', 6, 10, 800000),
    makeAgeGroup('11〜15年', 11, 15, 700000),
    makeAgeGroup('16〜20年', 16, 20, 600000),
    makeAgeGroup('21〜25年', 21, 25, 550000),
    makeAgeGroup('26〜30年', 26, 30, 500000),
    makeAgeGroup('31年以上', 31, 999, 400000),
  ];

  test('user_sqm_price = asking_price * 10000 / area_m2', () => {
    // 5000万円（asking_price=5000） / 70㎡ = 714285.71
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 5000 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    expect(result.user_sqm_price).toBeCloseTo(5000 * 10000 / 70, 0);
  });

  test('該当築年数グループの中央値と比較する', () => {
    // 2026-2008=18年 → 16〜20年グループ(sqm_median=600000)
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 5000 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    // age_group_median は 600000（16〜20年グループ）
    expect(result.age_group_median).toBe(600000);
  });

  test('diff_ratio > 0.2 → "high"', () => {
    // user_sqm_price = 4000 * 10000 / 70 ≈ 571428
    // market_median = 400000 (31年以上グループ: 2026-1980=46年)
    // diff_ratio = (571428 - 400000) / 400000 ≈ 0.428 > 0.2 → high
    const userInput: UserInput = { area_m2: 70, build_year: 1980, asking_price: 4000 };
    const groups = [...AGE_GROUPS];
    const result = compareMansionPrice(userInput, OVERALL_STATS, groups);
    expect(result.verdict).toBe('high');
  });

  test('diff_ratio ≈ 0.15 → "slightly_high"', () => {
    // market_median = 600000 (16〜20年グループ)
    // target user_sqm_price ≈ 690000 → diff_ratio ≈ 0.15 (> 0.1 but <= 0.2)
    // 690000 * 70 / 10000 = 4830万円
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 4830 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    expect(result.verdict).toBe('slightly_high');
  });

  test('diff_ratio ≈ 0 → "fair"', () => {
    // market_median = 600000 (16〜20年グループ)
    // user_sqm_price ≈ 600000 → diff_ratio ≈ 0 → fair
    // 600000 * 70 / 10000 = 4200万円
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 4200 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    expect(result.verdict).toBe('fair');
  });

  test('diff_ratio ≈ -0.15 → "slightly_low"', () => {
    // market_median = 600000 (16〜20年グループ)
    // target user_sqm_price ≈ 510000 → diff_ratio ≈ -0.15 (>= -0.2 but < -0.1)
    // 510000 * 70 / 10000 = 3570万円
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 3570 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    expect(result.verdict).toBe('slightly_low');
  });

  test('diff_ratio < -0.2 → "low"', () => {
    // market_median = 600000 (16〜20年グループ)
    // user_sqm_price ≈ 400000 → diff_ratio ≈ -0.33 < -0.2 → low
    // 400000 * 70 / 10000 = 2800万円
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 2800 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    expect(result.verdict).toBe('low');
  });

  test('該当グループがない場合は全体中央値で比較', () => {
    const userInput: UserInput = { area_m2: 70, build_year: 2010, asking_price: 4900 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, []);
    // グループなし → 全体中央値 700000 を使用
    expect(result.market_median).toBe(700000);
    expect(result.sample_count).toBe(OVERALL_STATS.count);
  });

  test('中央値がない(null)場合 → "unknown"', () => {
    const statsNoMedian: MansionStats = {
      count: 0,
      sqm_min: null,
      sqm_max: null,
      sqm_median: null,
    };
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 5000 };
    const result = compareMansionPrice(userInput, statsNoMedian, []);
    expect(result.verdict).toBe('unknown');
    expect(result.market_median).toBeNull();
    expect(result.diff_ratio).toBeNull();
  });

  test('sample_count はage_group.countまたは全体count', () => {
    // 16〜20年グループのcount=3
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 4200 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    expect(result.sample_count).toBe(3);
  });

  test('age_group_label がグループのlabelに一致する', () => {
    // build_year=2008 → age=18 → "16〜20年"グループ
    const userInput: UserInput = { area_m2: 70, build_year: 2008, asking_price: 4200 };
    const result = compareMansionPrice(userInput, OVERALL_STATS, AGE_GROUPS);
    expect(result.age_group_label).toBe('16〜20年');
  });
});
