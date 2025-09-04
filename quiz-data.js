const QUIZ_QUESTIONS = {
  beginner: [
    {
      id: 'b001',
      question: 'touch test.js でtest.jsのファイルが作られます',
      explanation: {
        title: 'touchコマンド - ファイル作成とタイムスタンプ更新',
        description: 'touchコマンドは空のファイルを作成したり、既存ファイルのタイムスタンプを更新するLinux/Unix系コマンドです。',
        usage: [
          'touch filename.txt - 新しい空ファイルを作成',
          'touch file1.js file2.js - 複数ファイルを一度に作成',
          'touch -t 202401010000 file.txt - 指定した時刻でファイルを作成'
        ],
        examples: [
          'touch index.html - HTMLファイルを作成',
          'touch script.js style.css - JSとCSSファイルを同時作成',
          'touch README.md - マークダウンファイルを作成'
        ],
        tips: '開発でよく使う基本コマンド。IDE使用時も理解しておくと便利です。'
      }
    },
    {
      id: 'b002',
      question: 'ls -la で隠しファイルも含めて詳細表示されます',
      explanation: {
        title: 'lsコマンド - ディレクトリの内容表示',
        description: 'lsコマンドはディレクトリの内容を表示するLinux/Unix系の基本コマンドです。',
        usage: [
          'ls - 現在のディレクトリの内容を表示',
          'ls -l - 詳細情報付きで表示（権限、サイズ、日付など）',
          'ls -a - 隠しファイル（.で始まるファイル）も表示',
          'ls -la - 詳細情報＋隠しファイル表示'
        ],
        examples: [
          'ls /home/user - 指定ディレクトリの内容表示',
          'ls *.js - JSファイルのみ表示',
          'ls -lt - 更新日時順で表示'
        ],
        tips: 'ファイル操作の基本中の基本。毎日使うコマンドです。'
      }
    },
    {
      id: 'b003',
      question: 'cd .. で一つ上の親ディレクトリに移動できます',
      explanation: {
        title: 'cdコマンド - ディレクトリ移動',
        description: 'cdコマンドは現在の作業ディレクトリを変更するためのコマンドです。',
        usage: [
          'cd dirname - 指定ディレクトリに移動',
          'cd .. - 一つ上の親ディレクトリに移動',
          'cd ~ - ホームディレクトリに移動',
          'cd - - 前のディレクトリに戻る'
        ],
        examples: [
          'cd /var/www - 絶対パスで移動',
          'cd src/components - 相対パスで移動',
          'cd ~/Documents - ホーム配下のDocumentsに移動'
        ],
        tips: 'ファイルシステム操作の基本。パスの概念を理解することが重要。'
      }
    },
    {
      id: 'b004',
      question: 'mkdir new-folder で新しいディレクトリを作成できます',
      explanation: {
        title: 'mkdirコマンド - ディレクトリ作成',
        description: 'mkdirコマンドは新しいディレクトリ（フォルダ）を作成するLinux/Unix系コマンドです。',
        usage: [
          'mkdir dirname - 新しいディレクトリを作成',
          'mkdir -p path/to/dir - 存在しない親ディレクトリも含めて作成',
          'mkdir dir1 dir2 dir3 - 複数ディレクトリを同時作成'
        ],
        examples: [
          'mkdir src - srcディレクトリを作成',
          'mkdir -p src/components/ui - 階層構造を一度に作成',
          'mkdir assets css js - 複数の関連ディレクトリを作成'
        ],
        tips: 'プロジェクト構造を整理する際によく使用。-pオプションは特に便利。'
      }
    },
    {
      id: 'b005',
      question: 'cp file.txt backup.txt でファイルをコピーできます',
      explanation: {
        title: 'cpコマンド - ファイル・ディレクトリのコピー',
        description: 'cpコマンドはファイルやディレクトリをコピーするLinux/Unix系コマンドです。',
        usage: [
          'cp source destination - ファイルをコピー',
          'cp -r dirname newdir - ディレクトリを再帰的にコピー',
          'cp *.js backup/ - パターンマッチでファイルをコピー'
        ],
        examples: [
          'cp config.json config.backup.json - 設定ファイルのバックアップ',
          'cp -r src/ backup/src/ - srcディレクトリ全体をコピー',
          'cp file1.txt file2.txt dest/ - 複数ファイルを指定先にコピー'
        ],
        tips: 'バックアップ作成やファイル複製で頻繁に使用。-rオプションでディレクトリもコピー可能。'
      }
    },
    {
      id: 'b006',
      question: 'rm file.txt でファイルを削除できます',
      explanation: {
        title: 'rmコマンド - ファイル・ディレクトリの削除',
        description: 'rmコマンドはファイルやディレクトリを削除するLinux/Unix系コマンドです。注意して使用してください。',
        usage: [
          'rm filename - ファイルを削除',
          'rm -r dirname - ディレクトリを再帰的に削除',
          'rm -f filename - 強制削除（確認なし）',
          'rm -rf dirname - ディレクトリを強制的に再帰削除'
        ],
        examples: [
          'rm temp.txt - 一時ファイルを削除',
          'rm *.log - ログファイルを一括削除',
          'rm -r build/ - ビルドディレクトリを削除'
        ],
        tips: '削除は復元困難なので慎重に。重要なファイルは事前にバックアップを。'
      }
    },
    {
      id: 'b007',
      question: 'cat file.txt でファイルの内容を表示できます',
      explanation: {
        title: 'catコマンド - ファイル内容の表示',
        description: 'catコマンドはファイルの内容を標準出力に表示するLinux/Unix系コマンドです。',
        usage: [
          'cat filename - ファイル内容を表示',
          'cat file1 file2 - 複数ファイルを連結して表示',
          'cat > newfile - 新しいファイルに内容を書き込み（Ctrl+Dで終了）'
        ],
        examples: [
          'cat README.md - マークダウンファイルの内容確認',
          'cat package.json - JSON設定ファイルの確認',
          'cat error.log - エラーログの内容確認'
        ],
        tips: '短いファイルの確認に最適。長いファイルはlessやmoreコマンドが便利。'
      }
    },
    {
      id: 'b008',
      question: 'grep "text" file.txt でファイル内のテキストを検索できます',
      explanation: {
        title: 'grepコマンド - テキスト検索',
        description: 'grepコマンドはファイル内で指定したパターンに一致する行を検索・表示するコマンドです。',
        usage: [
          'grep "pattern" file - パターンにマッチする行を検索',
          'grep -i "pattern" file - 大文字小文字を無視して検索',
          'grep -r "pattern" dir/ - ディレクトリ内を再帰的に検索',
          'grep -n "pattern" file - 行番号付きで表示'
        ],
        examples: [
          'grep "function" script.js - 関数定義を検索',
          'grep -i "error" *.log - エラーメッセージをログから検索',
          'grep -r "TODO" src/ - プロジェクト内のTODOコメントを検索'
        ],
        tips: 'コード内の検索やログ解析で非常に重要。正規表現も使用可能。'
      }
    },
    {
      id: 'b009',
      question: 'pwd で現在の作業ディレクトリのパスが表示されます',
      explanation: {
        title: 'pwdコマンド - 現在ディレクトリの表示',
        description: 'pwdコマンドは現在の作業ディレクトリの絶対パスを表示するコマンドです。',
        usage: [
          'pwd - 現在のディレクトリパスを表示',
          'pwd -P - シンボリックリンクを解決した実際のパスを表示'
        ],
        examples: [
          'pwd → /home/user/projects/myapp',
          'cd src && pwd → /home/user/projects/myapp/src'
        ],
        tips: '迷子になった時の現在地確認。スクリプトでも現在位置の取得によく使用。'
      }
    },
    {
      id: 'b010',
      question: 'echo "Hello World" で文字列を出力できます',
      explanation: {
        title: 'echoコマンド - テキスト出力',
        description: 'echoコマンドは指定した文字列を標準出力に表示するコマンドです。',
        usage: [
          'echo "text" - 文字列を出力',
          'echo $VARIABLE - 環境変数の値を出力',
          'echo "text" > file.txt - ファイルに文字列を書き込み',
          'echo "text" >> file.txt - ファイルに文字列を追記'
        ],
        examples: [
          'echo "Build completed" - メッセージ出力',
          'echo $PATH - PATH環境変数の確認',
          'echo "# My Project" > README.md - ファイル作成'
        ],
        tips: 'デバッグやスクリプトでの簡易出力に便利。リダイレクトでファイル操作も。'
      }
    }
  ],
  intermediate: [
    {
      id: 'i001',
      question: 'git init で新しいGitリポジトリを初期化できます',
      explanation: {
        title: 'git init - Gitリポジトリの初期化',
        description: 'git initコマンドは現在のディレクトリをGitリポジトリとして初期化し、バージョン管理を開始します。',
        usage: [
          'git init - 現在のディレクトリをGitリポジトリに',
          'git init project-name - 新しいディレクトリを作成してGitリポジトリに',
          'git init --bare - ベアリポジトリを作成（サーバー用）'
        ],
        examples: [
          'mkdir myproject && cd myproject && git init',
          'git init my-new-app',
          'ls -la → .gitディレクトリが作成される'
        ],
        tips: 'プロジェクトの最初に実行。.gitディレクトリにバージョン情報が保存される。'
      }
    },
    {
      id: 'i002',
      question: 'git add . で全ての変更をステージングエリアに追加できます',
      explanation: {
        title: 'git add - ファイルをステージングエリアに追加',
        description: 'git addコマンドは変更されたファイルをコミット待ち状態（ステージングエリア）に移します。',
        usage: [
          'git add filename - 指定ファイルをステージング',
          'git add . - 全ての変更をステージング',
          'git add *.js - JavaScriptファイルのみステージング',
          'git add -A - 全ての変更（削除含む）をステージング'
        ],
        examples: [
          'git add index.html - HTMLファイルをステージング',
          'git add src/ - srcディレクトリの変更をステージング',
          'git status - ステージング状況を確認'
        ],
        tips: 'コミット前の必須操作。細かくaddすることで意図的なコミットが可能。'
      }
    },
    {
      id: 'i003',
      question: 'git commit -m "message" で変更をコミットできます',
      explanation: {
        title: 'git commit - 変更の記録',
        description: 'git commitコマンドはステージングされた変更をリポジトリの履歴として記録します。',
        usage: [
          'git commit -m "commit message" - メッセージ付きでコミット',
          'git commit -am "message" - add + commitを同時実行',
          'git commit --amend - 直前のコミットを修正'
        ],
        examples: [
          'git commit -m "Add login functionality"',
          'git commit -m "Fix: resolve authentication bug"',
          'git commit -m "Update: improve error handling"'
        ],
        tips: 'メッセージは変更内容を明確に。英語の場合は動詞で始めるのが一般的。'
      }
    },
    {
      id: 'i004',
      question: 'npm init で新しいNode.jsプロジェクトを初期化できます',
      explanation: {
        title: 'npm init - Node.jsプロジェクトの初期化',
        description: 'npm initコマンドはpackage.jsonファイルを生成してNode.jsプロジェクトを初期化します。',
        usage: [
          'npm init - 対話形式でpackage.jsonを作成',
          'npm init -y - デフォルト値でpackage.jsonを作成',
          'npm init @scope - スコープ付きパッケージで初期化'
        ],
        examples: [
          'npm init → プロジェクト名、バージョンなどを入力',
          'npm init -y → package.jsonが即座に生成',
          'cat package.json → 生成されたファイルを確認'
        ],
        tips: 'Node.jsプロジェクトの開始点。依存関係やスクリプトの管理に必須。'
      }
    },
    {
      id: 'i005',
      question: 'npm install express でExpressパッケージをインストールできます',
      explanation: {
        title: 'npm install - パッケージのインストール',
        description: 'npm installコマンドはNode.jsのパッケージをプロジェクトにインストールします。',
        usage: [
          'npm install package-name - パッケージをインストール',
          'npm install package-name --save-dev - 開発依存としてインストール',
          'npm install - package.jsonに記載された全依存関係をインストール',
          'npm install -g package-name - グローバルインストール'
        ],
        examples: [
          'npm install express - Webフレームワークをインストール',
          'npm install --save-dev nodemon - 開発用ツールをインストール',
          'npm install react react-dom - 複数パッケージを同時インストール'
        ],
        tips: 'node_modulesディレクトリが作成される。package.jsonに依存関係が記録。'
      }
    },
    {
      id: 'i006',
      question: 'curl -X GET https://api.example.com でHTTP GETリクエストを送信できます',
      explanation: {
        title: 'curl - HTTP通信ツール',
        description: 'curlコマンドはHTTPリクエストを送信してAPIのテストやデータ取得に使用します。',
        usage: [
          'curl URL - GETリクエストを送信',
          'curl -X POST URL - POSTリクエストを送信',
          'curl -H "Content-Type: application/json" URL - ヘッダー付きリクエスト',
          'curl -d "data" URL - データ付きでリクエスト'
        ],
        examples: [
          'curl https://jsonplaceholder.typicode.com/posts/1',
          'curl -X POST -H "Content-Type: application/json" -d \'{"title":"test"}\' api.example.com/posts',
          'curl -o output.json https://api.example.com/data'
        ],
        tips: 'APIテストの基本ツール。レスポンスヘッダーやステータスコードも確認可能。'
      }
    },
    {
      id: 'i007',
      question: 'ps aux | grep node でNodeプロセスを確認できます',
      explanation: {
        title: 'ps・grep・パイプ - プロセス確認',
        description: 'psコマンドで実行中のプロセスを表示し、パイプとgrepで特定プロセスをフィルタリングします。',
        usage: [
          'ps aux - 全プロセスを詳細表示',
          'ps aux | grep process-name - 特定プロセスを検索',
          'ps -ef - プロセスの親子関係を表示',
          'kill PID - プロセスIDでプロセス終了'
        ],
        examples: [
          'ps aux | grep node - Nodeプロセスを確認',
          'ps aux | grep apache - Apacheプロセスを確認',
          'ps aux | grep python - Pythonプロセスを確認'
        ],
        tips: 'サーバー管理やプロセス監視で重要。パイプ（|）でコマンド連携が可能。'
      }
    },
    {
      id: 'i008',
      question: 'chmod 755 script.sh でファイルに実行権限を付与できます',
      explanation: {
        title: 'chmod - ファイル権限の変更',
        description: 'chmodコマンドはファイルやディレクトリの権限（読み取り、書き込み、実行）を変更します。',
        usage: [
          'chmod 755 file - 所有者に全権限、他に読み取り・実行権限',
          'chmod +x file - 実行権限を追加',
          'chmod -w file - 書き込み権限を削除',
          'chmod 644 file - 所有者に読み書き、他に読み取りのみ'
        ],
        examples: [
          'chmod 755 deploy.sh - デプロイスクリプトを実行可能に',
          'chmod +x build.sh - ビルドスクリプトに実行権限追加',
          'chmod 644 *.txt - テキストファイルを読み取り専用に'
        ],
        tips: '755（rwxr-xr-x）、644（rw-r--r--）がよく使われる。セキュリティ上重要。'
      }
    },
    {
      id: 'i009',
      question: 'ssh user@server.com でリモートサーバーにログインできます',
      explanation: {
        title: 'SSH - セキュアなリモートログイン',
        description: 'SSHコマンドは暗号化された通信でリモートサーバーに安全にログインします。',
        usage: [
          'ssh user@hostname - ユーザー名とホスト名でログイン',
          'ssh -p 2222 user@hostname - ポート番号指定でログイン',
          'ssh-keygen - SSH鍵ペアを生成',
          'ssh-copy-id user@hostname - 公開鍵をサーバーに送信'
        ],
        examples: [
          'ssh ubuntu@myserver.com - Ubuntuサーバーにログイン',
          'ssh -i ~/.ssh/my_key user@server - 秘密鍵指定でログイン',
          'ssh user@server \'ls -la\' - リモートでコマンド実行'
        ],
        tips: 'サーバー管理の基本。鍵認証設定でパスワード入力不要にできる。'
      }
    },
    {
      id: 'i010',
      question: 'docker run -p 3000:3000 myapp でコンテナを起動できます',
      explanation: {
        title: 'Docker run - コンテナの起動',
        description: 'docker runコマンドはDockerイメージからコンテナを作成・起動します。',
        usage: [
          'docker run image-name - イメージからコンテナを起動',
          'docker run -p host:container image - ポートマッピング指定',
          'docker run -d image - バックグラウンドで起動',
          'docker run -it image bash - インタラクティブモードで起動'
        ],
        examples: [
          'docker run -p 8080:80 nginx - Nginxコンテナを起動',
          'docker run -d --name mydb mysql - MySQLコンテナをバックグラウンド起動',
          'docker run -v $(pwd):/app node:16 npm start - ボリュームマウント付き起動'
        ],
        tips: '現代の開発・デプロイで必須技術。環境の統一と分離が可能。'
      }
    }
  ],
  advanced: [
    {
      id: 'a001',
      question: 'awk \'{print $1}\' file.txt でファイルの1列目のみを抽出できます',
      explanation: {
        title: 'awk - テキスト処理言語',
        description: 'awkは強力なテキスト処理ツールで、列の抽出、計算、条件分岐などが可能です。',
        usage: [
          'awk \'{print $N}\' file - N列目を表示',
          'awk \'NR>1{print}\' file - 1行目（ヘッダー）をスキップ',
          'awk \'length($0)>10\' file - 10文字超の行のみ表示',
          'awk \'{sum+=$1} END{print sum}\' file - 1列目の合計を計算'
        ],
        examples: [
          'awk \'{print $2}\' access.log - アクセスログから2列目抽出',
          'awk \'NF>3{print $1,$4}\' data.csv - 4列以上のデータから1,4列目抽出',
          'ps aux | awk \'{print $2,$11}\' - プロセスIDとコマンドを抽出'
        ],
        tips: 'ログ解析やCSV処理で威力発揮。sedと組み合わせて使うことも多い。'
      }
    },
    {
      id: 'a002',
      question: 'sed \'s/old/new/g\' file.txt で文字列を一括置換できます',
      explanation: {
        title: 'sed - ストリームエディタ',
        description: 'sedコマンドはファイルやストリームの内容を編集・変換するツールです。',
        usage: [
          'sed \'s/old/new/g\' file - 文字列を全て置換',
          'sed \'s/old/new/\' file - 各行で最初の文字列のみ置換',
          'sed \'N行d\' file - N行目を削除',
          'sed -i \'s/old/new/g\' file - ファイルを直接編集'
        ],
        examples: [
          'sed \'s/localhost/production.com/g\' config.js - 設定ファイルの一括変更',
          'sed \'1d\' file.csv - CSVファイルのヘッダー行を削除',
          'cat access.log | sed \'s/ERROR/[ERROR]/g\' - ログのエラー表示を強調'
        ],
        tips: '正規表現も使用可能。大量ファイルの一括変更に非常に有効。'
      }
    },
    {
      id: 'a003',
      question: 'find . -name "*.js" -type f でJavaScriptファイルを再帰検索できます',
      explanation: {
        title: 'find - ファイル・ディレクトリ検索',
        description: 'findコマンドは指定条件に合うファイルやディレクトリを再帰的に検索します。',
        usage: [
          'find path -name pattern - 名前パターンで検索',
          'find path -type f - ファイルのみ検索',
          'find path -type d - ディレクトリのみ検索',
          'find path -mtime -7 - 7日以内に更新されたファイル'
        ],
        examples: [
          'find . -name "*.log" -delete - ログファイルを検索して削除',
          'find /var -size +100M - 100MB超のファイルを検索',
          'find . -name "node_modules" -type d - node_modulesディレクトリを検索'
        ],
        tips: '大規模プロジェクトでのファイル管理に必須。xargsと組み合わせて一括処理も。'
      }
    },
    {
      id: 'a004',
      question: 'tar -czf archive.tar.gz folder/ でディレクトリを圧縮できます',
      explanation: {
        title: 'tar - アーカイブ・圧縮ツール',
        description: 'tarコマンドは複数ファイルを1つにまとめ、gzipと組み合わせて圧縮も可能です。',
        usage: [
          'tar -czf archive.tar.gz files - gzip圧縮でアーカイブ作成',
          'tar -xzf archive.tar.gz - gzip圧縮アーカイブを展開',
          'tar -tf archive.tar.gz - アーカイブ内容を表示',
          'tar -czf backup.tar.gz --exclude="*.log" folder/ - 特定ファイル除外'
        ],
        examples: [
          'tar -czf website-backup.tar.gz /var/www/html/',
          'tar -xzf node-v16.tar.gz - Node.jsアーカイブを展開',
          'tar -czf project-$(date +%Y%m%d).tar.gz src/ - 日付付きバックアップ'
        ],
        tips: 'バックアップやデプロイで頻繁に使用。圧縮率と処理速度のバランスが良い。'
      }
    },
    {
      id: 'a005',
      question: 'crontab -e で定期実行するタスクを設定できます',
      explanation: {
        title: 'crontab - 定期実行スケジューラー',
        description: 'crontabはUnix/Linux系システムで定期的にコマンドを実行するためのツールです。',
        usage: [
          'crontab -e - cron設定を編集',
          'crontab -l - 現在のcron設定を表示',
          'crontab -r - 全てのcron設定を削除',
          '形式: 分 時 日 月 曜日 コマンド'
        ],
        examples: [
          '0 2 * * * /path/to/backup.sh - 毎日2時にバックアップ実行',
          '*/15 * * * * /usr/bin/check-server.sh - 15分毎にサーバーチェック',
          '0 0 1 * * /usr/bin/monthly-report.sh - 毎月1日にレポート生成'
        ],
        tips: 'サーバー運用で必須。ログ管理、バックアップ、監視に使用。時間設定に注意。'
      }
    },
    {
      id: 'a006',
      question: 'nginx -t で設定ファイルの構文チェックができます',
      explanation: {
        title: 'nginx - Webサーバー管理',
        description: 'nginxコマンドでWebサーバーの管理と設定の検証を行います。',
        usage: [
          'nginx -t - 設定ファイルの構文チェック',
          'nginx -s reload - 設定を再読み込み',
          'nginx -s stop - nginxを停止',
          'nginx -s quit - 処理完了後にnginxを停止'
        ],
        examples: [
          'sudo nginx -t → 設定エラーがあれば表示',
          'sudo nginx -s reload - 設定変更後の反映',
          'sudo systemctl status nginx - サービス状態確認'
        ],
        tips: '本番環境での設定変更時は必ず-tで検証してからreload実行。'
      }
    },
    {
      id: 'a007',
      question: 'rsync -av source/ dest/ でディレクトリを同期できます',
      explanation: {
        title: 'rsync - 高効率ファイル同期',
        description: 'rsyncは差分のみを転送してファイル・ディレクトリを効率的に同期するツールです。',
        usage: [
          'rsync -av source dest - アーカイブモードで同期',
          'rsync -av --delete source dest - 削除ファイルも同期',
          'rsync -av user@host:/path dest - リモートから同期',
          'rsync -av --exclude="*.log" source dest - 特定ファイル除外'
        ],
        examples: [
          'rsync -av /var/www/ backup/www/ - Webサイトをバックアップ',
          'rsync -av --delete src/ user@server:/var/www/ - リモートサーバーにデプロイ',
          'rsync -av --progress large-files/ backup/ - 進捗表示付き同期'
        ],
        tips: 'バックアップやデプロイで重宝。差分転送で高速、帯域幅も節約。'
      }
    },
    {
      id: 'a008',
      question: 'top でシステムのリソース使用状況をリアルタイム監視できます',
      explanation: {
        title: 'top - システムリソース監視',
        description: 'topコマンドは実行中のプロセスとシステムリソースの使用状況をリアルタイムで表示します。',
        usage: [
          'top - システム状況を表示',
          'htop - より見やすい拡張版top（要インストール）',
          'top -p PID - 特定プロセスのみ監視',
          'top -u username - 特定ユーザーのプロセスのみ表示'
        ],
        examples: [
          'top → CPUやメモリ使用率、プロセス一覧が表示',
          'top -p $(pgrep nginx) - nginxプロセスのみ監視',
          'htop → カラフルで直感的なシステム監視'
        ],
        tips: 'サーバー負荷調査やパフォーマンス問題の特定に必須。qキーで終了。'
      }
    },
    {
      id: 'a009',
      question: 'iptables -L でファイアウォール設定を確認できます',
      explanation: {
        title: 'iptables - Linuxファイアウォール',
        description: 'iptablesはLinuxのファイアウォール機能を制御するコマンドラインツールです。',
        usage: [
          'iptables -L - 現在のルール一覧表示',
          'iptables -A INPUT -p tcp --dport 80 -j ACCEPT - HTTP通信許可',
          'iptables -A INPUT -p tcp --dport 22 -j ACCEPT - SSH通信許可',
          'iptables -F - 全ルールを削除（危険）'
        ],
        examples: [
          'iptables -L -n → IPアドレスで表示、名前解決なし',
          'iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT - 内部ネットワーク許可',
          'iptables-save > firewall.rules - 設定をファイルに保存'
        ],
        tips: 'セキュリティの要。設定ミスでSSH接続不能になる危険あり。慎重に作業を。'
      }
    },
    {
      id: 'a010',
      question: 'strace -p PID でプロセスのシステムコール呼び出しをトレースできます',
      explanation: {
        title: 'strace - システムコールトレーサー',
        description: 'straceはプロセスが実行するシステムコールを監視・デバッグするツールです。',
        usage: [
          'strace command - コマンドのシステムコールを監視',
          'strace -p PID - 実行中プロセスを監視',
          'strace -e trace=open,read program - 特定システムコールのみ監視',
          'strace -o output.txt program - 結果をファイルに保存'
        ],
        examples: [
          'strace ls → lsコマンドのシステムコール確認',
          'strace -p $(pgrep nginx) → nginxプロセスの動作解析',
          'strace -e trace=network curl google.com → ネットワーク関連のみ監視'
        ],
        tips: 'プログラムの動作解析やトラブルシューティングに強力。出力量が多いので注意。'
      }
    }
  ]
};