# 経費申請システム - React + Node.js + Firebase

既存のJavaプロジェクトをReact + Node.js + Firebaseで再構築したプロジェクトです。

## プロジェクト構成

```
my-app/
├── frontend/          # Reactフロントエンド
│   ├── src/
│   │   ├── App.js           # メインコンポーネント
│   │   ├── App.css          # スタイル
│   │   ├── firebase.js      # Firebase初期化設定
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
├── api/               # Vercel Serverless Functions
│   ├── hello.js             # テスト用API
│   ├── expenses.js          # 経費データAPI
│   ├── master.js            # マスタデータAPI
│   └── package.json
├── vercel.json        # Vercel設定
└── .gitignore
```

## 機能

### フロントエンド (React)
- 経費申請フォーム入力
- 経費データの一覧表示
- Firebase Firestoreとの直接連携
- データの追加・削除機能

### バックエンド (Node.js Serverless)
- `/api/hello` - テスト用エンドポイント
- `/api/expenses` - 経費データのCRUD操作
- `/api/master` - マスタデータ取得

## セットアップ

### 1. 依存パッケージのインストール

```bash
# フロントエンド
cd my-app/frontend
npm install

# API
cd ../api
npm install
```

### 2. Firebase設定

Firebase Console で以下の設定を確認:
- Firestoreを有効化
- 必要なコレクションを作成: `expenses`, `departments`, `vendors`, `accounts`, `segments`, `taxCategories`

### 3. ローカル開発

```bash
# フロントエンドの起動
cd my-app/frontend
npm start
```

## Vercelへのデプロイ

### 1. Vercel CLIのインストール

```bash
npm install -g vercel
```

### 2. デプロイ

```bash
cd my-app
vercel
```

### 3. Firebase認証情報の設定

Vercelの環境変数に以下を設定:
- `GOOGLE_APPLICATION_CREDENTIALS`: Firebaseサービスアカウントキー

## 使用技術

- **フロントエンド**: React 18.2.0
- **バックエンド**: Node.js (Vercel Serverless Functions)
- **データベース**: Firebase Firestore
- **ホスティング**: Vercel
- **認証/接続**: Firebase SDK

## データ構造

### Firestore Collections

#### expenses
```javascript
{
  affiliationCode: String,      // 所属コード
  burdenDeptCode: String,       // 負担部門コード
  vendorCode: String,           // 支払先コード
  accountCode: String,          // 勘定科目コード
  segmentCode: String,          // セグメントコード
  paymentAmount: Number,        // 支払金額
  taxTypeCode: String,          // 税区分コード
  absorptionFlag: String,       // 配賦フラグ
  remarks: String,              // 備考
  status: String,               // ステータス
  createdAt: Timestamp          // 作成日時
}
```

## 注意事項

- Firebase Firestoreのセキュリティルールを適切に設定してください
- 本番環境では環境変数を使用してAPIキーを管理してください
- Vercelの無料プランでは制限があるため、使用量に注意してください
