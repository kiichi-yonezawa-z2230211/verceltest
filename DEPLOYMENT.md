# デプロイ手順

## 前提条件
- Node.js (v18以上) がインストールされていること
- Firebase プロジェクトが作成済みであること
- Vercel アカウントを持っていること

## 1. ローカル開発環境のセットアップ

### パッケージのインストール
```bash
cd my-app

# 全パッケージを一括インストール
npm run install:all

# または個別にインストール
npm run install:frontend
npm run install:api
```

### ローカルでの起動
```bash
# フロントエンドの起動 (http://localhost:3000)
npm run start:frontend
```

## 2. Firebase設定

### Firestoreの有効化
1. Firebase Console (https://console.firebase.google.com/) にアクセス
2. プロジェクト `test1-384bd` を選択
3. 左メニューから「Firestore Database」を選択
4. 「データベースの作成」をクリック
5. 本番モードまたはテストモードで開始

### セキュリティルールの設定
```bash
# Firebase CLIのインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init firestore

# セキュリティルールをデプロイ
firebase deploy --only firestore:rules
```

### サンプルデータの投入（任意）
Firebase Consoleから手動でコレクションとドキュメントを作成:

- `expenses` コレクション
- `departments` コレクション
- `vendors` コレクション
- `accounts` コレクション
- `segments` コレクション
- `taxCategories` コレクション

## 3. Vercelへのデプロイ

### Vercel CLIでデプロイ
```bash
# Vercel CLIのインストール
npm install -g vercel

# プロジェクトディレクトリに移動
cd my-app

# デプロイ（初回）
vercel

# 本番環境へデプロイ
vercel --prod
```

### Vercelダッシュボードでの設定

1. https://vercel.com/ にログイン
2. プロジェクトを選択
3. Settings → General で以下を確認:
   - Root Directory: `my-app` (またはそのまま)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`

4. Settings → Environment Variables で以下を追加:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=@google-application-credentials
   ```
   ※ Firebase Admin SDKのサービスアカウントキー（JSON）をシークレットとして登録

### Firebase サービスアカウントキーの取得

1. Firebase Console → プロジェクト設定 → サービスアカウント
2. 「新しい秘密鍵の生成」をクリック
3. ダウンロードしたJSONファイルの内容をVercelの環境変数に設定

## 4. GitHub Actionsでの自動デプロイ（任意）

### GitHub Secretsの設定
1. GitHubリポジトリ → Settings → Secrets and variables → Actions
2. 以下のシークレットを追加:
   - `VERCEL_TOKEN`: Vercel Personal Access Token
   - `VERCEL_ORG_ID`: Vercel Organization ID
   - `VERCEL_PROJECT_ID`: Vercel Project ID

### Vercel Tokenの取得
1. Vercel Dashboard → Settings → Tokens
2. 「Create Token」でトークンを作成

### ORG ID と PROJECT ID の取得
```bash
cd my-app
vercel link
# .vercel/project.json に保存される
```

## 5. 動作確認

### フロントエンド
- https://your-project.vercel.app/ にアクセス
- 経費申請フォームが表示されることを確認

### API
- https://your-project.vercel.app/api/hello にアクセス
- JSONレスポンスが返ることを確認

### データ保存
1. フォームに入力して「登録」をクリック
2. Firebase Console → Firestore Database で `expenses` コレクションにデータが追加されることを確認
3. フロントエンドの一覧に表示されることを確認

## トラブルシューティング

### ビルドエラー
- `npm run build:frontend` でローカルビルドを確認
- エラーログを確認して依存パッケージを修正

### API接続エラー
- Vercelのログを確認: `vercel logs`
- CORS設定を確認
- Firebase認証情報が正しく設定されているか確認

### Firestore接続エラー
- Firebase プロジェクトIDが正しいか確認
- Firestoreが有効化されているか確認
- セキュリティルールが適切か確認

## 本番環境への移行時の注意点

1. **環境変数の管理**
   - APIキーを環境変数で管理
   - `.env.local` ファイルを使用（Gitにはコミットしない）

2. **セキュリティルール**
   - Firestoreのセキュリティルールを本番用に変更
   - 認証機能の追加を検討

3. **エラーハンドリング**
   - エラー時の適切なメッセージ表示
   - ログ監視の設定

4. **パフォーマンス**
   - Firestoreのクエリ最適化
   - インデックスの作成
