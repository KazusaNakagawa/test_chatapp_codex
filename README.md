# ChatGPT風アーキテクトUI

※ Codex で試してみた

TypeScript / React / Next.js を用いて ChatGPT 風のチャット画面を再現したデモアプリです。`docs/readme.md` に整理されたレイヤー構成（表示言語・フレームワーク・スタイリング・状態管理・SSR）を意識し、UI / 状態 / 定義を分離して実装しています。UI は Chakra UI + Emotion によるテーマ制御へ移行済みで、ライト／ダークモード切替に対応しています。

## 主な機能

- 会話履歴・テーマ設定をローカルストレージへ保存するシンプルなチャット体験
- Chakra UI コンポーネントによる ChatGPT 風の 2 カラムレイアウトとスタック情報カード
- テーマトグル（🌙 / ☀️）とスムーズなタイピングインジケーター
- プリセットされた質問候補ボタン、エンター送信・Shift+Enter 改行に対応したメッセージ入力

## プロジェクト構成

- `app/` – Next.js App Router のベース構成。`app/providers.tsx` で ChakraProvider を注入し、グローバルテーマを定義
- `components/chat/ChatApp.tsx` – クライアントコンポーネント。本体UI、テーマ切替、スタックパネル、メッセージ描画を管理
- `lib/chat/` – 常数 (`constants.ts`)、型 (`types.ts`)、状態管理ロジック (`state.ts`)、カスタムフック (`useChat.ts`) を分離
- `docs/readme.md` – 参考としたアーキテクト層の説明、ローカル実行手順

## セットアップ

```bash
npm install
```

## ローカル開発

```bash
npm run dev
# → http://localhost:3000 でチャット画面を確認
```

ポートを変更したい場合は `PORT=8080 npm run dev` のように環境変数を指定します。

## 本番ビルド・プレビュー

```bash
npm run build
npm run start       # 生成されたビルドをローカルで確認
```

## Lint / フォーマット

```bash
npm run lint
```

## 補足

- 初回アクセス時にローカルストレージへ会話履歴とテーマ設定を保存します。
- スタック情報パネルは `docs/readme.md` の内容を UI 上で閲覧できるようにしたものです。
- Chakra テーマは `app/providers.tsx` で `extendTheme` を用いて定義し、ライト／ダーク両モードに合わせて背景／文字色を切り替えています。
