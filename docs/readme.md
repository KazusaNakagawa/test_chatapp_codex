## 構成案

| 層 | 技術／言語 | 利点・用途 | 補足・出典 |
|---|------------|-------------|-------------|
| 表示言語 | HTML + CSS + JavaScript／TypeScript | ブラウザで動く標準技術 | 多くのウェブアプリで共通 |
| フレームワーク／ライブラリ | React, Next.js など | コンポーネントベース、SSG/SSR の併用、動的 UI 管理に向く | 非公式の技術ブログでは “ChatGPT フロントエンドは React／Next.js を使っている” とする記事もあります。 ([medium.com](https://medium.com/%40david.richards.tech/building-the-iconic-chatgpt-frontend-e65ec049fa54)) |
| スタイリング／UI コンポーネント | CSS モジュール、Tailwind CSS、CSS-in-JS（styled-components, Emotion 等） | スタイリングの管理性を高める | Tailwind CSS 利用の可能性も指摘あり ([reddit.com](https://www.reddit.com/r/ChatGPT/comments/12lwsii/which_programming_language_is_the_gpt_chat_app/)) |
| 状態管理・通信 | React の内部 state, Redux／Recoil／MobX 等、WebSocket や HTTP API 通信 | メッセージのやり取り、UI 更新などを制御 | 多くのチャット UI はリアルタイム性を必要とするため WebSocket や SSE を併用する |
| サーバーサイドレンダリング（SSR）／ハイブリッドレンダリング | Next.js 等 | 初期表示高速化、SEO 最適化、キャッシュ活用 | React／Next.js ベース構成と整合性あり ([medium.com](https://medium.com/%40david.richards.tech/building-the-iconic-chatgpt-frontend-e65ec049fa54)) |


| 分類 | フレームワーク／ライブラリ名 | 特徴・用途 | 備考・利用例 |
|------|----------------------------|-------------|----------------|
| 🌈 ユーティリティ系CSS | **Tailwind CSS** | クラス名ベースで高速にレイアウト・色・余白を指定。Reactと相性が良い | ChatGPT風UIで最も採用されやすい。`className`に直接記述できる。 |
| 💎 UIコンポーネント | **Chakra UI** | Tailwindよりも高レベル。ボタンや入力欄などがテーマ統一済み。 | OpenAI系の開発者がPoC段階でよく利用。TypeScript対応◎ |
| 💅 CSS-in-JS 系 | **styled-components** | 各Reactコンポーネント内にスタイルを埋め込み可能。スコープが自動分離。 | デザインシステム構築に強い。Next.jsとも相性良い。 |
| 💄 CSS-in-JS 系 | **Emotion** | パフォーマンス重視の軽量CSS-in-JS。styled APIとcss prop両対応。 | MUI (Material UI) の内部実装にも採用。 |
| 🧱 UIフレームワーク | **Material UI (MUI)** | GoogleのMaterial Design実装。豊富なコンポーネント。 | エンタープライズ用途に強い。React公式互換。 |
| 🪶 軽量UI | **Radix UI** | アクセシビリティ対応済みの低レベルUIコンポーネント群。 | TailwindやChakraと組み合わせて利用されることが多い。 |
| 🧩 コンポーネント構築支援 | **Framer Motion** | アニメーション・トランジション演出用ライブラリ。 | ChatGPT UIのスムーズなメッセージアニメーションなどに有効。 |
| 🪄 デザインシステム構築 | **Stitches** | 高速CSS-in-JS。小規模アプリに向く。 | Vercel（Next.js運営元）が開発。SSR互換。 |

## アーキテクト

- typescript, React, Next.js

## ローカル実行手順

1. 依存ライブラリをインストールします。
   ```bash
   npm install
   ```
2. 開発サーバーを起動します。
   ```bash
   npm run dev
   ```
   既定では http://localhost:3000 で起動します。ポート 3000 が利用できない場合は `PORT=任意のポート npm run dev` のように起動ポートを変更してください。
3. プロダクションビルドを確認したい場合は次のコマンドを実行します。
   ```bash
   npm run build
   npm run start
   ```
   `npm run start` はビルド済みアプリを同じポートで起動します。
