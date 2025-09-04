// QuizApp - エンジニア必修知識クイズアプリケーション

class QuizApp {
  constructor() {
    this.currentLevel = 'beginner';
    this.currentQuestionIndex = 0;
    this.progress = this.loadProgress();
    this.countdownTimer = null;
    this.timeRemaining = 12;
    this.demonModeStarted = false;
    // 鬼モードの元データを保持（常にコマンド実践に限定するためのプール）
    this.demonPoolOriginal = Array.isArray(QUIZ_QUESTIONS.demon)
      ? QUIZ_QUESTIONS.demon.slice()
      : [];
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initTheme();
    this.updateLevelDisplay();
    this.showCurrentQuestion();
    this.updateProgress();
  }
  
  bindEvents() {
    // テーマ切り替えボタン
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // レベル切り替えボタン
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchLevel(e.target.dataset.level);
      });
    });
    
    // 回答ボタン
    document.getElementById('knowBtn').addEventListener('click', () => {
      this.handleAnswer(true);
    });
    
    document.getElementById('dontKnowBtn').addEventListener('click', () => {
      this.handleAnswer(false);
    });
    
    // 説明モーダル関連
    document.getElementById('closeExplanation').addEventListener('click', () => {
      this.hideExplanation();
    });
    
    document.getElementById('nextFromExplanation').addEventListener('click', () => {
      this.hideExplanation();
      this.nextQuestion();
    });
    
    // レベル完了モーダル関連
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
      this.moveToNextLevel();
    });
    
    document.getElementById('reviewBtn').addEventListener('click', () => {
      this.reviewLevel();
    });
    
    // 鬼モードスタートボタン
    document.getElementById('demonStartBtn').addEventListener('click', () => {
      this.startDemonMode();
    });
    
    // 鬼モード用イベント
    document.getElementById('hintBtn').addEventListener('click', () => {
      this.showHint();
    });
    
    document.getElementById('startShuffleBtn').addEventListener('click', () => {
      this.shuffleQuestions();
    });
    
    document.getElementById('commandInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand();
      }
    });

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      if (e.key === '1' || e.key === 'ArrowLeft') {
        document.getElementById('knowBtn').click();
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        document.getElementById('dontKnowBtn').click();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // 鬼モードでのヒントボタン (Delete/Backspace x2)
        if (this.currentLevel === 'demon' && document.getElementById('commandInputArea').style.display !== 'none') {
          // Delete/Backspaceが連続で押された場合のみヒント表示
          if (this.lastDeleteKeyTime && Date.now() - this.lastDeleteKeyTime < 500) {
            document.getElementById('hintBtn').click();
            this.lastDeleteKeyTime = null;
          } else {
            this.lastDeleteKeyTime = Date.now();
          }
        }
      } else if (e.key === 'Escape') {
        this.hideExplanation();
        this.hideLevelComplete();
      }
    });
    
    // モーダル背景クリックで閉じる
    document.getElementById('explanationModal').addEventListener('click', (e) => {
      if (e.target.id === 'explanationModal') {
        this.hideExplanation();
      }
    });
  }
  
  switchLevel(level) {
    this.currentLevel = level;
    this.currentQuestionIndex = 0;
    this.demonModeStarted = false; // レベル切り替え時にリセット
    // モバイルではデフォルトで折りたたみ解除（開始時に再度折りたたむ）
    document.body.classList.remove('mobile-collapsed');
    
    // 鬼モードでは毎回ランダムで10問を初級/中級/上級から作成
    if (level === 'demon') {
      this.buildDemonQuestionSet();
    }
    
    // アクティブなレベルボタンを更新
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-level="${level}"]`).classList.add('active');
    
    this.updateLevelDisplay();
    this.showCurrentQuestion();
    this.updateProgress();
  }
  
  // 鬼モードの問題セットを毎回ランダムに10問作る（初級/中級/上級から）
  buildDemonQuestionSet() {
    try {
      // コマンド実践に限定: type==='command' または expectedCommand を持つものだけ
      const pool = [];

      // 既存の鬼モード問題（コマンド実践）をベースにする
      pool.push(...this.demonPoolOriginal);

      // 将来、他レベルにもコマンド型が追加された場合に備えて取り込む
      const maybeLevels = ['beginner', 'intermediate', 'advanced'];
      maybeLevels.forEach((lvl) => {
        const arr = QUIZ_QUESTIONS[lvl];
        if (Array.isArray(arr)) {
          arr.forEach((q) => {
            if (q && (q.type === 'command' || q.expectedCommand)) {
              pool.push(q);
            }
          });
        }
      });

      // 重複を排除（id基準）
      const seen = new Set();
      const deduped = pool.filter((q) => {
        const key = q && q.id ? q.id : JSON.stringify(q);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // シャッフルして最大10問を選択（プールが10未満なら全件）
      const selected = deduped
        .map((item) => ({ item, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(({ item }) => item)
        .slice(0, 10);

      // グローバルの鬼モード問題を上書き（このセッション限定）
      QUIZ_QUESTIONS.demon = selected;
    } catch (e) {
      // フォールバック：既存の鬼モード問題をそのまま使用
      console.warn('鬼モード問題のランダム化に失敗したため既存セットを使用します', e);
    }
  }
  
  updateLevelDisplay() {
    const levelNames = {
      'beginner': '初級',
      'intermediate': '中級', 
      'advanced': '上級',
      'demon': '鬼モード'
    };
    
    // 進捗表示は削除済み
  }
  
  showCurrentQuestion() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    if (!currentQuestion) {
      this.showLevelComplete();
      return;
    }
    
    document.getElementById('questionNumber').textContent = this.currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    // 鬼モードの場合はスタート画面を表示
    const answerButtons = document.getElementById('answerButtons');
    const commandInputArea = document.getElementById('commandInputArea');
    const demonStartArea = document.getElementById('demonStartArea');
    
    if (this.currentLevel === 'demon') {
      // 問題がコマンド型かどうかでUIを切り替える
      const isCommandType = currentQuestion && (currentQuestion.type === 'command' || currentQuestion.expectedCommand);
      if (isCommandType) {
        answerButtons.style.display = 'none';
        // 鬼モードが既に開始されている場合は直接コマンド入力エリアを表示
        if (this.demonModeStarted) {
          commandInputArea.style.display = 'block';
          demonStartArea.style.display = 'none';
          this.setupDemonMode(currentQuestion);
        } else {
          // 初回のみスタート画面を表示
          commandInputArea.style.display = 'none';
          demonStartArea.style.display = 'block';
        }
      } else {
        // コマンド型でない場合は通常のQ/A表示にフォールバック
        answerButtons.style.display = 'flex';
        commandInputArea.style.display = 'none';
        demonStartArea.style.display = 'none';
      }
    } else {
      answerButtons.style.display = 'flex';
      commandInputArea.style.display = 'none';
      demonStartArea.style.display = 'none';
    }
    
    // カードのアニメーション
    const card = document.getElementById('quizCard');
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  }
  
  handleAnswer(knows) {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    // 進捗を保存
    if (!this.progress[this.currentLevel]) {
      this.progress[this.currentLevel] = {};
    }
    this.progress[this.currentLevel][currentQuestion.id] = knows;
    this.saveProgress();
    
    if (knows) {
      // 知っている場合はすぐに次の問題へ
      this.nextQuestion();
    } else {
      // 知らない場合は説明を表示
      this.showExplanation(currentQuestion);
    }
  }
  
  nextQuestion() {
    this.currentQuestionIndex++;
    this.showCurrentQuestion();
    this.updateProgress();
  }
  
  showExplanation(question) {
    const modal = document.getElementById('explanationModal');
    const title = document.getElementById('explanationTitle');
    const content = document.getElementById('explanationContent');
    
    title.textContent = question.explanation.title;
    
    // 説明内容を構築
    let html = `
      <div class="explanation-description">
        <p>${question.explanation.description}</p>
      </div>
      
      <div class="explanation-section">
        <h4>💡 使い方</h4>
        <ul>
          ${question.explanation.usage.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div class="explanation-section">
        <h4>📝 具体例</h4>
        <ul>
          ${question.explanation.examples.map(item => `<li><code>${item}</code></li>`).join('')}
        </ul>
      </div>
      
      <div class="explanation-section">
        <h4>💫 ポイント</h4>
        <p class="tips">${question.explanation.tips}</p>
      </div>
    `;
    
    content.innerHTML = html;
    modal.classList.add('show');
    
    // フォーカスを説明モーダルに移動
    setTimeout(() => {
      document.getElementById('nextFromExplanation').focus();
    }, 100);
  }
  
  hideExplanation() {
    document.getElementById('explanationModal').classList.remove('show');
  }
  
  showLevelComplete() {
    const modal = document.getElementById('levelCompleteModal');
    const content = document.getElementById('completeContent');
    
    const levelProgress = this.progress[this.currentLevel] || {};
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const totalQuestions = questions.length;
    // 現在の出題セットに含まれるIDのみで正解数をカウント
    const knownQuestions = questions.reduce((sum, q) => sum + (levelProgress[q.id] ? 1 : 0), 0);
    const unknownQuestions = totalQuestions - knownQuestions;
    
    const percentage = Math.round((knownQuestions / totalQuestions) * 100);
    
    let resultMessage = '';
    let nextLevelAvailable = false;
    
    if (this.currentLevel === 'demon') {
      // 鬼モードは最終的な正解数を明示
      resultMessage = `👹 鬼モード結果: ${totalQuestions}問中 ${knownQuestions}問正解`;
    } else {
      if (percentage >= 80) {
        resultMessage = '🌟 素晴らしい！このレベルをマスターしました！';
        nextLevelAvailable = true;
      } else if (percentage >= 60) {
        resultMessage = '👍 良い感じです！もう少し復習してみましょう。';
      } else {
        resultMessage = '📚 復習が必要ですが、着実に学習しています！';
      }
    }
    
    const levelNames = {
      'beginner': '初級',
      'intermediate': '中級',
      'advanced': '上級'
    };
    
    const correctLabel = this.currentLevel === 'demon' ? '正解' : '知っていた';
    const incorrectLabel = this.currentLevel === 'demon' ? '不正解' : '学習した';
    content.innerHTML = `
      <div class="result-summary">
        <div class="result-score">
          <span class="score-number">${percentage}%</span>
          <span class="score-label">理解度</span>
        </div>
        <div class="result-details">
          <div class="detail-item">
            <span class="detail-label">${correctLabel}:</span>
            <span class="detail-value known">${knownQuestions}問</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${incorrectLabel}:</span>
            <span class="detail-value learned">${unknownQuestions}問</span>
          </div>
        </div>
      </div>
      <div class="result-message">
        <p>${resultMessage}</p>
      </div>
    `;
    
    // 次のレベルボタンの表示/非表示
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelAvailable && this.getNextLevel()) {
      nextLevelBtn.style.display = 'block';
      nextLevelBtn.textContent = `${this.getNextLevelName()}へ進む`;
    } else {
      nextLevelBtn.style.display = 'none';
    }
    
    modal.classList.add('show');
    // 鬼モード終了時はモバイルの折りたたみを解除してモード選択にアクセス可能に
    if (this.currentLevel === 'demon' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      document.body.classList.remove('mobile-collapsed');
    }
  }
  
  hideLevelComplete() {
    document.getElementById('levelCompleteModal').classList.remove('show');
  }
  
  moveToNextLevel() {
    const nextLevel = this.getNextLevel();
    if (nextLevel) {
      this.hideLevelComplete();
      this.switchLevel(nextLevel);
    }
  }
  
  reviewLevel() {
    this.hideLevelComplete();
    this.currentQuestionIndex = 0;
    
    // 鬼モードの場合はスタート画面に戻る
    if (this.currentLevel === 'demon') {
      this.demonModeStarted = false;
    }
    
    this.showCurrentQuestion();
  }
  
  getNextLevel() {
    const levels = ['beginner', 'intermediate', 'advanced', 'demon'];
    const currentIndex = levels.indexOf(this.currentLevel);
    return levels[currentIndex + 1] || null;
  }
  
  getNextLevelName() {
    const nextLevel = this.getNextLevel();
    const levelNames = {
      'intermediate': '中級',
      'advanced': '上級',
      'demon': '鬼モード'
    };
    return levelNames[nextLevel] || '';
  }
  
  updateProgress() {
    // 進捗バーは削除済み - 何もしない
  }
  
  loadProgress() {
    try {
      const saved = localStorage.getItem('quiz_progress_v2');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }
  
  saveProgress() {
    try {
      localStorage.setItem('quiz_progress_v2', JSON.stringify(this.progress));
    } catch (e) {
      console.warn('進捗の保存に失敗しました');
    }
  }
  
  // テーマ管理メソッド
  initTheme() {
    const savedTheme = localStorage.getItem('quiz_theme') || 'light';
    this.setTheme(savedTheme);
  }
  
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('.theme-icon');
    
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
    } else {
      themeIcon.textContent = '🌙';
    }
    
    // テーマをローカルストレージに保存
    localStorage.setItem('quiz_theme', theme);
  }
  
  // 鬼モード関連メソッド
  startDemonMode() {
    // 鬼モード開始フラグを設定
    this.demonModeStarted = true;
    
    // スタート画面を非表示にして、コマンド入力エリアを表示
    document.getElementById('demonStartArea').style.display = 'none';
    document.getElementById('commandInputArea').style.display = 'block';
    // スマホ表示時はモード選択を折りたたむ
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      document.body.classList.add('mobile-collapsed');
    }
    
    // 現在の問題で鬼モードをセットアップ
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    this.setupDemonMode(currentQuestion);
  }

  setupDemonMode(question) {
    this.clearCommandOutput();
    document.getElementById('commandInput').value = '';
    document.getElementById('commandInput').focus();
    
    // ヒントボタンを表示
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      hintBtn.style.display = 'block';
    }
    
    // カウントダウン開始
    this.startCountdown();
  }
  
  resetDemonMode() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    this.setupDemonMode(currentQuestion);
  }
  
  executeCommand() {
    const input = document.getElementById('commandInput').value.trim();
    const output = document.getElementById('commandOutput');
    
    if (!input) return;
    
    // コマンド履歴を表示
    this.addCommandOutput(`$ ${input}`, 'command-input');
    
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    // コマンドを実行
    const result = this.simulateCommand(input, currentQuestion);
    
    // 正解判定（コマンド実行結果表示前にチェック）
    if (result.success && this.checkAnswer(input, currentQuestion)) {
      this.stopCountdown(); // カウントダウンを停止
      
      // 進捗記録（正解として記録）
      if (!this.progress[this.currentLevel]) {
        this.progress[this.currentLevel] = {};
      }
      this.progress[this.currentLevel][currentQuestion.id] = true;
      this.saveProgress();
      
      // 正解時はコマンド実行結果を表示せず、直接正解メッセージへ
      setTimeout(() => {
        this.addCommandOutput('✅ 正解！次の問題へ。', 'command-success');
        setTimeout(() => {
          this.nextQuestion();
        }, 1500);
      }, 500);
      return; // 早期リターンでコマンド実行結果の表示をスキップ
    }
    
    // 不正解時のみコマンド実行結果を表示
    if (result.output) {
      this.addCommandOutput(result.output, result.success ? 'command-success' : 'command-error');
    }
    
    // 不正解時の進捗記録（コマンド入力したが間違った場合）
    if (result.success && !this.checkAnswer(input, currentQuestion)) {
      // 有効なコマンドだったが答えが間違っていた場合
      if (!this.progress[this.currentLevel]) {
        this.progress[this.currentLevel] = {};
      }
      this.progress[this.currentLevel][currentQuestion.id] = false;
      this.saveProgress();
      
      // 不正解メッセージと答えを表示
      setTimeout(() => {
        this.addCommandOutput('❌ 不正解です。', 'command-error');
        this.showDemonAnswer(currentQuestion);
        setTimeout(() => {
          this.nextQuestion();
        }, 2000);
      }, 500);
      return;
    }
    
    document.getElementById('commandInput').value = '';
  }
  
  simulateCommand(command, question) {
    // シンプルなコマンド検証のみ実行
    const cmd = command.split(' ')[0];
    const validCommands = ['touch', 'mkdir', 'ls', 'cat', 'cp', 'rm', 'find', 'grep', 'echo', 'cd', 'pwd'];
    
    if (validCommands.includes(cmd)) {
      return { output: `Command '${cmd}' executed successfully`, success: true };
    }
    return { output: `bash: ${cmd}: command not found`, success: false };
  }
  
  checkAnswer(command, question) {
    const normalizedCommand = (command || '').trim().toLowerCase();
    const expectedCommand = (question.expectedCommand || '').trim().toLowerCase();

    // ファイルシステム状態での正解判定は無効化（機能削除のため）
    // コマンド文字列での判定のみ使用

    // コマンド文字列での判定（緩めの比較）
    const strip = (s) => s.replace(/"/g, '').replace(/\s+/g, ' ').trim();

    if (strip(normalizedCommand) === strip(expectedCommand)) {
      return true;
    }

    // 代替形式もチェック（例：ls -al と ls -la）
    if (expectedCommand.includes('ls -la') || expectedCommand.includes('ls -al')) {
      return normalizedCommand.includes('ls') &&
             (normalizedCommand.includes('-la') || normalizedCommand.includes('-al'));
    }

    return false;
  }
  
  addCommandOutput(text, className = '') {
    const output = document.getElementById('commandOutput');
    const div = document.createElement('div');
    div.textContent = text;
    if (className) {
      div.className = className;
    }
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
    output.style.display = 'block';
  }
  
  clearCommandOutput() {
    const output = document.getElementById('commandOutput');
    output.innerHTML = '';
    output.style.display = 'none';
  }
  
  skipDemonQuestion() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    this.stopCountdown(); // カウントダウンを停止
    
    // スキップしたことを記録
    if (!this.progress[this.currentLevel]) {
      this.progress[this.currentLevel] = {};
    }
    this.progress[this.currentLevel][currentQuestion.id] = false; // スキップは「知らない」として記録
    this.saveProgress();
    
    // スキップメッセージと答えを表示
    this.addCommandOutput('⏭️ 問題をスキップしました。答えを表示します。', 'command-error');
    this.showDemonAnswer(currentQuestion);
    
    // 2秒後に次の問題へ
    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }

  // 鬼モード: 問題と問題の間に答えを表示
  showDemonAnswer(question) {
    if (!question) return;
    const answer = question.expectedCommand || '';
    if (answer) {
      // ヒントボタンを非表示にする
      const hintBtn = document.getElementById('hintBtn');
      if (hintBtn) {
        hintBtn.style.display = 'none';
      }
      
      this.addCommandOutput('', ''); // 空行を追加
      this.addCommandOutput('💡 正解は:', 'command-answer-label');
      this.addCommandOutput('  ' + answer, 'command-answer');
      this.addCommandOutput('', ''); // 空行を追加
    }
  }
  
  showHint() {
    const questions = QUIZ_QUESTIONS[this.currentLevel];
    const currentQuestion = questions[this.currentQuestionIndex];
    
    if (currentQuestion.hint) {
      this.addCommandOutput('💡 ' + currentQuestion.hint, 'command-hint');
    } else {
      this.addCommandOutput('💡 ' + currentQuestion.expectedCommand, 'command-hint');
    }
    
    // ヒントボタンを一時的に無効化
    const hintBtn = document.getElementById('hintBtn');
    hintBtn.disabled = true;
    hintBtn.textContent = '💡 使用済み';
    
    setTimeout(() => {
      hintBtn.disabled = false;
      hintBtn.textContent = 'ヒント(del×2)';
    }, 5000);
  }
  
  shuffleQuestions() {
    // 鬼モードでのみ動作
    if (this.currentLevel !== 'demon') return;
    
    // カウントダウンを停止
    this.stopCountdown();
    
    // 新しい問題セットを生成（既存のbuildDemonQuestionSetを再利用）
    this.buildDemonQuestionSet();
    
    // 現在の問題インデックスをリセット
    this.currentQuestionIndex = 0;
    
    // 進捗をクリア（新しい問題セットなので）
    if (this.progress[this.currentLevel]) {
      delete this.progress[this.currentLevel];
    }
    this.saveProgress();
    
    // 問題表示を更新
    this.showCurrentQuestion();
    
    // シャッフル完了メッセージ
    this.addCommandOutput('🎲 問題をシャッフルしました！新しい10問に挑戦しましょう。', 'command-success');
    
    // シャッフルボタンを一時的に無効化
    const shuffleBtn = document.getElementById('shuffleBtn');
    shuffleBtn.disabled = true;
    shuffleBtn.style.opacity = '0.5';
    
    setTimeout(() => {
      shuffleBtn.disabled = false;
      shuffleBtn.style.opacity = '1';
    }, 3000);
  }
  
  // カウントダウン機能
  startCountdown() {
    // 既存のタイマーをクリア
    this.stopCountdown();
    
    // 爆弾タイマー表示
    const bombTimer = document.getElementById('bombTimer');
    const fuse = document.getElementById('fuse');
    const spark = document.getElementById('spark');
    
    this.timeRemaining = 12;
    bombTimer.style.display = 'flex';
    
    // 導火線と火花の初期化
    fuse.style.setProperty('--burn-progress', '0%');
    spark.style.setProperty('--spark-position', '0%');
    
    // カウントダウン開始
    this.countdownTimer = setInterval(() => {
      this.timeRemaining--;
      
      // 爆弾アニメーション更新
      const progress = ((12 - this.timeRemaining) / 12) * 100;
      fuse.style.setProperty('--burn-progress', `${progress}%`);
      spark.style.setProperty('--spark-position', `${progress}%`);
      
      // 緊迫想を演出（残り3秒以下でアニメーション速度アップ）
      const bomb = document.querySelector('.bomb');
      if (this.timeRemaining <= 3) {
        bomb.style.animationDuration = '0.05s';
        spark.style.fontSize = '16px';
      } else if (this.timeRemaining <= 5) {
        bomb.style.animationDuration = '0.08s';
        spark.style.fontSize = '14px';
      }
      
      // タイムアップ
      if (this.timeRemaining <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }
  
  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    
    // 爆弾タイマー非表示
    const bombTimer = document.getElementById('bombTimer');
    bombTimer.style.display = 'none';
    
    // スタイルリセット
    const bomb = document.querySelector('.bomb');
    const spark = document.getElementById('spark');
    if (bomb) {
      bomb.style.animationDuration = '';
    }
    if (spark) {
      spark.style.fontSize = '';
    }
  }
  
  handleTimeUp() {
    // 爆発エフェクト
    this.showExplosion();
    
    setTimeout(() => {
      this.stopCountdown();
      
      // タイムアップメッセージ
      
      // 進捗記録（タイムアップは「知らない」として記録）
      const questions = QUIZ_QUESTIONS[this.currentLevel];
      const currentQuestion = questions[this.currentQuestionIndex];
      
      if (!this.progress[this.currentLevel]) {
        this.progress[this.currentLevel] = {};
      }
      this.progress[this.currentLevel][currentQuestion.id] = false;
      this.saveProgress();
      
      // 答えを表示してから次の問題へ
      this.showDemonAnswer(currentQuestion);
      setTimeout(() => {
        this.nextQuestion();
      }, 2000);
    }, 500);
  }
  
  showExplosion() {
    const bomb = document.querySelector('.bomb');
    const spark = document.getElementById('spark');
    
    // 爆発エフェクト
    bomb.textContent = '💥';
    bomb.style.animation = 'explosion 0.5s ease-out';
    spark.style.display = 'none';
    
    // 爆発音効果（視覚的）
    setTimeout(() => {
      bomb.style.transform = 'scale(1)';
      bomb.style.opacity = '1';
      bomb.textContent = '💣';
      bomb.style.animation = 'bombShake 0.1s infinite';
      spark.style.display = 'block';
    }, 500);
  }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});