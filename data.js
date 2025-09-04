// 学習項目データ（カテゴリ別）
// 各項目: id, title, level, minutes, tags, why, what, tips, practice
const CURRICULUM = [
  {
    category: "コンピュータ基礎",
    items: [
      {
        id: "cs-bits-types",
        title: "データ表現（ビット/バイト/型）",
        level: "初級",
        minutes: 15,
        tags: ["基礎", "型"],
        why: "数字や文字、画像など全てはビット列で表現されます。型の違いがバグや桁あふれを防ぐ鍵です。",
        what: "ビット/バイト、整数/浮動小数、文字コード（UTF-8）を俯瞰して理解します。",
        tips: "文字化けは多バイト文字とエンコーディングの不一致が原因のことが多い。",
        practice: "'A' は何バイトか？日本語の'あ'はUTF-8で何バイトか調べる。"
      },
      {
        id: "cs-algo-big-o",
        title: "アルゴリズムと計算量（Big-O）",
        level: "初級",
        minutes: 20,
        tags: ["基礎", "思考"],
        why: "処理が遅い/重いの感覚を数字で説明できると、正しい設計と見積りができます。",
        what: "O(1)/O(log n)/O(n)/O(n log n)/O(n^2) の直感と例を掴む。",
        tips: "ソートは O(n log n) が実用的な下限。二重ループは O(n^2)。",
        practice: "100倍データ量になったとき、各オーダーで処理時間はどのくらい伸びるか言語化する。"
      }
    ]
  },
  {
    category: "OS/コマンドライン",
    items: [
      {
        id: "cli-path-fs",
        title: "ファイル/ディレクトリとパス",
        level: "初級",
        minutes: 15,
        tags: ["CLI", "基礎"],
        why: "どのOS/言語でもファイル操作は頻出。相対/絶対パスの理解は迷子防止。",
        what: "ls/cd/pwd/cp/mv/rm、相対（./, ../）と絶対（/から始まる）を確認。",
        tips: "消す前に 'rm -i' やゴミ箱移動を習慣化。",
        practice: "練習用フォルダを作成→ファイルを移動/コピー→相対パスのみで完了させる。"
      },
      {
        id: "cli-stdin-pipe",
        title: "標準入出力とパイプ",
        level: "初級",
        minutes: 20,
        tags: ["CLI", "効率"],
        why: "コマンドを組み合わせて小さな自動化が可能に。日常の時短に直結。",
        what: "'|' でつなぐ、'>' で保存、'<' で入力。grep/rg, less, sort, uniq と組合せ。",
        tips: "エラー出力は2>で別ファイルに。",
        practice: "テキストから特定の単語を含む行数を数え、上位10件を表示。"
      }
    ]
  },
  {
    category: "Git/GitHub",
    items: [
      {
        id: "git-basic-flow",
        title: "基本フロー（add/commit/push/pull/branch/merge）",
        level: "初級",
        minutes: 25,
        tags: ["Git", "コラボ"],
        why: "変更履歴の管理と共同開発の必須スキル。",
        what: "ローカル変更→ステージ→コミット→プッシュ。ブランチ作成→PR→マージの流れ。",
        tips: "コミットメッセージは命題形で短く具体的に。",
        practice: "小さな変更でブランチ→コミット→PR作成の一連を擬似体験。"
      },
      {
        id: "git-diff-review",
        title: "差分の読み方とレビュー",
        level: "初級",
        minutes: 15,
        tags: ["Git", "レビュー"],
        why: "安全に変更を取り込むための目。品質の要。",
        what: "追加/削除、文脈、テスト影響、リスク箇所を確認する観点。",
        tips: "大きいPRは分割。意味単位でコミット。",
        practice: "サンプル差分を読み、懸念点を3つ指摘する練習。"
      }
    ]
  },
  {
    category: "ネットワーク/HTTP",
    items: [
      {
        id: "http-basics",
        title: "HTTPメソッド/ステータス/ヘッダ",
        level: "初級",
        minutes: 20,
        tags: ["HTTP", "Web"],
        why: "Web/APIの土台。通信の成否を正しく判断できます。",
        what: "GET/POST/PUT/PATCH/DELETE、2xx/4xx/5xx、Content-Type/Authorization など。",
        tips: "冪等（idempotent）なメソッドはリトライしやすい。",
        practice: "ブラウザの開発者ツールでネットワークタブを開き、任意サイトのリクエスト/レスポンスを観察。"
      },
      {
        id: "dns-tcp-ip",
        title: "DNS/TCP/IPの超概要",
        level: "初級",
        minutes: 15,
        tags: ["ネットワーク"],
        why: "名前解決/接続/ポートの概念を知るだけでトラブルシュートが楽に。",
        what: "DNSで名前→IP、TCPでコネクション、ポートでアプリ識別。",
        tips: "疎通確認は ping/curl/ブラウザ。",
        practice: "任意ドメインのIPを調べ、80/443にHTTP/HTTPSでアクセスしてみる。"
      }
    ]
  },
  {
    category: "Web基礎",
    items: [
      {
        id: "html-structure",
        title: "HTMLの基本（タグ/セマンティクス）",
        level: "初級",
        minutes: 20,
        tags: ["HTML", "Web"],
        why: "構造を正しく表現することがアクセシビリティとSEOの基礎。",
        what: "head/body, h1〜h6, p, a, img, ul/ol/li, section/article/nav/footer など。",
        tips: "装飾目的でdivを乱用しない。意味のあるタグを選ぶ。",
        practice: "自己紹介ページを見出し/段落/リンク/画像で構成してみる。"
      },
      {
        id: "css-layout",
        title: "CSSレイアウト（ボックス/フレックス/グリッド）",
        level: "初級",
        minutes: 25,
        tags: ["CSS", "レイアウト"],
        why: "要素の並びを理解すると試行錯誤が圧倒的に減る。",
        what: "ボックスモデル、display、flexboxの主軸/交差軸、gridの行/列テンプレート。",
        tips: "デベロッパーツールで要素ボックスを可視化しながら調整。",
        practice: "2カラムのカードグリッドを作る。"
      },
      {
        id: "js-basics",
        title: "JavaScript基礎（変数/関数/配列/オブジェクト）",
        level: "初級",
        minutes: 30,
        tags: ["JS", "基礎"],
        why: "動くUIや小さな自動化を作る最短ルート。",
        what: "let/const、関数、for/forEach、map/filter/reduce、オブジェクトとJSON。",
        tips: "副作用のある処理とない処理を意識する。",
        practice: "配列の合計/平均/最大を map/reduce で計算。"
      }
    ]
  },
  {
    category: "プログラミング基礎",
    items: [
      {
        id: "prog-control-structures",
        title: "制御構文とスコープ",
        level: "初級",
        minutes: 20,
        tags: ["基礎"],
        why: "if/for/switch/try の読解力がコード全体の理解力に直結。",
        what: "条件分岐、ループ、早期return、ブロックスコープの概念。",
        tips: "ネストを浅く、早期returnで読みやすく。",
        practice: "条件が3つ以上の分岐を早期returnで整理する。"
      },
      {
        id: "prog-data-structures",
        title: "基本データ構造（配列/連想配列/集合/マップ）",
        level: "初級",
        minutes: 20,
        tags: ["基礎", "データ構造"],
        why: "問題に最適な入れ物を選べるとコードが簡潔に。",
        what: "リスト、キー/バリュー、重複なし集合、順序付きマップの使い分け。",
        tips: "検索が多いときはマップ/セット。",
        practice: "重複を除去して頻度順に並べる関数を作る。"
      },
      {
        id: "error-handling",
        title: "エラーハンドリングの基本",
        level: "初級",
        minutes: 15,
        tags: ["品質"],
        why: "エラーは必ず起こる。安全に失敗できる設計が重要。",
        what: "try/catch、戻り値の検証、ユーザー向けメッセージとログの分離。",
        tips: "失敗時の戻し方（ロールバック）を先に決める。",
        practice: "入力検証でエラーメッセージとログ出力を分ける。"
      }
    ]
  },
  {
    category: "テスト",
    items: [
      {
        id: "test-levels",
        title: "テストレベル（単体/結合/E2E）",
        level: "初級",
        minutes: 15,
        tags: ["テスト", "品質"],
        why: "壊れたことを早く気付ける仕組み。",
        what: "AAA（Arrange/Act/Assert）、ピラミッドの考え方、リグレッション防止。",
        tips: "細かい単体テスト＋要所の結合テストでコスパ最適化。",
        practice: "関数1つに対し正常/境界/異常の3ケースを書く。"
      },
      {
        id: "test-autmation",
        title: "自動テストとCIの価値",
        level: "初級",
        minutes: 10,
        tags: ["テスト", "CI"],
        why: "人手による見落としを減らし、スピードと安心を両立。",
        what: "プッシュ時にテストが走る仕組み、失敗の見方。",
        tips: "壊れたら最小再現→赤→修正→緑を徹底。",
        practice: "READMEのサンプル関数に小さなテストを追加する仮想演習。"
      }
    ]
  },
  {
    category: "デバッグ",
    items: [
      {
        id: "debug-logging",
        title: "ログ活用と再現手順",
        level: "初級",
        minutes: 12,
        tags: ["デバッグ"],
        why: "再現できれば直せる。再現できなければ運。",
        what: "再現手順→期待/実際→関連ログ→仮説→切り分け→修正→再検証の流れ。",
        tips: "一度に1つだけ変える。",
        practice: "意図的に小さなバグを作り、二分探索で原因箇所を特定。"
      },
      {
        id: "debug-tools",
        title: "デベロッパーツール/ブレークポイント",
        level: "初級",
        minutes: 15,
        tags: ["デバッグ", "ブラウザ"],
        why: "値の中身を見ながら一歩ずつ確認できる。",
        what: "Sourcesタブでブレーク、Call stackの見方、Watch/Network/Performanceの基礎。",
        tips: "console.logは強いが多用しすぎるとノイズ。",
        practice: "クリックイベントの関数にブレークを置き、変数の遷移を観察。"
      }
    ]
  },
  {
    category: "セキュリティ基礎",
    items: [
      {
        id: "sec-auth-n-authz",
        title: "認証と認可の違い",
        level: "初級",
        minutes: 10,
        tags: ["セキュリティ"],
        why: "誰か（認証）と何を許すか（認可）は別問題。",
        what: "ID/パスワード、多要素、トークン、ロール/スコープの概念。",
        tips: "最小権限の原則（必要最低限のみ許可）。",
        practice: "架空サービスでユーザー/管理者の許可範囲を表にする。"
      },
      {
        id: "sec-web-topics",
        title: "一般的な脆弱性（XSS/CSRF/SQLi）",
        level: "初級",
        minutes: 20,
        tags: ["セキュリティ", "Web"],
        why: "入力の扱いを誤ると情報漏えいに直結。",
        what: "エスケープ/トークン/プリペアドステートメントなどの対策の方向性を知る。",
        tips: "信頼境界を意識。外から来たデータは疑う。",
        practice: "フォーム入力を画面に表示する際の安全な出力方法を説明する。"
      }
    ]
  },
  {
    category: "データベース",
    items: [
      {
        id: "db-sql-basics",
        title: "SQLの基本（SELECT/WHERE/JOIN/INDEX）",
        level: "初級",
        minutes: 25,
        tags: ["DB", "SQL"],
        why: "データの取り出し/結合/絞り込みは業務で頻出。",
        what: "基本構文、INNER/LEFT JOIN、インデックスの効果と注意点。",
        tips: "SELECT * は避け、必要な列を指定。",
        practice: "2テーブルをJOINして条件付きで集計するクエリを書く。"
      },
      {
        id: "nosql-overview",
        title: "NoSQLのざっくり像",
        level: "初級",
        minutes: 12,
        tags: ["DB"],
        why: "RDB以外の選択肢の強み/弱みを知る。",
        what: "キー値/ドキュメント/カラム/グラフ型の特徴と適材適所。",
        tips: "一貫性/可用性/分割耐性のトレードオフ（CAP）。",
        practice: "ユーザープロフィール保存にRDBとNoSQLどちらを選ぶか理由を述べる。"
      }
    ]
  },
  {
    category: "API設計",
    items: [
      {
        id: "api-errors",
        title: "エラーレスポンス設計",
        level: "初級",
        minutes: 15,
        tags: ["API", "HTTP"],
        why: "クライアントが原因/対処を素早く理解できる形が重要。",
        what: "HTTPステータス、コード/メッセージ/詳細/フィールドエラーの構造。",
        tips: "ユーザー向け文言と開発者向け詳細は分ける。",
        practice: "無効な入力時のレスポンスJSONを設計する。"
      },
      {
        id: "api-versioning",
        title: "APIバージョニングと互換性",
        level: "初級",
        minutes: 12,
        tags: ["API"],
        why: "破壊的変更を安全に進めるための基本。",
        what: "URL/ヘッダ/リソース拡張などのやり方と非推奨（deprecation）運用。",
        tips: "追加は互換、削除/意味変更は破壊的。",
        practice: "フィールドを追加する際の互換性の影響を説明する。"
      }
    ]
  },
  {
    category: "クラウド/DevOps",
    items: [
      {
        id: "docker-concepts",
        title: "コンテナの概念（Docker）",
        level: "初級",
        minutes: 15,
        tags: ["DevOps", "Docker"],
        why: "環境差異を減らし、同じ手順で動かせる。",
        what: "イメージ/コンテナ/レジストリ、Dockerfileとcomposeの役割。",
        tips: "イメージは不変、設定は外だし（環境変数/ボリューム）。",
        practice: "任意の公式イメージで 'hello world' を起動する手順を言語化。"
      },
      {
        id: "ci-cd-pipeline",
        title: "CI/CDの流れ",
        level: "初級",
        minutes: 12,
        tags: ["CI", "運用"],
        why: "変更を小さく頻繁に出すためのパイプライン。",
        what: "テスト→ビルド→デプロイ、自動と手動承認の使い分け。",
        tips: "本番は段階的リリースで影響を最小化。",
        practice: "プッシュ時にテストを走らせ、mainにマージでデプロイとする案を描く。"
      },
      {
        id: "observability",
        title: "監視/アラート/指標（SLI/SLO）",
        level: "初級",
        minutes: 15,
        tags: ["運用"],
        why: "気付ける仕組みがないと品質は維持できない。",
        what: "可観測性、メトリクス/ログ/トレース、エラーレートやレイテンシ。",
        tips: "ノイズを減らし意味のあるアラートだけに。",
        practice: "APIのレイテンシ90pの目標値を決め、閾値を設定する。"
      }
    ]
  },
  {
    category: "開発プロセス/コラボ",
    items: [
      {
        id: "process-issues",
        title: "Issueの書き方（ゴール/条件/背景）",
        level: "初級",
        minutes: 10,
        tags: ["コラボ", "ドキュメント"],
        why: "誰が読んでも同じゴールを共有できる。",
        what: "目的/受入条件/背景/スコープ外/期限/担当のテンプレ。",
        tips: "例と反例を1つずつ示すとズレが減る。",
        practice: "小機能のIssueをテンプレで起票してみる。"
      },
      {
        id: "doc-readme",
        title: "READMEの構成",
        level: "初級",
        minutes: 10,
        tags: ["ドキュメント"],
        why: "新しい人が最短で動かせる入口。",
        what: "概要/前提/セットアップ/使い方/テスト/トラブルシュート/貢献方法。",
        tips: "一画面で読める長さにし、詳細は別リンク。",
        practice: "このリポジトリ用のREADME改善案を3点挙げる。"
      }
    ]
  },
  {
    category: "コミュニケーション",
    items: [
      {
        id: "com-req",
        title: "要件定義の会話術",
        level: "初級",
        minutes: 12,
        tags: ["コミュニケーション"],
        why: "作る前にズレを減らすのが最大のコスパ。",
        what: "現状/課題/理想/制約/優先度/計測指標を確認。",
        tips: "Whyを3回掘る。",
        practice: "小さな改善提案で、課題→理想→制約→指標の順にメモ。"
      },
      {
        id: "com-bug-report",
        title: "良いバグ報告",
        level: "初級",
        minutes: 8,
        tags: ["コミュニケーション", "品質"],
        why: "再現性が高い報告は修正を加速する。",
        what: "環境/再現手順/期待/実際/ログ/スクショ。",
        tips: "一度に複数問題を混ぜない。",
        practice: "最近の不具合を上記テンプレで書き直す。"
      }
    ]
  },
  {
    category: "AI/ツール活用",
    items: [
      {
        id: "ai-prompt",
        title: "質問/プロンプトの作り方",
        level: "初級",
        minutes: 10,
        tags: ["AI", "生産性"],
        why: "具体的な文脈と期待があるだけで精度が上がる。",
        what: "目的/前提/入力/期待/制約/評価基準を先に伝える。",
        tips: "小さく試し、差分で改善する。",
        practice: "この教材に関する質問を上記テンプレで1件作る。"
      },
      {
        id: "ai-limits-verify",
        title: "LLMの限界と検証",
        level: "初級",
        minutes: 12,
        tags: ["AI", "品質"],
        why: "自信満々な誤答（ハルシネーション）を見分ける目が必要。",
        what: "出力の根拠/再現性/反例をチェックし、重要事項は必ず実機検証。",
        tips: "一度で決めない。複数案を比較。",
        practice: "生成物の事実確認のためのチェックリストを作る。"
      }
    ]
  }
];

// レベル/所要時間帯の候補
const LEVELS = ["初級", "中級", "上級"];
const TIME_BUCKETS = [
  { key: "t-10", label: "~10分", max: 10 },
  { key: "t-20", label: "~20分", max: 20 },
  { key: "t-30", label: "~30分", max: 30 },
  { key: "t-60", label: "~60分", max: 60 }
];

