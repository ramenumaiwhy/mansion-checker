# 中古マンション相場診断

購入を検討している中古マンションの売出価格を、同じ地区の取引実績と比較するWeb版のMVPです。国土交通省「不動産情報ライブラリ」の「中古マンション等」から、専有面積1㎡当たりの取引価格を築年帯別・間取り別に集計します。

## 使い方

1. [国土交通省でAPIキーを申請](https://www.reinfolib.mlit.go.jp/api/request/)し、取得したキーを診断画面で入力・検証します。
2. 住所か駅を選びます。住所検索は同じ地区、駅検索は駅がある市区町村が対象です。今年と過去2年分について、件数と㎡単価の中央値を確認します。
3. 物件の専有面積・建築年・売出価格を入力すると、売出㎡単価が同じ築年帯の中央値から何%離れているかを確認できます。該当する築年帯に事例がなければ、対象エリア全体の中央値を使います。

間取り別の集計はエリア相場の表で確認できます。売出価格の比較には築年帯を使います。比較対象は地区の取引事例です。建物名、住戸の階や向き、管理状態、修繕履歴による価格差は個別に確認してください。

## ローカルで開く

以下はNode.js 26で確認した手順です。リポジトリのルートで実行します。

```bash
npm ci --prefix workers
npm run dev --prefix workers -- --local
```

[診断画面](http://127.0.0.1:8788/app.html)を開きます。住所と座標は国土地理院へ、APIキーは検証・検索時に画面と同じ配信元のCloudflare Workerを経由して国交省APIへ送られます。ブラウザに保存したキーは画面から削除できます。

## 開発

```bash
npm ci
npm run typecheck
npm test
npm run build
```

ソースは `src/app.ts`、配信用ファイルは `docs/app.js` です。

## 同じ取引データを使う作品

フォーク元の [reinfolib-service](https://github.com/ramenumaiwhy/reinfolib-service) は土地の坪単価・一種単価・建物残価をColabとWebで分析します。[reinfolib-skill](https://github.com/ramenumaiwhy/reinfolib-skill) は土地の相場をClaude Codeで調べるためのスキルです。

## ライセンスと駅データ

コードはMIT。駅検索用の `docs/stations.json` は、国土交通省「国土数値情報（鉄道データ）令和6年度」を駅グループ単位にまとめ、市区町村コードを付与し、路線名と表示順を整えた加工データです。駅データの再利用にはCC BY 4.0を適用します。[原典（N02-24）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2024.html)・[利用条件（CC BY 4.0）](https://creativecommons.org/licenses/by/4.0/deed.ja)
