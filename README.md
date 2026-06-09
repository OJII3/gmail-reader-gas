# Gmail Reader GAS

Google Apps Scriptを使用して、最後の実行以降に受信したGmailを読み取るツールです。

## 機能

- 前回の実行以降に受信した未読メールを検索
- メールの件名・送信者・日時・本文（抜粋）をログ出力
- 前回実行時刻をPropertiesServiceで管理

## セットアップ

### 1. 依存パッケージのインストール

```bash
bun install
```

### 2. Googleアカウントへのログイン

```bash
bun run login
```

ブラウザが開くので、Googleアカウントでログインしてアクセスを許可します。

### 3. Apps Scriptプロジェクトの作成

```bash
bun run create
```

これにより、Google Apps Scriptプロジェクトが作成され、`.clasp.json`に`scriptId`が設定されます。

### 4. デプロイ

```bash
bun run deploy
```

### 5. Apps Scriptエディタでの設定

1. [Apps Script ダッシュボード](https://script.google.com/)を開く
2. 作成したプロジェクトを選択
3. トリガーを設定：
   - 「トリガー」タブを開く
   - 「トリガーを追加」をクリック
   - 実行する関数: `readNewEmails`
   - イベントソース: `時間主導型`
   - 実行間隔: 任意（例: 1時間ごと）

## 使用方法

### 手動実行

Apps Scriptエディタで`readNewEmails`関数を選択して実行します。

### 実行ログ

実行すると、以下のような形式でログが出力されます：

```
=== New Emails ===
[1] Subject: メール件名
    From: sender@example.com
    Date: Mon, 09 Jun 2026 12:00:00 +0000
    Body: メール本文の抜粋...

Last execution time updated: 2026-06-09T12:00:00Z
```

## 開発

### ビルド

```bash
bun run build
```

`dist/main.js`にバンドルされたファイルが出力されます。

### デプロイ

```bash
bun run deploy
```

ビルド後、自動的にApps Scriptプロジェクトにプッシュされます。

## ライセンス

MIT
