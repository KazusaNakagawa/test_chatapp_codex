## 構成案

| 層 | 技術／言語 | 利点・用途 | 補足・出典 |
|---|------------|-------------|-------------|
| 表示言語 | HTML + CSS + JavaScript／TypeScript | ブラウザで動く標準技術 | 多くのウェブアプリで共通 |
| フレームワーク／ライブラリ | React, Next.js など | コンポーネントベース、SSG/SSR の併用、動的 UI 管理に向く | 非公式の技術ブログでは “ChatGPT フロントエンドは React／Next.js を使っている” とする記事もあります。 ([medium.com](https://medium.com/%40david.richards.tech/building-the-iconic-chatgpt-frontend-e65ec049fa54)) |
| スタイリング／UI コンポーネント | CSS モジュール、Tailwind CSS、CSS-in-JS（styled-components, Emotion 等） | スタイリングの管理性を高める | Tailwind CSS 利用の可能性も指摘あり ([reddit.com](https://www.reddit.com/r/ChatGPT/comments/12lwsii/which_programming_language_is_the_gpt_chat_app/)) |
| 状態管理・通信 | React の内部 state, Redux／Recoil／MobX 等、WebSocket や HTTP API 通信 | メッセージのやり取り、UI 更新などを制御 | 多くのチャット UI はリアルタイム性を必要とするため WebSocket や SSE を併用する |
| サーバーサイドレンダリング（SSR）／ハイブリッドレンダリング | Next.js 等 | 初期表示高速化、SEO 最適化、キャッシュ活用 | React／Next.js ベース構成と整合性あり ([medium.com](https://medium.com/%40david.richards.tech/building-the-iconic-chatgpt-frontend-e65ec049fa54)) |


## アーキテクト

- typescript, React, Next.js