# GitHub Actions 完全初心者向けハンズオンチュートリアルガイド

## 目次
1. [GitHub Actionsとは](#github-actionsとは)
2. [環境準備](#環境準備)
3. [基本概念の理解](#基本概念の理解)
4. [ハンズオン1: 最初のワークフロー作成](#ハンズオン1-最初のワークフロー作成)
5. [ハンズオン2: CI/CDワークフローの構築](#ハンズオン2-cicdワークフローの構築)
6. [ハンズオン3: 高度なワークフロー機能](#ハンズオン3-高度なワークフロー機能)
7. [ハンズオン4: セキュリティとシークレット管理](#ハンズオン4-セキュリティとシークレット管理)
8. [ハンズオン5: カスタムアクションの作成](#ハンズオン5-カスタムアクションの作成)
9. [トラブルシューティング](#トラブルシューティング)
10. [まとめと次のステップ](#まとめと次のステップ)

---

## GitHub Actionsとは

GitHub Actionsは、GitHubリポジトリ内でソフトウェア開発ワークフローを自動化するための強力なプラットフォームです。

### 主な特徴
- **CI/CD（継続的インテグレーション/継続的デプロイメント）**の実現
- **イベントドリブン**：プッシュ、プルリクエスト、イシューなどのイベントでワークフローをトリガー
- **豊富なアクション**：GitHub Marketplaceで数千のアクションが利用可能
- **複数環境対応**：Linux、Windows、macOSで実行可能
- **無料枠**：パブリックリポジトリは無料、プライベートリポジトリも月2,000分まで無料

### 基本用語
- **ワークフロー（Workflow）**: 自動化されたプロセス全体
- **ジョブ（Job）**: ワークフロー内の実行単位
- **ステップ（Step）**: ジョブ内の個別タスク
- **アクション（Action）**: 再利用可能なコンポーネント
- **ランナー（Runner）**: ワークフローを実行する仮想環境

---

## 環境準備

### 前提条件
- GitHubアカウント（izag8216）
- ローカル環境にGitがインストール済み

### Step 0: Gitのインストール確認（未インストールの場合）

**Gitがインストールされているか確認**:

```bash
# Gitのバージョン確認
git --version

# インストールされていない場合、以下のコマンドでインストール
# macOS の場合（Homebrewを使用）
brew install git

# または、Xcodeコマンドラインツールをインストール
xcode-select --install
```

**GitHubアカウントの作成**（未作成の場合）:
1. `https://github.com` にアクセス
2. 「Sign up」をクリック
3. ユーザー名を `izag8216` に設定（または任意の名前）
4. メールアドレスとパスワードを設定
5. アカウント認証を完了

### Step 1: GitHubリポジトリの作成

**作業場所**: GitHub Web UI

1. ブラウザで `https://github.com` にアクセス
2. 右上の「+」→「New repository」をクリック
3. リポジトリ設定:
   - Repository name: `actions`
   - Description: `GitHub Actions learning repository`
   - Public を選択（GitHub Actions学習のため）
   
   **重要**: 以下の2つの方法から選択してください
   
   **方法A: ファイル付きで作成**（初心者推奨）
   - ✅ 「Add a README file」にチェック
   - ✅ 「Add .gitignore」→「Node」を選択
   - ✅ License: 「MIT License」を選択
   
   **方法B: 空のリポジトリで作成**
   - ❌ 「Add a README file」のチェックを外す
   - ❌ 「Add .gitignore」は選択しない
   - ❌ License は選択しない

4. 「Create repository」をクリック

**注意**: 方法Aを選んだ場合は「Step 2の方法1」を、方法Bを選んだ場合は「Step 2の方法2」を実行してください。

### Step 2: ローカル環境の準備

**方法1: クローンする場合**（GitHubでREADME等を作成した場合）

**作業場所**: ローカル環境（ターミナル）

```bash
# 作業ディレクトリに移動
cd /Users/apple/Desktop

# 既存のactionsディレクトリがある場合は削除または名前変更
# (既存のファイルがある場合のバックアップ)
if [ -d "actions" ]; then
  echo "既存のactionsディレクトリが見つかりました。バックアップを作成します。"
  mv actions actions_backup_$(date +%Y%m%d_%H%M%S)
fi

# リポジトリをクローン
git clone https://github.com/izag8216/actions.git

# クローンしたディレクトリに移動
cd actions

# 現在のディレクトリを確認
pwd
# 出力: /Users/apple/Desktop/actions

# リポジトリの状態を確認
git status

# リモートリポジトリの確認
git remote -v
# 出力:
# origin  https://github.com/izag8216/actions.git (fetch)
# origin  https://github.com/izag8216/actions.git (push)

# 初期ファイルの確認
ls -la
# 出力: README.md, .gitignore, LICENSE などが表示される
```

**方法2: ローカルから始める場合**（空のリポジトリを作成した場合）

```bash
# 作業ディレクトリに移動
cd /Users/apple/Desktop

# 既存のactionsディレクトリがある場合の処理
if [ -d "actions" ]; then
  echo "既存のactionsディレクトリが見つかりました。バックアップを作成します。"
  mv actions actions_backup_$(date +%Y%m%d_%H%M%S)
fi

# 新しいディレクトリを作成
mkdir actions
cd actions

# 現在のディレクトリを確認
pwd
# 出力: /Users/apple/Desktop/actions

# Gitリポジトリを初期化
git init
# 出力: Initialized empty Git repository in /Users/apple/Desktop/actions/.git/

# 初期ファイルを作成
echo "# GitHub Actions Learning Repository" > README.md
echo "このリポジトリはGitHub Actionsの学習用です。" >> README.md

# .gitignoreファイルを作成
cat > .gitignore << 'EOF'
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# macOS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
EOF

# ファイルを確認
ls -la
# 出力: README.md, .gitignore が表示される

# ファイルをステージング
git add README.md .gitignore

# 初回コミット
git commit -m "Initial commit: Add README and .gitignore"

# リモートリポジトリを追加
git remote add origin https://github.com/izag8216/actions.git

# リモートリポジトリの確認
git remote -v
# 出力:
# origin  https://github.com/izag8216/actions.git (fetch)
# origin  https://github.com/izag8216/actions.git (push)

# mainブランチに変更（古いGitの場合はmasterブランチになることがある）
git branch -M main

# 初回プッシュ
git push -u origin main
# 出力: GitHub認証後、プッシュが完了

# リポジトリの状態を確認
git status
# 出力: On branch main, Your branch is up to date with 'origin/main', nothing to commit, working tree clean
```

### Step 3: Git設定の確認（初回のみ）

```bash
# Git設定の確認
git config --global user.name
git config --global user.email

# 未設定の場合は設定
git config --global user.name "izag8216"
git config --global user.email "your-email@example.com"

# 設定確認
git config --list | grep user
```

### 作業環境の確認

**ローカル作業ディレクトリ**: `/Users/apple/Desktop/actions`

```bash
# 現在のディレクトリを確認
pwd
# 出力: /Users/apple/Desktop/actions

# ブランチの確認
git branch
# 出力: * main (または master)

# リポジトリの状態を確認
git status
# 出力: On branch main, Your branch is up to date with 'origin/main', nothing to commit, working tree clean
```

### GitHubリポジトリURL
- リポジトリURL: `https://github.com/izag8216/actions`
- クローンURL: `https://github.com/izag8216/actions.git`

---

## 基本概念の理解

### ワークフローファイルの構造

GitHub Actionsのワークフローは、`.github/workflows/` ディレクトリ内のYAMLファイルで定義されます。

```yaml
name: ワークフロー名
on: [トリガーイベント]
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - name: ステップ名
        uses: アクション名
        with:
          パラメータ: 値
```

### 主要なトリガーイベント
- `push`: コードがプッシュされた時
- `pull_request`: プルリクエストが作成/更新された時
- `schedule`: スケジュール実行（cron形式）
- `workflow_dispatch`: 手動実行
- `release`: リリースが作成された時

---

## ハンズオン1: 最初のワークフロー作成

### Step 1: ワークフローディレクトリの作成

**作業場所**: ローカル環境 (`/Users/apple/Desktop/actions`)

```bash
# ワークフローディレクトリを作成
mkdir -p .github/workflows

# ディレクトリ構造を確認
ls -la .github/workflows/
```

### Step 2: Hello World ワークフローの作成

**ファイル**: `.github/workflows/hello-world.yml`

```yaml
name: Hello World Workflow

# ワークフローのトリガー設定
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch: # 手動実行を許可

jobs:
  hello-world:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Say Hello
      run: |
        echo "Hello, GitHub Actions!"
        echo "Repository: ${{ github.repository }}"
        echo "Actor: ${{ github.actor }}"
        echo "Event: ${{ github.event_name }}"
        date
    
    - name: Show environment info
      run: |
        echo "Operating System: $(uname -a)"
        echo "Current directory: $(pwd)"
        echo "Files in directory:"
        ls -la
```

**ローカルでファイルを作成**:

```bash
# hello-world.yml ファイルを作成
cat > .github/workflows/hello-world.yml << 'EOF'
name: Hello World Workflow

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  hello-world:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Say Hello
      run: |
        echo "Hello, GitHub Actions!"
        echo "Repository: ${{ github.repository }}"
        echo "Actor: ${{ github.actor }}"
        echo "Event: ${{ github.event_name }}"
        date
    
    - name: Show environment info
      run: |
        echo "Operating System: $(uname -a)"
        echo "Current directory: $(pwd)"
        echo "Files in directory:"
        ls -la
EOF
```

### Step 3: GitHubにプッシュ

**作業場所**: ローカル環境

```bash
# 変更をステージング
git add .github/workflows/hello-world.yml

# コミット
git commit -m "Add Hello World workflow"

# GitHubにプッシュ
git push origin main
```

### Step 4: ワークフローの実行確認

**作業場所**: GitHub Web UI

1. ブラウザで `https://github.com/izag8216/actions` にアクセス
2. 「Actions」タブをクリック
3. 「Hello World Workflow」が実行されていることを確認
4. ワークフローをクリックして詳細を確認
5. 各ステップのログを確認

### Step 5: 手動実行の確認

**作業場所**: GitHub Web UI

1. 「Actions」タブ → 「Hello World Workflow」
2. 「Run workflow」ボタンをクリック
3. 「Run workflow」を再度クリックして手動実行
4. 実行結果を確認

---

## ハンズオン2: CI/CDワークフローの構築

### Step 1: Node.js プロジェクトの準備

**作業場所**: ローカル環境

```bash
# package.json を作成
cat > package.json << 'EOF'
{
  "name": "github-actions-demo",
  "version": "1.0.0",
  "description": "GitHub Actions demo project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "node test.js",
    "lint": "echo 'Linting code...' && exit 0",
    "build": "echo 'Building project...' && mkdir -p dist && echo 'console.log(\"Built successfully\");' > dist/app.js"
  },
  "keywords": ["github-actions", "ci-cd"],
  "author": "izag8216",
  "license": "MIT",
  "devDependencies": {}
}
EOF

# メインファイルを作成
cat > index.js << 'EOF'
const message = "Hello from GitHub Actions CI/CD!";
console.log(message);

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
EOF

# テストファイルを作成
cat > test.js << 'EOF'
const { add, multiply } = require('./index.js');

function runTests() {
  console.log('Running tests...');
  
  // Test add function
  const addResult = add(2, 3);
  if (addResult === 5) {
    console.log('✓ Add test passed');
  } else {
    console.log('✗ Add test failed');
    process.exit(1);
  }
  
  // Test multiply function
  const multiplyResult = multiply(4, 5);
  if (multiplyResult === 20) {
    console.log('✓ Multiply test passed');
  } else {
    console.log('✗ Multiply test failed');
    process.exit(1);
  }
  
  console.log('All tests passed!');
}

runTests();
EOF
```

### Step 2: CI/CDワークフローの作成

**ファイル**: `.github/workflows/ci-cd.yml`

```bash
cat > .github/workflows/ci-cd.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

env:
  NODE_VERSION: '18'

jobs:
  # テストジョブ
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        if [ -f package-lock.json ]; then
          npm ci
        else
          npm install
        fi
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results-node-${{ matrix.node-version }}
        path: |
          test-results/
          coverage/
        retention-days: 7

  # ビルドジョブ
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        if [ -f package-lock.json ]; then
          npm ci
        else
          npm install
        fi
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: dist/
        retention-days: 7

  # デプロイジョブ（mainブランチのみ）
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    environment:
      name: production
      url: https://izag8216.github.io/actions
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-artifacts
        path: dist/
    
    - name: Deploy to GitHub Pages
      run: |
        echo "Deploying to production environment..."
        echo "Files to deploy:"
        ls -la dist/
        echo "Deployment completed successfully!"
    
    - name: Notify deployment
      run: |
        echo "🚀 Deployment successful!"
        echo "Application URL: https://izag8216.github.io/actions"
        echo "Deployed at: $(date)"
EOF
```

### Step 3: 変更をコミット・プッシュ

```bash
# 全ての変更をステージング
git add .

# コミット
git commit -m "Add Node.js project and CI/CD pipeline"

# プッシュ
git push origin main
```

### Step 4: ワークフロー実行の確認

**作業場所**: GitHub Web UI

1. `https://github.com/izag8216/actions/actions` にアクセス
2. 「CI/CD Pipeline」ワークフローの実行を確認
3. マトリックス戦略によるNode.js複数バージョンでのテスト実行を確認
4. ジョブ間の依存関係を確認
5. アーティファクトのアップロード・ダウンロードを確認

---

## ハンズオン3: 高度なワークフロー機能

### Step 1: 環境変数とコンテキスト

**ファイル**: `.github/workflows/advanced-features.yml`

```bash
cat > .github/workflows/advanced-features.yml << 'EOF'
name: Advanced Features Demo

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  schedule:
    - cron: '0 9 * * 1' # 毎週月曜日 9:00 UTC
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
      debug_enabled:
        description: 'Enable debug mode'
        required: false
        default: false
        type: boolean

env:
  GLOBAL_VAR: "global-value"
  BUILD_NUMBER: ${{ github.run_number }}

jobs:
  # 条件付き実行のデモ
  conditional-job:
    name: Conditional Execution
    runs-on: ubuntu-latest
    if: github.event_name != 'schedule'
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Show context information
      run: |
        echo "Event: ${{ github.event_name }}"
        echo "Repository: ${{ github.repository }}"
        echo "Actor: ${{ github.actor }}"
        echo "SHA: ${{ github.sha }}"
        echo "Ref: ${{ github.ref }}"
        echo "Run ID: ${{ github.run_id }}"
        echo "Run Number: ${{ github.run_number }}"
    
    - name: Manual input handling
      if: github.event_name == 'workflow_dispatch'
      run: |
        echo "Environment: ${{ github.event.inputs.environment }}"
        echo "Debug enabled: ${{ github.event.inputs.debug_enabled }}"
    
    - name: Debug step
      if: github.event.inputs.debug_enabled == 'true'
      run: |
        echo "🐛 Debug mode enabled"
        env
        echo "Current directory contents:"
        ls -la

  # マトリックス戦略の高度な使用
  matrix-job:
    name: Matrix Strategy
    runs-on: ${{ matrix.os }}
    
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
        include:
          - os: ubuntu-latest
            node-version: 20
            experimental: true
        exclude:
          - os: windows-latest
            node-version: 16
    
    env:
      OS_NAME: ${{ matrix.os }}
      NODE_VERSION: ${{ matrix.node-version }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    
    - name: Show environment
      run: |
        echo "OS: ${{ matrix.os }}"
        echo "Node.js: ${{ matrix.node-version }}"
        node --version
        npm --version
      shell: bash
    
    - name: Experimental features
      if: matrix.experimental
      run: echo "🧪 Running experimental features"

  # サービスコンテナの使用
  service-container-job:
    name: Service Containers
    runs-on: ubuntu-latest
    
    services:
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
      
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Test Redis connection
      run: |
        sudo apt-get update
        sudo apt-get install -y redis-tools
        redis-cli -h localhost -p 6379 ping
        redis-cli -h localhost -p 6379 set test-key "Hello Redis"
        redis-cli -h localhost -p 6379 get test-key
    
    - name: Test PostgreSQL connection
      run: |
        sudo apt-get install -y postgresql-client
        PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d testdb -c "SELECT version();"
        PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d testdb -c "CREATE TABLE test_table (id SERIAL, name TEXT);"
        PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d testdb -c "INSERT INTO test_table (name) VALUES ('GitHub Actions');"
        PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d testdb -c "SELECT * FROM test_table;"

  # 並行制御のデモ
  concurrency-job:
    name: Concurrency Control
    runs-on: ubuntu-latest
    
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
      cancel-in-progress: true
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Long running task
      run: |
        echo "Starting long running task..."
        for i in {1..10}; do
          echo "Step $i/10"
          sleep 5
        done
        echo "Task completed!"

  # キャッシュの活用
  cache-job:
    name: Caching Demo
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Cache node modules
      uses: actions/cache@v4
      with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-
    
    - name: Install dependencies
      run: |
        if [ -f package-lock.json ]; then
          npm ci
        else
          npm install
        fi
    
    - name: Create cache test file
      run: |
        mkdir -p cache-test
        echo "Cache test data $(date)" > cache-test/data.txt
    
    - name: Cache custom data
      uses: actions/cache@v4
      with:
        path: cache-test/
        key: custom-cache-${{ github.sha }}
        restore-keys: |
          custom-cache-
EOF
```

### Step 2: 再利用可能なワークフロー

**ファイル**: `.github/workflows/reusable-workflow.yml`

```bash
cat > .github/workflows/reusable-workflow.yml << 'EOF'
name: Reusable Workflow

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
        description: 'Target environment'
      node-version:
        required: false
        type: string
        default: '18'
        description: 'Node.js version'
      run-tests:
        required: false
        type: boolean
        default: true
        description: 'Whether to run tests'
    
    outputs:
      build-status:
        description: 'Build status'
        value: ${{ jobs.build.outputs.status }}
      artifact-name:
        description: 'Artifact name'
        value: ${{ jobs.build.outputs.artifact-name }}
    
    secrets:
      DEPLOY_TOKEN:
        required: false
        description: 'Deployment token'

jobs:
  build:
    name: Build for ${{ inputs.environment }}
    runs-on: ubuntu-latest
    
    outputs:
      status: ${{ steps.build.outcome }}
      artifact-name: build-${{ inputs.environment }}-${{ github.sha }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    
    - name: Install dependencies
      run: |
        if [ -f package-lock.json ]; then
          npm ci
        else
          npm install
        fi
    
    - name: Run tests
      if: inputs.run-tests
      run: npm test
    
    - name: Build application
      id: build
      run: |
        echo "Building for environment: ${{ inputs.environment }}"
        npm run build
        echo "Build completed successfully"
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-${{ inputs.environment }}-${{ github.sha }}
        path: dist/
    
    - name: Deploy (if token provided)
      if: secrets.DEPLOY_TOKEN != ''
      run: |
        echo "Deploying to ${{ inputs.environment }}..."
        echo "Using deployment token: ${{ secrets.DEPLOY_TOKEN != '' && '***' || 'not provided' }}"
EOF
```

**ファイル**: `.github/workflows/use-reusable.yml`

```bash
cat > .github/workflows/use-reusable.yml << 'EOF'
name: Use Reusable Workflow

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  call-reusable-staging:
    name: Deploy to Staging
    uses: ./.github/workflows/reusable-workflow.yml
    with:
      environment: staging
      node-version: '18'
      run-tests: true
    # secrets:
    #   DEPLOY_TOKEN: ${{ secrets.STAGING_DEPLOY_TOKEN }}
  
  call-reusable-production:
    name: Deploy to Production
    needs: call-reusable-staging
    uses: ./.github/workflows/reusable-workflow.yml
    with:
      environment: production
      node-version: '18'
      run-tests: false
    # secrets:
    #   DEPLOY_TOKEN: ${{ secrets.PRODUCTION_DEPLOY_TOKEN }}
  
  show-outputs:
    name: Show Outputs
    needs: [call-reusable-staging, call-reusable-production]
    runs-on: ubuntu-latest
    
    steps:
    - name: Display results
      run: |
        echo "Staging build status: ${{ needs.call-reusable-staging.outputs.build-status }}"
        echo "Staging artifact: ${{ needs.call-reusable-staging.outputs.artifact-name }}"
        echo "Production build status: ${{ needs.call-reusable-production.outputs.build-status }}"
        echo "Production artifact: ${{ needs.call-reusable-production.outputs.artifact-name }}"
EOF
```

### Step 3: 変更をプッシュ

```bash
git add .github/workflows/advanced-features.yml
git add .github/workflows/reusable-workflow.yml
git add .github/workflows/use-reusable.yml
git commit -m "Add advanced workflow features and reusable workflows"
git push origin main
```

### Step 4: 高度な機能の確認

**作業場所**: GitHub Web UI

1. 各ワークフローの実行を確認
2. マトリックス戦略の並列実行を確認
3. サービスコンテナの動作を確認
4. 再利用可能なワークフローの呼び出しを確認
5. 手動実行で入力パラメータをテスト

---

## ハンズオン4: セキュリティとシークレット管理

### Step 1: シークレットの設定

**作業場所**: GitHub Web UI

1. `https://github.com/izag8216/actions/settings/secrets/actions` にアクセス
2. 「New repository secret」をクリック
3. 以下のシークレットを作成:
   - `API_KEY`: `demo-api-key-12345`
   - `DATABASE_URL`: `postgresql://user:pass@localhost:5432/db`
   - `DEPLOY_TOKEN`: `ghp_demo_token_12345`

### Step 2: セキュリティワークフローの作成

**ファイル**: `.github/workflows/security-demo.yml`

```bash
cat > .github/workflows/security-demo.yml << 'EOF'
name: Security Demo

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

# 最小権限の設定
permissions:
  contents: read
  security-events: write
  actions: read

env:
  # 環境変数でのシークレット使用（推奨されない例）
  # API_KEY: ${{ secrets.API_KEY }}  # ❌ 推奨されない
  
  # 安全な環境変数の設定
  NODE_ENV: production
  LOG_LEVEL: info

jobs:
  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    
    # 権限の明示的な設定
    permissions:
      contents: read
      security-events: write
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        if [ -f package-lock.json ]; then
          npm ci
        else
          npm install
        fi
    
    - name: Run security audit
      run: |
        echo "Running npm audit..."
        npm audit --audit-level moderate || true
    
    - name: Dependency vulnerability scan
      uses: actions/dependency-review-action@v4
      if: github.event_name == 'pull_request'
    
    - name: Code scanning with CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: javascript
    
    - name: Autobuild
      uses: github/codeql-action/autobuild@v3
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3

  secret-handling:
    name: Proper Secret Handling
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: ✅ Correct secret usage in step
      run: |
        # シークレットを環境変数として使用（推奨）
        echo "Connecting to API..."
        # 実際のAPIキーは表示されない
        echo "API Key length: ${#API_KEY}"
        
        echo "Database connection test..."
        # データベースURLの一部のみ表示
        echo "Database host: $(echo $DATABASE_URL | cut -d'@' -f2 | cut -d':' -f1)"
      env:
        API_KEY: ${{ secrets.API_KEY }}
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
    
    - name: ❌ Incorrect secret usage example
      run: |
        # これらは実際には実行しない（デモンストレーション用）
        echo "❌ Never do this:"
        echo "# echo \"API_KEY: \${{ secrets.API_KEY }}\"  # シークレットが露出"
        echo "# curl -H \"Authorization: \${{ secrets.API_KEY }}\" api.example.com  # ログに記録される"
        
        echo "✅ Instead do this:"
        echo "# curl -H \"Authorization: \$API_KEY\" api.example.com"
        echo "# where API_KEY is set as env variable"
    
    - name: Secure file operations
      run: |
        # 一時的な設定ファイルの作成
        echo "Creating secure config file..."
        cat > config.json << EOF
        {
          "api_endpoint": "https://api.example.com",
          "timeout": 30,
          "retries": 3
        }
        EOF
        
        # ファイル権限の設定
        chmod 600 config.json
        
        echo "Config file created with secure permissions:"
        ls -la config.json
        
        # 使用後の削除
        rm config.json
        echo "Config file securely deleted"

  environment-protection:
    name: Environment Protection Demo
    runs-on: ubuntu-latest
    # 本来は環境保護ルールが設定された環境を使用
    # environment: production
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Deploy simulation
      run: |
        echo "🚀 Deploying to production environment..."
        echo "Environment protections would require:"
        echo "- Manual approval from designated reviewers"
        echo "- Wait timer before deployment"
        echo "- Branch protection rules"
        echo "- Required status checks"
        
        # デプロイメントシミュレーション
        for i in {1..5}; do
          echo "Deployment step $i/5..."
          sleep 2
        done
        
        echo "✅ Deployment completed successfully"
    
    - name: Post-deployment verification
      run: |
        echo "🔍 Running post-deployment checks..."
        echo "- Health check: ✅ PASS"
        echo "- Performance check: ✅ PASS"
        echo "- Security scan: ✅ PASS"

  oidc-demo:
    name: OpenID Connect Demo
    runs-on: ubuntu-latest
    
    # OIDC権限の設定
    permissions:
      id-token: write
      contents: read
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Configure AWS credentials (demo)
      run: |
        echo "🔐 OIDC Token Information:"
        echo "GITHUB_TOKEN is available: ${GITHUB_TOKEN:+yes}"
        echo "GitHub OIDC token would be used for:"
        echo "- AWS IAM role assumption"
        echo "- Azure service principal authentication"
        echo "- Google Cloud Workload Identity"
        echo "- HashiCorp Vault authentication"
        
        # OIDCトークンの基本情報表示（実際のトークンは表示しない）
        echo "Actor: ${{ github.actor }}"
        echo "Repository: ${{ github.repository }}"
        echo "Ref: ${{ github.ref }}"
        echo "SHA: ${{ github.sha }}"
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Simulate cloud deployment
      run: |
        echo "☁️  Simulating cloud deployment with OIDC..."
        echo "1. Assume IAM role using OIDC token"
        echo "2. Deploy to cloud infrastructure"
        echo "3. Update deployment status"
        echo "✅ Cloud deployment simulation completed"

  security-best-practices:
    name: Security Best Practices
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout with token
      uses: actions/checkout@v4
      with:
        # 必要最小限の権限を持つトークンを使用
        token: ${{ secrets.GITHUB_TOKEN }}
        fetch-depth: 1  # 必要最小限の履歴のみ取得
    
    - name: Validate inputs and environment
      run: |
        echo "🔒 Security validation checks:"
        
        # 入力値の検証
        if [[ "${{ github.event_name }}" =~ ^(push|pull_request|workflow_dispatch)$ ]]; then
          echo "✅ Event type validation: PASS"
        else
          echo "❌ Event type validation: FAIL"
          exit 1
        fi
        
        # 環境変数の検証
        if [[ -n "$NODE_ENV" && "$NODE_ENV" =~ ^(development|staging|production)$ ]]; then
          echo "✅ Environment validation: PASS"
        else
          echo "❌ Environment validation: FAIL"
          exit 1
        fi
        
        # ブランチ保護の確認
        if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
          echo "✅ Main branch deployment detected"
        fi
    
    - name: Secure logging practices
      run: |
        echo "📝 Secure logging demonstration:"
        
        # 機密情報をマスク
        SECRET_VALUE="sensitive-data-123"
        echo "::add-mask::$SECRET_VALUE"
        echo "Secret value: $SECRET_VALUE"
        
        # 構造化ログの使用
        echo "::notice title=Deployment Status::Application deployed successfully"
        echo "::warning title=Performance::Response time increased by 10%"
        
        # グループ化されたログ
        echo "::group::Detailed deployment steps"
        echo "Step 1: Build completed"
        echo "Step 2: Tests passed"
        echo "Step 3: Deployment successful"
        echo "::endgroup::"
EOF
```

### Step 3: セキュリティ設定ファイル

**ファイル**: `.github/dependabot.yml`

```bash
mkdir -p .github
cat > .github/dependabot.yml << 'EOF'
version: 2
updates:
  # GitHub Actions の依存関係を監視
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    reviewers:
      - "izag8216"
    commit-message:
      prefix: "chore"
      include: "scope"

  # npm の依存関係を監視
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
      time: "09:00"
    open-pull-requests-limit: 10
    versioning-strategy: "increase"
    reviewers:
      - "izag8216"
    commit-message:
      prefix: "chore"
      include: "scope"
    ignore:
      # 開発依存関係の特定バージョンを無視
      - dependency-name: "*"
        update-types: ["version-update:semver-patch"]
EOF
```

### Step 4: 変更をプッシュ

```bash
git add .github/workflows/security-demo.yml
git add .github/dependabot.yml
git commit -m "Add security demonstration and Dependabot configuration"
git push origin main
```

### Step 5: セキュリティ機能の確認

**作業場所**: GitHub Web UI

1. Security タブでセキュリティ機能を確認
2. Code scanning alerts を確認
3. Dependency alerts を確認
4. Secret scanning の設定を確認

---

## ハンズオン5: カスタムアクションの作成

### Step 1: JavaScript アクションの作成

**ディレクトリ構造の作成**:

```bash
# カスタムアクション用ディレクトリ
mkdir -p .github/actions/hello-action
cd .github/actions/hello-action
```

**ファイル**: `.github/actions/hello-action/action.yml`

```bash
cat > action.yml << 'EOF'
name: 'Hello Action'
description: 'A simple custom action that greets users'
author: 'izag8216'

inputs:
  who-to-greet:
    description: 'Who to greet'
    required: true
    default: 'World'
  
  greeting-style:
    description: 'Style of greeting'
    required: false
    default: 'friendly'
    # friendly, formal, casual

outputs:
  greeting-message:
    description: 'The greeting message that was generated'
  
  timestamp:
    description: 'Time when the greeting was generated'

runs:
  using: 'node20'
  main: 'index.js'

branding:
  icon: 'heart'
  color: 'green'
EOF
```

**ファイル**: `.github/actions/hello-action/index.js`

```bash
cat > index.js << 'EOF'
const core = require('@actions/core');
const github = require('@actions/github');

try {
  // 入力パラメータの取得
  const whoToGreet = core.getInput('who-to-greet');
  const greetingStyle = core.getInput('greeting-style');
  
  console.log(`Greeting ${whoToGreet} in ${greetingStyle} style!`);
  
  // グリーティングメッセージの生成
  let greeting;
  switch (greetingStyle) {
    case 'formal':
      greeting = `Good day, ${whoToGreet}. I hope this message finds you well.`;
      break;
    case 'casual':
      greeting = `Hey ${whoToGreet}! What's up?`;
      break;
    case 'friendly':
    default:
      greeting = `Hello ${whoToGreet}! Nice to meet you! 👋`;
      break;
  }
  
  const timestamp = new Date().toISOString();
  
  // GitHubコンテキスト情報の表示
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`GitHub context payload: ${payload}`);
  
  // 出力の設定
  core.setOutput('greeting-message', greeting);
  core.setOutput('timestamp', timestamp);
  
  // 情報の表示
  core.info(`Generated greeting: ${greeting}`);
  core.info(`Timestamp: ${timestamp}`);
  core.notice(`Action completed successfully for ${whoToGreet}`);
  
} catch (error) {
  core.setFailed(`Action failed with error: ${error.message}`);
}
EOF
```

**ファイル**: `.github/actions/hello-action/package.json`

```bash
cat > package.json << 'EOF'
{
  "name": "hello-action",
  "version": "1.0.0",
  "description": "A simple custom GitHub Action",
  "main": "index.js",
  "scripts": {
    "test": "echo \"No tests specified\" && exit 0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/izag8216/actions.git"
  },
  "keywords": [
    "github-actions",
    "custom-action",
    "greeting"
  ],
  "author": "izag8216",
  "license": "MIT",
  "dependencies": {
    "@actions/core": "^1.10.1",
    "@actions/github": "^6.0.0"
  }
}
EOF
```

### Step 2: 依存関係のインストールと node_modules の準備

```bash
# 依存関係をインストール
npm install

# node_modules をコミット用に準備（GitHubアクションでは必要）
# 通常は .gitignore に含めるが、アクションでは含める必要がある
echo "# Custom action dependencies" > .gitignore
echo "# node_modules is included for GitHub Actions" >> .gitignore
```

### Step 3: Composite アクションの作成

```bash
# ディレクトリに戻る
cd /Users/apple/Desktop/actions

# Composite アクション用ディレクトリ
mkdir -p .github/actions/setup-project
```

**ファイル**: `.github/actions/setup-project/action.yml`

```bash
cat > .github/actions/setup-project/action.yml << 'EOF'
name: 'Setup Project'
description: 'Setup Node.js project with caching and dependency installation'
author: 'izag8216'

inputs:
  node-version:
    description: 'Node.js version to use'
    required: false
    default: '18'
  
  cache-dependency-path:
    description: 'Path to dependency file for cache key'
    required: false
    default: 'package-lock.json'
  
  install-dependencies:
    description: 'Whether to install dependencies'
    required: false
    default: 'true'

outputs:
  cache-hit:
    description: 'Whether cache was hit'
    value: ${{ steps.cache.outputs.cache-hit }}
  
  node-version:
    description: 'Node.js version that was installed'
    value: ${{ steps.setup-node.outputs.node-version }}

runs:
  using: 'composite'
  steps:
    - name: Setup Node.js
      id: setup-node
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        registry-url: 'https://registry.npmjs.org'
    
    - name: Cache dependencies
      id: cache
      uses: actions/cache@v4
      with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ inputs.node-version }}-${{ hashFiles(inputs.cache-dependency-path) }}
        restore-keys: |
          ${{ runner.os }}-node-${{ inputs.node-version }}-
          ${{ runner.os }}-node-
    
    - name: Install dependencies
      if: inputs.install-dependencies == 'true'
      shell: bash
      run: |
        if [ -f package-lock.json ]; then
          echo "Installing with npm ci..."
          npm ci
        elif [ -f yarn.lock ]; then
          echo "Installing with yarn..."
          yarn install --frozen-lockfile
        elif [ -f pnpm-lock.yaml ]; then
          echo "Installing with pnpm..."
          npm install -g pnpm
          pnpm install --frozen-lockfile
        else
          echo "Installing with npm install..."
          npm install
        fi
    
    - name: Display setup information
      shell: bash
      run: |
        echo "✅ Project setup completed"
        echo "Node.js version: $(node --version)"
        echo "npm version: $(npm --version)"
        echo "Cache hit: ${{ steps.cache.outputs.cache-hit }}"
        echo "Dependencies installed: ${{ inputs.install-dependencies }}"

branding:
  icon: 'package'
  color: 'blue'
EOF
```

### Step 4: カスタムアクションを使用するワークフロー

**ファイル**: `.github/workflows/test-custom-actions.yml`

```bash
cat > .github/workflows/test-custom-actions.yml << 'EOF'
name: Test Custom Actions

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
    inputs:
      greeting-name:
        description: 'Name to greet'
        required: true
        default: 'GitHub Actions Learner'
      greeting-style:
        description: 'Greeting style'
        required: false
        default: 'friendly'
        type: choice
        options:
          - friendly
          - formal
          - casual

jobs:
  test-javascript-action:
    name: Test JavaScript Action
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Use custom hello action
      id: hello
      uses: ./.github/actions/hello-action
      with:
        who-to-greet: ${{ github.event.inputs.greeting-name || 'GitHub Actions' }}
        greeting-style: ${{ github.event.inputs.greeting-style || 'friendly' }}
    
    - name: Display action outputs
      run: |
        echo "Greeting message: ${{ steps.hello.outputs.greeting-message }}"
        echo "Timestamp: ${{ steps.hello.outputs.timestamp }}"
    
    - name: Test different greeting styles
      uses: ./.github/actions/hello-action
      with:
        who-to-greet: 'Formal User'
        greeting-style: 'formal'
    
    - name: Test casual greeting
      uses: ./.github/actions/hello-action
      with:
        who-to-greet: 'Casual User'
        greeting-style: 'casual'

  test-composite-action:
    name: Test Composite Action
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Setup project with custom action
      id: setup
      uses: ./.github/actions/setup-project
      with:
        node-version: ${{ matrix.node-version }}
        install-dependencies: 'true'
    
    - name: Display setup results
      run: |
        echo "Node.js version: ${{ steps.setup.outputs.node-version }}"
        echo "Cache hit: ${{ steps.setup.outputs.cache-hit }}"
    
    - name: Run tests
      run: |
        echo "Running tests with Node.js ${{ matrix.node-version }} on ${{ matrix.os }}"
        npm test
    
    - name: Test without dependency installation
      uses: ./.github/actions/setup-project
      with:
        node-version: ${{ matrix.node-version }}
        install-dependencies: 'false'

  test-action-combinations:
    name: Test Action Combinations
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Setup project
      uses: ./.github/actions/setup-project
      with:
        node-version: '18'
    
    - name: Welcome message
      uses: ./.github/actions/hello-action
      with:
        who-to-greet: 'Project Developer'
        greeting-style: 'friendly'
    
    - name: Build project
      run: npm run build
    
    - name: Success message
      uses: ./.github/actions/hello-action
      with:
        who-to-greet: 'Build Process'
        greeting-style: 'formal'
    
    - name: Create action summary
      run: |
        echo "## Custom Actions Test Results 🎉" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "### Actions Tested:" >> $GITHUB_STEP_SUMMARY
        echo "- ✅ JavaScript Action (hello-action)" >> $GITHUB_STEP_SUMMARY
        echo "- ✅ Composite Action (setup-project)" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "### Test Environment:" >> $GITHUB_STEP_SUMMARY
        echo "- **OS**: ${{ runner.os }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Node.js**: $(node --version)" >> $GITHUB_STEP_SUMMARY
        echo "- **Repository**: ${{ github.repository }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Workflow**: ${{ github.workflow }}" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "All custom actions executed successfully! 🚀" >> $GITHUB_STEP_SUMMARY

  publish-action:
    name: Publish Action Info
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Create action documentation
      run: |
        mkdir -p action-docs
        
        cat > action-docs/hello-action.md << 'DOC'
        # Hello Action

        A simple custom GitHub Action that generates personalized greetings.

        ## Usage

        ```yaml
        - name: Greet user
          uses: ./.github/actions/hello-action
          with:
            who-to-greet: 'Your Name'
            greeting-style: 'friendly'
        ```

        ## Inputs

        | Input | Description | Required | Default |
        |-------|-------------|----------|---------|
        | `who-to-greet` | Who to greet | Yes | `World` |
        | `greeting-style` | Style of greeting | No | `friendly` |

        ## Outputs

        | Output | Description |
        |--------|-------------|
        | `greeting-message` | The greeting message |
        | `timestamp` | Generation timestamp |
        DOC
        
        cat > action-docs/setup-project.md << 'DOC'
        # Setup Project Action

        A composite action that sets up Node.js projects with caching.

        ## Usage

        ```yaml
        - name: Setup project
          uses: ./.github/actions/setup-project
          with:
            node-version: '18'
            install-dependencies: 'true'
        ```

        ## Inputs

        | Input | Description | Required | Default |
        |-------|-------------|----------|---------|
        | `node-version` | Node.js version | No | `18` |
        | `cache-dependency-path` | Cache key path | No | `package-lock.json` |
        | `install-dependencies` | Install deps | No | `true` |

        ## Outputs

        | Output | Description |
        |--------|-------------|
        | `cache-hit` | Whether cache was hit |
        | `node-version` | Installed Node.js version |
        DOC
    
    - name: Upload documentation
      uses: actions/upload-artifact@v4
      with:
        name: action-documentation
        path: action-docs/
        retention-days: 30
EOF
```

### Step 5: 変更をコミット・プッシュ

```bash
# 全ての変更をステージング
git add .

# コミット
git commit -m "Add custom JavaScript and composite actions"

# プッシュ
git push origin main
```

### Step 6: カスタムアクションの確認

**作業場所**: GitHub Web UI

1. カスタムアクションの実行を確認
2. JavaScript アクションのログを確認
3. Composite アクションの動作を確認
4. 異なる入力パラメータでの動作をテスト

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. ワークフローが実行されない

**症状**: プッシュしてもワークフローが動かない

**原因と解決方法**:
```bash
# YAMLファイルの構文確認
yamllint .github/workflows/*.yml

# ファイルパスの確認
ls -la .github/workflows/

# ブランチ名の確認
git branch
```

#### 2. アクションが見つからない

**症状**: `Error: Can't find 'action.yml'`

**解決方法**:
```bash
# アクションファイルの存在確認
ls -la .github/actions/*/action.yml

# ファイル内容の確認
cat .github/actions/hello-action/action.yml
```

#### 3. Node.js 依存関係エラー

**症状**: `Module not found` エラー

**解決方法**:
```bash
# 依存関係の再インストール
cd .github/actions/hello-action
npm install

# node_modules がコミットされているか確認
git status
```

#### 4. 権限エラー

**症状**: `Permission denied` エラー

**解決方法**:
- リポジトリの Settings > Actions で権限を確認
- ワークフロー内で `permissions` を適切に設定

#### 5. シークレットが読み込めない

**症状**: シークレットが空になる

**解決方法**:
- GitHub Settings > Secrets で設定を確認
- 環境変数として正しく設定されているか確認

### デバッグ手法

#### 1. デバッグログの有効化

```bash
# リポジトリシークレットに以下を設定
# ACTIONS_STEP_DEBUG: true
# ACTIONS_RUNNER_DEBUG: true
```

#### 2. ワークフロー内でのデバッグ

```yaml
- name: Debug information
  run: |
    echo "Debug: GitHub context"
    echo "Event: ${{ github.event_name }}"
    echo "Actor: ${{ github.actor }}"
    echo "Repository: ${{ github.repository }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
    
    echo "Debug: Environment variables"
    env | grep GITHUB_ | sort
    
    echo "Debug: Runner information"
    echo "OS: ${{ runner.os }}"
    echo "Architecture: ${{ runner.arch }}"
```

#### 3. アーティファクトを使った情報収集

```yaml
- name: Collect debug info
  run: |
    mkdir debug-info
    env > debug-info/environment.txt
    ls -la > debug-info/files.txt
    git log --oneline -10 > debug-info/git-log.txt

- name: Upload debug artifacts
  uses: actions/upload-artifact@v4
  with:
    name: debug-info
    path: debug-info/
```

---

## まとめと次のステップ

### 学習した内容の振り返り

このチュートリアルで学習した内容：

1. **基本概念**: ワークフロー、ジョブ、ステップ、アクション
2. **ワークフロー作成**: YAML構文、トリガー設定、基本的なステップ
3. **CI/CD**: テスト、ビルド、デプロイのパイプライン
4. **高度な機能**: マトリックス戦略、サービスコンテナ、並行制御
5. **セキュリティ**: シークレット管理、権限設定、OIDC
6. **カスタムアクション**: JavaScript アクション、Composite アクション

### 実践的な応用

**作成したワークフロー**:
- Hello World（基本学習）
- CI/CD Pipeline（実用的なパイプライン）
- Advanced Features（高度な機能デモ）
- Security Demo（セキュリティベストプラクティス）
- Custom Actions Test（カスタムアクション活用）

### 次のステップ

#### 1. さらなる学習

```bash
# 公式ドキュメントの詳細な学習
echo "推奨学習リソース:"
echo "- GitHub Actions Marketplace: https://github.com/marketplace?type=actions"
echo "- GitHub Learning Lab: https://github.com/apps/github-learning-lab"
echo "- GitHub Community Forum: https://github.community/"
```

#### 2. 実際のプロジェクトでの活用

- 既存プロジェクトにCI/CDを導入
- 自動テストの設定
- デプロイメントパイプラインの構築
- コードクオリティチェックの自動化

#### 3. 高度な機能の探求

- **Actions Runner Controller (ARC)**: Kubernetes上でのセルフホストランナー
- **GitHub Apps**: より高度な権限管理
- **Marketplace公開**: 作成したアクションの公開
- **Enterprise機能**: 大規模組織での活用

#### 4. コミュニティへの貢献

- オープンソースプロジェクトへのワークフロー貢献
- 有用なアクションの作成・公開
- ベストプラクティスの共有

### リソースリンク

- [GitHub Actions公式ドキュメント](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Awesome GitHub Actions](https://github.com/sdras/awesome-actions)
- [GitHub Community](https://github.community/)

### 最終確認

**作成したファイル一覧**:
```bash
# ファイル構造の確認
find .github -type f -name "*.yml" -o -name "*.yaml" -o -name "*.js" -o -name "*.json" | sort
```

**リポジトリURL**: `https://github.com/izag8216/actions`

このチュートリアルを通じて、GitHub Actionsの基本から応用まで包括的に学習できました。継続的な学習と実践により、より効果的なワークフローを構築できるようになります。

---

**🎉 おめでとうございます！GitHub Actions完全初心者向けハンズオンチュートリアルが完了しました！** 