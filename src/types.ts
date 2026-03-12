/** APIから返される不動産取引データの1レコード */
export interface TransactionItem {
  Type?: string;
  TradePrice?: string;
  Area?: string;
  TotalFloorArea?: string;
  FloorAreaRatio?: string;
  CoverageRatio?: string;
  BuildingYear?: string;
  Structure?: string;
  Prefecture?: string;
  Municipality?: string;
  DistrictName?: string;
  UseDistrict?: string;
  CityPlanning?: string;
  Period?: string;
  Region?: string;
  MunicipalityCode?: string;
  UnitPrice?: string;
  FloorPlan?: string;
  LandShape?: string;
  Frontage?: string;
  Direction?: string;
  Classification?: string;
  Breadth?: string;
  Use?: string;
  Purpose?: string;
  Renovation?: string;
  Remarks?: string;
  [key: string]: string | undefined;
}

/** マンション取引データの分析結果 */
export interface MansionResult {
  sqm_price: number;        // ㎡単価（円）
  trade_price: number;
  area_m2: number;
  floor_plan: string;       // 間取り（1K, 2LDK等）
  build_year: number | null;
  age: number | null;        // 築年数
  use_district: string;
  period: string;
  structure: string;
  raw: TransactionItem;
}

/** 築年数グループの統計 */
export interface AgeGroup {
  label: string;             // "〜5年", "6〜10年" 等
  min_age: number;
  max_age: number;
  count: number;
  sqm_min: number | null;
  sqm_max: number | null;
  sqm_median: number | null;
}

/** マンション統計サマリー */
export interface MansionStats {
  count: number;
  sqm_min: number | null;
  sqm_max: number | null;
  sqm_median: number | null;
}

/** ユーザーが入力する物件条件 */
export interface UserInput {
  area_m2: number;
  build_year: number;
  floor_plan: string;
  asking_price: number;      // 万円単位
}

/** 相場比較結果 */
export interface CompareResult {
  user_sqm_price: number;
  market_median: number | null;
  diff_ratio: number | null;  // (user - market) / market
  verdict: 'high' | 'slightly_high' | 'fair' | 'slightly_low' | 'low' | 'unknown';
  age_group_median: number | null;
  age_group_label: string;
  sample_count: number;
}

/** 駅データ（stations.json の1レコード） */
export interface StationData {
  name: string;
  pref: string;
  muni: string;
  lines?: string;
}
