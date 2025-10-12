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

export const RESPONSE_PATTERNS: Array<{
  pattern: RegExp;
  reply: (message: string) => string;
}> = [
  {
    pattern: /スタック|構成|レイヤー|アーキテクチャ|architect/i,
    reply: () =>
      [
        "このデモは次のレイヤー構成を意識して作られています:",
        "- 表示言語: HTML + CSS + TypeScript",
        "- フレームワーク: React と Next.js",
        "- スタイリング: グローバルCSSをベースに Tailwind などへ拡張しやすい構成",
        "- 状態管理: React hooks とローカルストレージを併用",
        "- SSR: Next.js を利用することでハイブリッドレンダリングに対応可能",
        "",
        "詳しい説明は docs/readme.md を確認してください。",
      ].join("\n"),
  },
  {
    pattern: /typescript|ts/i,
    reply: () =>
      "TypeScript は JavaScript に型付けを導入することで、補完やリファクタリングの信頼性を高めます。Next.js のようなフレームワークでも公式にサポートされており、コンポーネント間の契約を明確にできます。",
  },
  {
    pattern: /next\.?js|nextjs|ssr|ssg/i,
    reply: () =>
      "Next.js は SSR や SSG をシームレスに扱えるため、チャットの初期描画を高速化できます。このデモでも Next.js の App Router を用いた構成を想定しています。",
  },
  {
    pattern: /レビュー|モダン|設計/i,
    reply: () =>
      "モダンなチャットUIでは、UI層・状態層・通信層を明確に切り分けることでスケールしやすい設計になります。React コンポーネントを UI に、カスタムフックで状態を扱うのがシンプルで再利用性も高いアプローチです。",
  },
];
