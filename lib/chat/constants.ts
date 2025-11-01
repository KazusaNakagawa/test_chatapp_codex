import type { StackRow } from "./types";

export const STORAGE_KEY = "architect-chat:conversations";
export const THEME_KEY = "architect-chat:theme";
export const DEFAULT_TITLE = "新しいチャット";

export const INITIAL_ASSISTANT_MESSAGE =
  "こんにちは 👋\nTypeScript + React + Next.js で組み上げた ChatGPT 風UIのデモです。気になることがあれば聞いてみてください！";

export const STACK_ROWS: StackRow[] = [
  {
    layer: "表示言語",
    technologies: "HTML + CSS + TypeScript",
    benefit: "ブラウザ標準技術で柔軟に構築できる",
    note: "多くのウェブアプリで共通して採用されています。",
  },
  {
    layer: "フレームワーク／ライブラリ",
    technologies: "React, Next.js",
    benefit: "コンポーネントベースで SSR / SSG と組み合わせた柔軟な UI 制御に適する",
    note: "有志の分析では ChatGPT 本体も React / Next.js を利用していると報告されています。",
    source: {
      label: "medium.com",
      url: "https://medium.com/%40david.richards.tech/building-the-iconic-chatgpt-frontend-e65ec049fa54",
    },
  },
  {
    layer: "スタイリング／UI コンポーネント",
    technologies: "CSS Modules, Tailwind CSS, CSS-in-JS",
    benefit: "大規模でも保守しやすいスタイリング戦略を選択できる",
    note: "コミュニティでは Tailwind CSS の採用可能性が指摘されています。",
    source: {
      label: "reddit.com",
      url: "https://www.reddit.com/r/ChatGPT/comments/12lwsii/which_programming_language_is_the_gpt_chat_app/",
    },
  },
  {
    layer: "状態管理・通信",
    technologies: "React state, Redux / Recoil, WebSocket / SSE",
    benefit: "チャットのリアルタイム更新や API 通信を管理",
    note: "リアルタイム性確保のため WebSocket や SSE の併用が一般的です。",
  },
  {
    layer: "SSR／ハイブリッドレンダリング",
    technologies: "Next.js",
    benefit: "初期描画の最適化と SEO 強化、キャッシュ戦略へ柔軟に対応",
    note: "React / Next.js を核とした構成と相性が良いとされています。",
    source: {
      label: "medium.com",
      url: "https://medium.com/%40david.richards.tech/building-the-iconic-chatgpt-frontend-e65ec049fa54",
    },
  },
];

export const SUGGESTIONS = [
  "TypeScript と JavaScript の違いを教えて",
  "Next.js で SSR を活かすメリットは？",
  "ChatGPT 風UIを実装する上でのポイントは？",
] as const;
