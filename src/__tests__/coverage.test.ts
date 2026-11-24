/// <reference types="vite/client" />
import page from '../../docs/app.html?raw';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-06-01'));
  const template = document.createElement('template');
  template.innerHTML = page;
  template.content.querySelectorAll('link, script').forEach(el => el.remove());
  document.body.replaceChildren(template.content);
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: storage.get.bind(storage), setItem: storage.set.bind(storage) });
  const sale = {
    Municipality: '渋谷区', Prefecture: '東京都', DistrictName: '恵比寿',
    Area: '100', TradePrice: '100000000', Type: '中古マンション等',
  };
  const fetchMock = vi.fn(async (url: string, options?: RequestInit) => {
    if (url.includes('AddressSearch')) {
      const lon = decodeURIComponent(url).includes('広尾') ? 139.72 : 139.71;
      return Response.json([{ geometry: { coordinates: [lon, 35.65] } }]);
    }
    if (url.includes('LonLatToAddress')) {
      const district = url.includes('lon=139.72') ? '広尾一丁目' : '恵比寿一丁目';
      return Response.json({ results: { muniCd: '13113', lv01Nm: district } });
    }
    expect(url).toMatch(/^\/api\/XIT00[12]\?/);
    expect(options?.redirect).toBe('error');
    if (url.includes('XIT002')) return Response.json({ data: [{ id: '13113', name: '渋谷区' }] });
    if (url.includes('year=2026')) return new Response(null, { status: 404 });
    if (url.includes('year=2025')) return Response.json({ data: [] });
    return Response.json({ data: [sale, { ...sale, DistrictName: '広尾', TradePrice: '200000000' }] });
  });
  vi.stubGlobal('fetch', fetchMock);
  await import('../app');
  document.querySelector<HTMLInputElement>('#apiKeyInput')!.value = 'fixture';
  document.querySelector<HTMLButtonElement>('#saveKeyBtn')!.click();
  await vi.runAllTimersAsync();
  expect(storage.get('reinfolib_api_key')).toBe('fixture');
});

function search(address: string) {
  document.querySelector<HTMLInputElement>('#addressInput')!.value = address;
  document.querySelector<HTMLButtonElement>('#analyzeBtn')!.click();
}

test('検索年度を404、空の応答、地区の集計に採用した件数に分ける', async () => {
  search('渋谷区恵比寿');
  await vi.runAllTimersAsync();
  const summary = document.querySelector('#resultSummary')!.textContent;
  expect(summary).toContain('2026年 未取得（404）');
  expect(summary).toContain('2025年 市区町村の取引0件');
  expect(summary).toContain('2024年 中古マンション1件');
});

test('次の地区の検索開始時に前回の比較を消し、新しい中央値で再比較する', async () => {
  search('渋谷区恵比寿');
  await vi.runAllTimersAsync();
  document.querySelector<HTMLInputElement>('#compareAreaInput')!.value = '100';
  document.querySelector<HTMLInputElement>('#compareBuildYearInput')!.value = '2005';
  document.querySelector<HTMLInputElement>('#comparePriceInput')!.value = '10000';
  const button = document.querySelector<HTMLButtonElement>('#compareBtn')!;
  const result = document.querySelector('#compareResult')!;
  button.click();
  expect(result.textContent).toContain('+0.0%');

  search('渋谷区広尾');
  expect(result.textContent).toBe('');
  await vi.runAllTimersAsync();
  expect(document.querySelector('#resultSummary')!.textContent).toContain('広尾');
  expect(result.textContent).toBe('');
  button.click();
  expect(result.textContent).toContain('-50.0%');
});
