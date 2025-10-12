# ChatGPT風アーキテクトUI

TypeScript / React / Next.js を用いて ChatGPT 風のチャット画面を再現したデモアプリです。`docs/readme.md` に整理されたレイヤー構成（表示言語・フレームワーク・スタイリング・状態管理・SSR）を意識し、UI / 状態 / 定義を分離して実装しています。

## プロジェクト構成

- `app/` – Next.js App Router を利用したページ構成（`app/page.tsx`）と全体スタイル（`app/globals.css`）
- `components/chat/ChatApp.tsx` – クライアントコンポーネント。本体UI・テーマ切替・スタックパネルを管理
- `lib/chat/` – 常数 (`constants.ts`)、型 (`types.ts`)、状態管理ロジック (`state.ts`)、カスタムフック (`useChat.ts`) を分離
- `docs/readme.md` – 参考としたアーキテクト層の説明

## セットアップ

```bash
npm install
```

## ローカル開発

```bash
npm run dev
# → http://localhost:3000 でチャット画面を確認
```

## 本番ビルド・プレビュー

```bash
npm run build
npm start          # 生成されたビルドをローカルで確認
```

## 補足

- 初回アクセス時にローカルストレージへ会話履歴とテーマ設定を保存します。
- スタック情報パネルは `docs/readme.md` の内容を UI 上で閲覧できるようにしたものです。
